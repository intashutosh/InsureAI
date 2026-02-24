from ultralytics import YOLO
import numpy as np

def get_parts_by_model(img_path, model_part):
    """Get parts detected by a single model (segmentation or detection)"""
    parts = []
    preds = model_part.predict(img_path, task='segment', conf=0.1, imgsz=640)  # adjust conf/imgsz as needed
    
    for r in preds:
        # 1️⃣ If model outputs masks (segmentation)
        if hasattr(r, 'masks') and r.masks is not None:
            masks = r.masks
            if hasattr(masks, 'cls') and masks.cls is not None:
                for i, cls_id in enumerate(masks.cls):
                    mask = masks.data[i].cpu().numpy()
                    y, x = np.where(mask)
                    if len(x) == 0 or len(y) == 0:
                        continue
                    bbox = [int(x.min()), int(y.min()), int(x.max()), int(y.max())]
                    parts.append({"part": model_part.names[int(cls_id)], "bbox": bbox})

        # 2️⃣ If model outputs boxes (detection)
        if hasattr(r, 'boxes') and r.boxes is not None:
            boxes = r.boxes
            if hasattr(boxes, 'cls') and boxes.cls is not None:
                for box, cls_id in zip(boxes.xyxy, boxes.cls):
                    parts.append({
                        "part": model_part.names[int(cls_id)],
                        "bbox": box.tolist()
                    })
                    
    return parts

model4 = YOLO("runs/segment/train2/weights/best.pt")  # segmentation model
model5 = YOLO("runs/detect/train5/weights/best.pt")   # detection model

image_path = r"C:\Users\intas\OneDrive\Documents\projects_sem3\backend\uploads\1763152155188_silver-car-with-a-large-dent-in-the-side-ruining-two-doors.webp"

parts_model4 = get_parts_by_model(image_path, model4)
parts_model5 = get_parts_by_model(image_path, model5)

print("Parts from Model4:", parts_model4)
print("Parts from Model5:", parts_model5)
