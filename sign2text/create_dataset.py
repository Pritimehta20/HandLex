import os
import pickle
import cv2
import mediapipe as mp
import numpy as np
from tqdm import tqdm

print("🔄 Extracting 42 features (EXACTLY matches your app.py)...")

DATA_DIR = './data'

# ✅ FIXED: SAME MediaPipe settings as your app.py
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=1,                    # Single hand (like app.py)
    min_detection_confidence=0.7        # Higher confidence
)

data = []
labels = []

print(f"📁 Processing {DATA_DIR}...")

for dir_name in sorted(os.listdir(DATA_DIR)):
    class_dir = os.path.join(DATA_DIR, dir_name)
    if not os.path.isdir(class_dir):
        continue
    
    print(f"Processing class {dir_name}")
    
    img_count = 0
    for img_name in os.listdir(class_dir):
        if not img_name.lower().endswith(('.jpg', '.png', '.jpeg')):
            continue
            
        img_path = os.path.join(class_dir, img_name)
        img = cv2.imread(img_path)
        if img is None:
            continue
        
        # ✅ EXACT SAME PROCESSING as your app.py
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = hands.process(img_rgb)
        
        if results.multi_hand_landmarks:
            # ✅ FIRST HAND ONLY (like app.py)
            hand_landmarks = results.multi_hand_landmarks[0]
            
            # ✅ EXACT SAME FEATURE EXTRACTION as app.py
            x_ = []
            y_ = []
            
            # Collect 21 landmarks (X,Y only)
            for i in range(21):
                x = hand_landmarks.landmark[i].x
                y = hand_landmarks.landmark[i].y
                x_.append(x)
                y_.append(y)
            
            # ✅ EXACT SAME NORMALIZATION as app.py
            data_aux = []
            for i in range(21):
                data_aux.append(x_[i] - min(x_))
                data_aux.append(y_[i] - min(y_))
            
            # ✅ VALIDATION: MUST BE 42 FEATURES
            if len(data_aux) == 42:
                data.append(data_aux)
                labels.append(dir_name)
                img_count += 1
    
    print(f"   ✅ {img_count} valid images → {img_count} features extracted")

# Convert to numpy arrays
data = np.array(data, dtype=np.float32)
labels = np.array(labels)

print(f"\n🎉 FINAL RESULT:")
print(f"📊 Shape: {data.shape} (samples, 42 features)")
print(f"🏷️  Classes: {len(np.unique(labels))}")
print(f"✅ {len(data)} total valid samples extracted!")

# Save
with open('data.pickle', 'wb') as f:
    pickle.dump({
        'data': data,
        'labels': labels,
        'n_features': data.shape[1] if len(data) > 0 else 42
    }, f)

print("💾 data.pickle SAVED (42 features - PERFECT for your app.py)!")
print("🚀 Next: python train.py")
