# File: ai_service.py
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from ultralytics import YOLO
import pandas as pd
import numpy as np
import os
import shutil

# -----------------------------
# Load models
# -----------------------------
print("Loading YOLO models...")
model1 = YOLO("runs/classify/train/weights/best.pt")  # Damage/no-damage
model2 = YOLO("runs/detect/train3/weights/best.pt")  # Damage type
model4 = YOLO("runs/segment/train2/weights/best.pt")  # Parts segmentation
model5 = YOLO("runs/detect/train5/weights/best.pt")  # Parts detection
print("Models loaded.")

# -----------------------------
# Load CSV prices
# -----------------------------
price_df = pd.read_csv("parts_prices_standardized.csv")  # columns: part, damage, car_brand, car_model, price
FALLBACK_PRICES = {
    "scratch": 500,
    "dent": 1000,
    "crack": 2000,
    "glass shatter": 3000,
    "lamp broken": 800,
    "tire flat": 1500
}

# -----------------------------
# Helper functions
# -----------------------------
def box_iou(box1, box2):
    """Compute IoU between two bounding boxes [x1,y1,x2,y2]"""
    xA = max(box1[0], box2[0])
    yA = max(box1[1], box2[1])
    xB = min(box1[2], box2[2])
    yB = min(box1[3], box2[3])
    interArea = max(0, xB - xA) * max(0, yB - yA)
    box1Area = (box1[2] - box1[0]) * (box1[3] - box1[1])
    box2Area = (box2[2] - box2[0]) * (box2[3] - box2[1])
    return interArea / (box1Area + box2Area - interArea + 1e-6)

def lookup_price(part, damage, car_brand, car_model):
    """Get price from CSV or fallback"""
    if part:
        row = price_df[
            (price_df['part'] == part) &
            (price_df['car_brand'] == car_brand) &
            (price_df['car_model'] == car_model)
        ]
        if len(row) > 0:
            return float(row['oem_price_inr'].values[0])
    # fallback price if no part match
    return FALLBACK_PRICES.get(damage.lower(), 1000)

# -----------------------------
# Get parts from single model
# -----------------------------
def get_parts_by_model(img_path, model_part, task_type='segment'):
    """
    Detect parts from a single model (segmentation or detection).
    Removes left/right duplicates and overlapping parts automatically.
    """
    parts = []
    preds = model_part.predict(img_path, task=task_type)
    if preds is None:
        return parts

    for r in preds:
        # 1️⃣ Segmentation masks
        masks = getattr(r, 'masks', None)
        if masks is not None and getattr(masks, 'cls', None) is not None:
            for i, cls_id in enumerate(masks.cls):
                mask = masks.data[i].cpu().numpy()
                y, x = np.where(mask)
                if len(x) == 0 or len(y) == 0:
                    continue
                bbox = [int(x.min()), int(y.min()), int(x.max()), int(y.max())]
                part_name = model_part.names[int(cls_id)].replace("left_", "").replace("right_", "")
                parts.append({"part": part_name, "bbox": bbox})

        # 2️⃣ Detection boxes
        boxes = getattr(r, 'boxes', None)
        if boxes is not None:
            for box, cls_id in zip(boxes.xyxy, boxes.cls):
                part_name = model_part.names[int(cls_id)].replace("left_", "").replace("right_", "")
                parts.append({"part": part_name, "bbox": box.tolist()})

    # Remove overlapping duplicates
    cleaned_parts = []
    seen_bboxes = []
    for p in parts:
        overlap = False
        for b in seen_bboxes:
            if box_iou(p['bbox'], b) > 0.7:  # consider overlap threshold
                overlap = True
                break
        if not overlap:
            cleaned_parts.append(p)
            seen_bboxes.append(p['bbox'])
    return cleaned_parts

# -----------------------------
# Process image
# -----------------------------
def process_image(img_path, car_brand, car_model, iou_threshold=0.1):
    """Run all models and return structured results with damage-part matching"""

    # 1️⃣ Check damage classification
    m1 = model1.predict(img_path)
    if m1 is None or len(m1) == 0:
        return {"image": img_path, "predictions": []}

    # 2️⃣ Get damage types
    damages = []
    m2 = model2.predict(img_path)
    if m2 is not None:
        for res in m2:
            boxes = getattr(res, 'boxes', None)
            if boxes is not None:
                for box, cls_id in zip(boxes.xyxy, boxes.cls):
                    damages.append({
                        "damage": model2.names[int(cls_id)],
                        "bbox": box.tolist()
                    })

    if len(damages) == 0:
        return {"image": img_path, "predictions": []}

    # 3️⃣ Get parts from model4 and model5
    parts_model4 = get_parts_by_model(img_path, model4, task_type='segment')
    parts_model5 = get_parts_by_model(img_path, model5, task_type='segment')
    all_parts = parts_model4 + parts_model5

    # 4️⃣ Match each damage to best overlapping part
    temp_predictions = []
    for d in damages:
        dmg_box = d['bbox']
        matched_part = None
        max_iou = 0
        for p in all_parts:
            iou = box_iou(dmg_box, p['bbox'])
            if iou > max_iou:
                max_iou = iou
                matched_part = p['part']

        # Only accept match if IoU >= threshold
        if max_iou < iou_threshold:
            matched_part = None

        # Only include part if matched to damage
        if matched_part:
            price = lookup_price(matched_part, d['damage'], car_brand, car_model)
            temp_predictions.append({
                "part": matched_part,
                "damage": d['damage'],
                "price": price
            })

    # 5️⃣ Remove duplicate part-damage entries
    seen = set()
    final_predictions = []
    for pred in temp_predictions:
        key = (pred['part'], pred['damage'])
        if key not in seen:
            final_predictions.append(pred)
            seen.add(key)

    return {
        "image": img_path,
        "predictions": final_predictions
    }


# -----------------------------
# FastAPI app
# -----------------------------
app = FastAPI(title="Car Damage AI Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/predict")
async def predict(
    images: List[UploadFile] = File(...),
    brand: str = Form(...),
    model: str = Form(...)
):
    results = []

    for img_file in images:
        temp_path = os.path.join(UPLOAD_DIR, img_file.filename)
        with open(temp_path, "wb") as f:
            shutil.copyfileobj(img_file.file, f)

        result = process_image(temp_path, brand, model)
        # Frontend-accessible path
        result['image'] = f"/uploads/{img_file.filename}"
        results.append(result)

        img_file.file.close()

    return {"results": results}
