import os
import cv2
from tqdm import tqdm

DATA_DIR = './data'
os.makedirs(DATA_DIR, exist_ok=True)

# index 0 -> 'A', 1 -> 'B', ..., 32 -> 'You are welcome.', 33 -> 'Stop'
class_names = [
    'A','B','C','D','E','F','G','H','I','J',
    'K','L','M','N','O','P','Q','R','S','T',
    'U','V','W','X','Y','Z',
    'Hello','Done','Thank You','I Love you','Sorry','Please','You are welcome.',
    'Stop' , 'Help' , 'Water' , 'More' , 'Friend' , 'ok' ,'Space',  'ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE','TEN',# new word at the end
]

dataset_size = 100
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

for idx, class_name in enumerate(class_names):
    class_dir = os.path.join(DATA_DIR, str(idx))   # folders: 0,1,2,...,33
    os.makedirs(class_dir, exist_ok=True)

    print(f"\n🎯 Collect '{class_name}' into folder {idx} ({dataset_size} images)")

    # Ready screen
    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Camera error")
            cap.release()
            cv2.destroyAllWindows()
            raise SystemExit

        frame = cv2.flip(frame, 1)
        cv2.putText(frame, f"Show '{class_name}' → Press Q", (50, 100),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)
        cv2.putText(frame, "ESC to skip", (50, 150),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,0,255), 2)
        cv2.imshow('Collect Data', frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        if key == 27:  # ESC
            print(f"⏭️ Skipped '{class_name}'")
            class_dir = None
            break

    if class_dir is None:
        continue

    # Capture loop
    count = 0
    while count < dataset_size:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        cv2.putText(frame, f"{class_name} {count+1}/{dataset_size}", (50, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)
        cv2.imshow('Collect Data', frame)

        cv2.imwrite(os.path.join(class_dir, f"{count:03d}.jpg"), frame)
        count += 1

        if cv2.waitKey(50) & 0xFF == 27:
            print(f"⏹️ Stopped early at {count} images for '{class_name}'")
            break

cap.release()
cv2.destroyAllWindows()
print("✅ Data collection COMPLETE!")
