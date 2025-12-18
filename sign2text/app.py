

# from flask import Flask, render_template, Response, jsonify
# from flask_socketio import SocketIO
# from flask_cors import CORS
# import pickle
# import cv2
# import mediapipe as mp
# import numpy as np
# import warnings
# import threading
# from collections import deque
# import math

# warnings.filterwarnings(
#     "ignore",
#     message="SymbolDatabase.GetPrototype() is deprecated. Please use message_factory.GetMessageClass() instead."
# )

# app = Flask(__name__)
# app.config['SECRET_KEY'] = 'secret!'

# # CORS for HTTP routes (React 5173)
# CORS(app, origins=["http://localhost:5173"])

# # SocketIO CORS
# socketio = SocketIO(
#     app,
#     cors_allowed_origins="*",
#     logger=True,
#     engineio_logger=True
# )

# # GLOBAL CAMERA CONTROL
# camera_active = False
# cap = None
# camera_lock = threading.Lock()

# # ---------- HEURISTICS STATE ----------
# no_hand_frames = 0
# last_box_center = None

# # ---------- PRACTICE MODE CONFIG (STATIC SIGNS ONLY) ----------

# # id: used in API, label: must match model output (labels_dict value)
# # image: path served by React (public/practice/...)
# PRACTICE_TASKS = [
#     {"id": "A", "label": "A", "title": "Show sign A", "image": "/lessons/alphabets/A.png","lessonId": "alphabet"},
#     {"id": "B", "label": "B", "title": "Show sign B", "image": "/lessons/alphabets/B.png","lessonId": "alphabet"},
#     {"id": "C", "label": "C", "title": "Show sign C", "image": "/lessons/alphabets/C.png","lessonId": "alphabet"},
#     {"id": "D", "label": "D", "title": "Show sign D", "image": "/lessons/alphabets/D.png","lessonId": "alphabet"},
#     {"id": "E", "label": "E", "title": "Show sign E", "image": "/lessons/alphabets/E.png","lessonId": "alphabet"},
#     {"id": "F", "label": "F", "title": "Show sign F", "image": "/lessons/alphabets/F.png","lessonId": "alphabet"},
#     {"id": "G", "label": "G", "title": "Show sign G", "image": "/lessons/alphabets/G.png","lessonId": "alphabet"},
#     {"id": "H", "label": "H", "title": "Show sign H", "image": "/lessons/alphabets/H.png","lessonId": "alphabet"},
#     {"id": "I", "label": "I", "title": "Show sign I", "image": "/lessons/alphabets/I.png","lessonId": "alphabet"},
#     {"id": "J", "label": "J", "title": "Show sign J", "image": "/lessons/alphabets/J.png","lessonId": "alphabet"},
#     {"id": "K", "label": "K", "title": "Show sign K", "image": "/lessons/alphabets/K.png","lessonId": "alphabet"},
#     {"id": "L", "label": "L", "title": "Show sign L", "image": "/lessons/alphabets/L.png","lessonId": "alphabet"},
#     {"id": "M", "label": "M", "title": "Show sign M", "image": "/lessons/alphabets/M.png","lessonId": "alphabet"},
#     {"id": "N", "label": "N", "title": "Show sign N", "image": "/lessons/alphabets/N.png","lessonId": "alphabet"},
#     {"id": "O", "label": "O", "title": "Show sign O", "image": "/lessons/alphabets/O.png","lessonId": "alphabet"},
#     {"id": "P", "label": "P", "title": "Show sign P", "image": "/lessons/alphabets/P.png","lessonId": "alphabet"},
#     {"id": "Q", "label": "Q", "title": "Show sign Q", "image": "/lessons/alphabets/Q.png","lessonId": "alphabet"},
#     {"id": "R", "label": "R", "title": "Show sign R", "image": "/lessons/alphabets/R.png","lessonId": "alphabet"},
#     {"id": "S", "label": "S", "title": "Show sign S", "image": "/lessons/alphabets/S.png","lessonId": "alphabet"},
#     {"id": "T", "label": "T", "title": "Show sign T", "image": "/lessons/alphabets/T.png","lessonId": "alphabet"},
#     {"id": "U", "label": "U", "title": "Show sign U", "image": "/lessons/alphabets/U.png","lessonId": "alphabet"},
#     {"id": "V", "label": "V", "title": "Show sign V", "image": "/lessons/alphabets/V.png","lessonId": "alphabet"},
#     {"id": "W", "label": "W", "title": "Show sign W", "image": "/lessons/alphabets/W.png","lessonId": "alphabet"},
#     {"id": "X", "label": "X", "title": "Show sign X", "image": "/lessons/alphabets/X.png","lessonId": "alphabet"},
#     {"id": "Y", "label": "Y", "title": "Show sign Y", "image": "/lessons/alphabets/Y.png","lessonId": "alphabet"},
#     {"id": "Z", "label": "Z", "title": "Show sign Z", "image": "/lessons/alphabets/Z.png","lessonId": "alphabet"},

#     # 💬 Common Interaction Signs
#     {"id": "Hello", "label": "Hello", "title": "Show sign Hello", "image": "/lessons/Common_interaction/HELLO.png"},
#     {"id": "Done", "label": "Done", "title": "Show sign Done", "image": "/lessons/Common_interaction/Done.png"},
#     {"id": "Thank You", "label": "Thank You", "title": "Show sign Thank You", "image": "/lessons/Common_interaction/Thankyou.png"},
#     {"id": "I Love you", "label": "I Love you", "title": "Show sign I Love You", "image": "/lessons/Common_interaction/ILoveYou.png"},
#     {"id": "Sorry", "label": "Sorry", "title": "Show sign Sorry", "image": "/lessons/Common_interaction/Sorry.png"},
#     {"id": "Please", "label": "Please", "title": "Show sign Please", "image": "/lessons/Common_interaction/Please.png"},
#     {"id": "You are welcome.", "label": "You are welcome.", "title": "Show sign You Are Welcome", "image": "/lessons/Common_interaction/YouareWelcome.png"},
#     {"id": "Stop", "label": "Stop", "title": "Show sign Stop", "image": "/lessons/Common_interaction/Stop.png"},
#     {"id": "Help", "label": "Help", "title": "Show sign Help", "image": "/lessons/Common_interaction/Help.png"},
#     {"id": "Water", "label": "Water", "title": "Show sign Water", "image": "/lessons/Common_interaction/Water.png"},
#     {"id": "More", "label": "More", "title": "Show sign More", "image": "/lessons/Common_interaction/More.png"},
#     {"id": "Friend", "label": "Friend", "title": "Show sign Friend", "image": "/lessons/Common_interaction/Friend.png"},
#     {"id": "ok", "label": "ok", "title": "Show sign OK", "image": "/lessons/Common_interaction/ok.png"},

#     # Numbers
#     {"id": "NUM_1", "label": "D", "image": "/lessons/numbers/one.png","lessonId": "numbers"},
#   { "id": "NUM_2",  "label": "B",  "image": "/lessons/numbers/two.png",   "lessonId": "numbers" },
#   { "id": "NUM_3",  "label": "C",  "image": "/lessons/numbers/three.png", "lessonId": "numbers" },
#   { "id": "NUM_4",  "label": "D",  "image": "/lessons/numbers/four.png",  "lessonId": "numbers" },
#   { "id": "NUM_5",  "label": "E",  "image": "/lessons/numbers/five.png",  "lessonId": "numbers" },
#   { "id": "NUM_6",  "label": "F",  "image": "/lessons/numbers/six.png",   "lessonId": "numbers" },
#   { "id": "NUM_7",  "label": "G",  "image": "/lessons/numbers/seven.png", "lessonId": "numbers" },
#   { "id": "NUM_8",  "label": "H",  "image": "/lessons/numbers/eight.png", "lessonId": "numbers" },
#   { "id": "NUM_9",  "label": "I",  "image": "/lessons/numbers/nine.png",  "lessonId": "numbers" },
#   { "id": "NUM_10", "label": "J", "image": "/lessons/numbers/ten.png",   "lessonId": "numbers" }
# ]

# current_practice_task = None              # dict from PRACTICE_TASKS or None
# recent_predictions = deque(maxlen=30)     # last ~1 sec of predictions

# # ---------- HELPERS ----------

# def calc_angle(a, b, c):
#     """Angle at point b (a-b-c) in degrees."""
#     ax, ay = a
#     bx, by = b
#     cx, cy = c
#     ab = (ax - bx, ay - by)
#     cb = (cx - bx, cy - by)
#     dot = ab[0] * cb[0] + ab[1] * cb[1]
#     mag_ab = math.hypot(ab[0], ab[1])
#     mag_cb = math.hypot(cb[0], cb[1])
#     if mag_ab == 0 or mag_cb == 0:
#         return 0.0
#     cos_angle = max(min(dot / (mag_ab * mag_cb), 1.0), -1.0)
#     return math.degrees(math.acos(cos_angle))

# # ---------- MODEL LOAD ----------

# try:
#     model_dict = pickle.load(open('./model.p', 'rb'))
#     model = model_dict['model']
#     print("✅ Model loaded successfully!")
# except Exception as e:
#     print("❌ Error loading the model:", e)
#     model = None

# # ---------- BASIC ROUTES ----------

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/api/start-camera', methods=['POST'])
# def start_camera():
#     global camera_active, cap
#     with camera_lock:
#         if not camera_active:
#             cap = cv2.VideoCapture(0)
#             cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
#             cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
#             camera_active = True
#             print("✅ 🚀 Camera STARTED")
#             return jsonify({"status": "started", "camera_active": True})
#         return jsonify({"status": "already_running", "camera_active": True})

# @app.route('/api/stop-camera', methods=['POST'])
# def stop_camera():
#     global camera_active, cap
#     with camera_lock:
#         if camera_active and cap:
#             cap.release()
#             cap = None
#             camera_active = False
#             print("✅ 🛑 Camera STOPPED")
#             return jsonify({"status": "stopped", "camera_active": False})
#         return jsonify({"status": "already_stopped", "camera_active": False})

# @app.route('/api/camera-status')
# def camera_status():
#     global camera_active
#     return jsonify({
#         "camera_active": camera_active,
#         "service": "sign-to-text",
#         "status": "online",
#         "model_loaded": model is not None
#     })

# @app.route('/api/status')
# def status():
#     return jsonify({
#         "service": "sign-to-text",
#         "status": "online",
#         "model_loaded": model is not None,
#         "camera_active": camera_active
#     })

# # ---------- PRACTICE ROUTES ----------

# @app.route('/api/practice/tasks')
# def practice_tasks():
#     # single list, React will show chips for these
#     return jsonify({"tasks": PRACTICE_TASKS})

# @app.route('/api/practice/select/<task_id>', methods=['POST'])
# def practice_select(task_id):
#     global current_practice_task, recent_predictions
#     for t in PRACTICE_TASKS:
#         if t["id"] == task_id:
#             current_practice_task = t
#             recent_predictions.clear()
#             print(f"🎯 Practice task selected: {t}")
#             return jsonify({"status": "ok", "task": t})
#     return jsonify({"status": "error", "message": "Task not found"}), 404

# # ---------- SOCKET.IO ----------

# @socketio.on('connect')
# def handle_connect():
#     print('✅ SocketIO Client connected!')

# # ---------- VIDEO STREAM + SIGN→TEXT + HINTS + PRACTICE FEEDBACK ----------

# def generate_frames():
#     global camera_active, cap
#     global no_hand_frames, last_box_center, current_practice_task, recent_predictions

#     if not camera_active or cap is None:
#         frame = np.zeros((480, 640, 3), dtype=np.uint8)
#         cv2.putText(frame, "Camera OFF - Click Dashboard", (80, 240),
#                     cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
#         cv2.putText(frame, "Sign → Text Button", (120, 280),
#                     cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
#         ret, buffer = cv2.imencode('.jpg', frame)
#         frame_bytes = buffer.tobytes()
#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
#         return

#     mp_hands = mp.solutions.hands
#     mp_drawing = mp.solutions.drawing_utils
#     mp_drawing_styles = mp.solutions.drawing_styles

#     hands = mp_hands.Hands(
#         static_image_mode=False,
#         max_num_hands=2,
#         min_detection_confidence=0.5,
#         min_tracking_confidence=0.5
#     )

#     labels_dict = {
#         0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J',
#         10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S',
#         19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y', 25: 'Z', 26: 'Hello',
#         27: 'Done', 28: 'Thank You', 29: 'I Love you', 30: 'Sorry', 31: 'Please',
#         32: 'You are welcome.', 33: 'Stop', 34: 'Help', 35: 'Water', 36: 'More',
#         37: 'Friend', 38: 'ok', 39: 'Space'
#     }

#     print("LABEL KEYS:", sorted(labels_dict.keys()))

#     LOW_BRIGHT = 60.0
#     HIGH_BRIGHT = 190.0
#     MIN_BOX_AREA_RATIO = 0.02
#     MAX_CENTER_MOVE = 80.0
#     NO_HAND_MAX_FRAMES = 15

#     while camera_active:
#         with camera_lock:
#             if cap is None or not cap.isOpened():
#                 break
#             ret, frame = cap.read()
#             if not ret:
#                 print("❌ Camera read failed")
#                 break

#         frame = cv2.flip(frame, 1)
#         H, W, _ = frame.shape

#         # ---------- brightness heuristic ----------
#         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#         mean_brightness = float(np.mean(gray))

#         hint = None
#         if mean_brightness < LOW_BRIGHT:
#             hint = "Background is too dark. Try turning on a light or facing a window."
#         elif mean_brightness > HIGH_BRIGHT:
#             hint = "Scene is too bright. Move a bit away from direct light."

#         # ---------- Mediapipe detection ----------
#         frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#         results = hands.process(frame_rgb)

#         angle_index = 0.0  # default for practice feedback

#         if not results.multi_hand_landmarks:
#             no_hand_frames += 1
#             if no_hand_frames > NO_HAND_MAX_FRAMES and hint is None:
#                 hint = "Your hand is not in frame. Raise your hand in front of the camera."
#         else:
#             no_hand_frames = 0
#             hand_landmarks = results.multi_hand_landmarks[0]

#             mp_drawing.draw_landmarks(
#                 frame,
#                 hand_landmarks,
#                 mp_hands.HAND_CONNECTIONS,
#                 mp_drawing_styles.get_default_hand_landmarks_style(),
#                 mp_drawing_styles.get_default_hand_connections_style()
#             )

#             x_ = []
#             y_ = []
#             for lm in hand_landmarks.landmark:
#                 x_.append(lm.x)
#                 y_.append(lm.y)

#             data_aux = []
#             min_x = min(x_)
#             min_y = min(y_)
#             for x, y in zip(x_, y_):
#                 data_aux.append(x - min_x)
#                 data_aux.append(y - min_y)

#             x1 = int(min_x * W) - 10
#             y1 = int(min_y * H) - 10
#             x2 = int(max(x_) * W) + 10
#             y2 = int(max(y_) * H) + 10

#             # distance / size heuristic
#             box_w = max(1, x2 - x1)
#             box_h = max(1, y2 - y1)
#             box_area_ratio = (box_w * box_h) / float(W * H)
#             if box_area_ratio < MIN_BOX_AREA_RATIO and hint is None:
#                 hint = "Move closer to the camera so your hand looks bigger on screen."

#             # motion / steadiness heuristic
#             cx = (x1 + x2) / 2.0
#             cy = (y1 + y2) / 2.0
#             if last_box_center is not None:
#                 dx = abs(cx - last_box_center[0])
#                 dy = abs(cy - last_box_center[1])
#                 if (dx + dy) > MAX_CENTER_MOVE and hint is None:
#                     hint = "Try signing slower and keep your hand steady."
#             last_box_center = (cx, cy)

#             # angle example: wrist -> index MCP -> index PIP
#             wrist = hand_landmarks.landmark[mp_hands.HandLandmark.WRIST]
#             idx_mcp = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_MCP]
#             idx_pip = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_PIP]
#             angle_index = calc_angle(
#                 (wrist.x, wrist.y),
#                 (idx_mcp.x, idx_mcp.y),
#                 (idx_pip.x, idx_pip.y),
#             )

#             # ---------- Prediction ----------
#             try:
#                 print(f"🔥 DEBUG: Hands detected! data_aux={len(data_aux)}")

#                 if len(data_aux) != 42:
#                     print("❌ Skipping frame: not 42 features")
#                 elif model is not None:
#                     X_input = np.asarray(data_aux, dtype=np.float32).reshape(1, -1)

#                     prediction = model.predict(X_input)
#                     prediction_proba = model.predict_proba(X_input)
#                     confidence = float(np.max(prediction_proba[0]))

#                     print(f"✅ PREDICTION: {prediction[0]} conf={confidence:.3f}")

#                     label_idx = int(prediction[0])
#                     if label_idx not in labels_dict:
#                         print(f"❌ Missing label for index {label_idx}")
#                     else:
#                         predicted_character = labels_dict[label_idx]

#                         # Emit for Sign→Text screen (if you still use it)
#                         socketio.emit('prediction', {
#                             'text': predicted_character,
#                             'confidence': confidence
#                         })
#                         print(f"📡 SENT SOCKET: {predicted_character}")

#                         cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 4)
#                         cv2.putText(
#                             frame,
#                             f"{predicted_character} ({confidence*100:.1f}%)",
#                             (x1, y1 - 10),
#                             cv2.FONT_HERSHEY_SIMPLEX,
#                             1.3,
#                             (0, 255, 0),
#                             3
#                         )

#                         # Track for practice
#                         recent_predictions.append({
#                             "label_idx": label_idx,
#                             "label": predicted_character,
#                             "confidence": confidence
#                         })

#                 else:
#                     print("❌ Model not loaded - skipping prediction")

#             except Exception as e:
#                 print(f"❌ ERROR: {e}")
#                 print(f"   data_aux len: {len(data_aux)}")
#                 import traceback
#                 traceback.print_exc()

#         # ---------- Emit hint ----------
#         if hint is not None:
#             socketio.emit('hint', {'message': hint})

#         # ---------- Practice feedback ----------
#         if current_practice_task is not None and len(recent_predictions) > 0:
#             target_label = current_practice_task["label"]
#             total = len(recent_predictions)
#             correct = sum(1 for p in recent_predictions if p["label"] == target_label)
#             score = int((correct / total) * 100)

#             avg_conf = float(np.mean([p["confidence"] for p in recent_predictions]))
#             handshape_ok = avg_conf >= 0.5

#             details = {
#                 "score": score,
#                 "avg_conf": avg_conf,
#                 "angle_index": float(angle_index),
#                 "handshape": "Good" if handshape_ok else "Needs improvement",
#             }

#             socketio.emit('practice_feedback', {
#                 "taskId": current_practice_task["id"],
#                 "target": target_label,
#                 "details": details
#             })

#         # ---------- Streaming ----------
#         ret, buffer = cv2.imencode('.jpg', frame)
#         frame_bytes = buffer.tobytes()
#         yield (
#             b'--frame\r\n'
#             b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n'
#         )

# @app.route('/video_feed')
# def video_feed():
#     return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# if __name__ == '__main__':
#     print("🚀 Sign→Text + Practice running on http://localhost:5000")
#     print("✅ Camera Control APIs: /api/start-camera, /api/stop-camera")
#     print("✅ CORS enabled for React 5173")
#     print("✅ SocketIO CORS fixed - No more 400 errors!")
#     socketio.run(app, debug=True, host='0.0.0.0', port=5000)


# python -m venv venv
# source venv/bin/activate
# pip install -r requirements.txt
# pip install flask-cors
from flask import Flask, render_template, Response, jsonify, request
from flask_socketio import SocketIO
from flask_cors import CORS
import pickle
import cv2
import mediapipe as mp
import numpy as np
import warnings
import threading
from collections import deque
import math

warnings.filterwarnings(
    "ignore",
    message="SymbolDatabase.GetPrototype() is deprecated. Please use message_factory.GetMessageClass() instead."
)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

# CORS for HTTP routes (React 5173)
CORS(app, origins=["http://localhost:5173"])

# SocketIO CORS
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    logger=True,
    engineio_logger=True
)

# GLOBAL CAMERA CONTROL
camera_active = False
cap = None
camera_lock = threading.Lock()

# ---------- HEURISTICS STATE ----------
no_hand_frames = 0
last_box_center = None

# ---------- PRACTICE MODE CONFIG (STATIC SIGNS ONLY) ----------

PRACTICE_TASKS = [
    # Alphabet
    {"id": "A", "label": "A", "title": "Show sign A", "image": "/lessons/alphabets/A.png", "lessonId": "alphabet"},
    {"id": "B", "label": "B", "title": "Show sign B", "image": "/lessons/alphabets/B.png", "lessonId": "alphabet"},
    {"id": "C", "label": "C", "title": "Show sign C", "image": "/lessons/alphabets/C.png", "lessonId": "alphabet"},
    {"id": "D", "label": "D", "title": "Show sign D", "image": "/lessons/alphabets/D.png", "lessonId": "alphabet"},
    {"id": "E", "label": "E", "title": "Show sign E", "image": "/lessons/alphabets/E.png", "lessonId": "alphabet"},
    {"id": "F", "label": "F", "title": "Show sign F", "image": "/lessons/alphabets/F.png", "lessonId": "alphabet"},
    {"id": "G", "label": "G", "title": "Show sign G", "image": "/lessons/alphabets/G.png", "lessonId": "alphabet"},
    {"id": "H", "label": "H", "title": "Show sign H", "image": "/lessons/alphabets/H.png", "lessonId": "alphabet"},
    {"id": "I", "label": "I", "title": "Show sign I", "image": "/lessons/alphabets/I.png", "lessonId": "alphabet"},
    {"id": "J", "label": "J", "title": "Show sign J", "image": "/lessons/alphabets/J.png", "lessonId": "alphabet"},
    {"id": "K", "label": "K", "title": "Show sign K", "image": "/lessons/alphabets/K.png", "lessonId": "alphabet"},
    {"id": "L", "label": "L", "title": "Show sign L", "image": "/lessons/alphabets/L.png", "lessonId": "alphabet"},
    {"id": "M", "label": "M", "title": "Show sign M", "image": "/lessons/alphabets/M.png", "lessonId": "alphabet"},
    {"id": "N", "label": "N", "title": "Show sign N", "image": "/lessons/alphabets/N.png", "lessonId": "alphabet"},
    {"id": "O", "label": "O", "title": "Show sign O", "image": "/lessons/alphabets/O.png", "lessonId": "alphabet"},
    {"id": "P", "label": "P", "title": "Show sign P", "image": "/lessons/alphabets/P.png", "lessonId": "alphabet"},
    {"id": "Q", "label": "Q", "title": "Show sign Q", "image": "/lessons/alphabets/Q.png", "lessonId": "alphabet"},
    {"id": "R", "label": "R", "title": "Show sign R", "image": "/lessons/alphabets/R.png", "lessonId": "alphabet"},
    {"id": "S", "label": "S", "title": "Show sign S", "image": "/lessons/alphabets/S.png", "lessonId": "alphabet"},
    {"id": "T", "label": "T", "title": "Show sign T", "image": "/lessons/alphabets/T.png", "lessonId": "alphabet"},
    {"id": "U", "label": "U", "title": "Show sign U", "image": "/lessons/alphabets/U.png", "lessonId": "alphabet"},
    {"id": "V", "label": "V", "title": "Show sign V", "image": "/lessons/alphabets/V.png", "lessonId": "alphabet"},
    {"id": "W", "label": "W", "title": "Show sign W", "image": "/lessons/alphabets/W.png", "lessonId": "alphabet"},
    {"id": "X", "label": "X", "title": "Show sign X", "image": "/lessons/alphabets/X.png", "lessonId": "alphabet"},
    {"id": "Y", "label": "Y", "title": "Show sign Y", "image": "/lessons/alphabets/Y.png", "lessonId": "alphabet"},
    {"id": "Z", "label": "Z", "title": "Show sign Z", "image": "/lessons/alphabets/Z.png", "lessonId": "alphabet"},

    # Common Interaction Signs
    {"id": "Hello", "label": "Hello", "title": "Show sign Hello", "image": "/lessons/Common_interaction/HELLO.png"},
    {"id": "Done", "label": "Done", "title": "Show sign Done", "image": "/lessons/Common_interaction/Done.png"},
    {"id": "Thank You", "label": "Thank You", "title": "Show sign Thank You", "image": "/lessons/Common_interaction/Thankyou.png"},
    {"id": "I Love you", "label": "I Love you", "title": "Show sign I Love You", "image": "/lessons/Common_interaction/ILoveYou.png"},
    {"id": "Sorry", "label": "Sorry", "title": "Show sign Sorry", "image": "/lessons/Common_interaction/Sorry.png"},
    {"id": "Please", "label": "Please", "title": "Show sign Please", "image": "/lessons/Common_interaction/Please.png"},
    {"id": "You are welcome.", "label": "You are welcome.", "title": "Show sign You Are Welcome", "image": "/lessons/Common_interaction/YouareWelcome.png"},
    {"id": "Stop", "label": "Stop", "title": "Show sign Stop", "image": "/lessons/Common_interaction/Stop.png"},
    {"id": "Help", "label": "Help", "title": "Show sign Help", "image": "/lessons/Common_interaction/Help.png"},
    {"id": "Water", "label": "Water", "title": "Show sign Water", "image": "/lessons/Common_interaction/Water.png"},
    {"id": "More", "label": "More", "title": "Show sign More", "image": "/lessons/Common_interaction/More.png"},
    {"id": "Friend", "label": "Friend", "title": "Show sign Friend", "image": "/lessons/Common_interaction/Friend.png"},
    {"id": "ok", "label": "ok", "title": "Show sign OK", "image": "/lessons/Common_interaction/ok.png"},

    # Numbers – practice only; sign-to-text will ignore them
    {"id": "NUM_1",  "label": "D",      "title": "Show number 1",  "image": "/lessons/numbers/one.png",   "lessonId": "numbers"},
    {"id": "NUM_2",  "label": "V",      "title": "Show number 2",  "image": "/lessons/numbers/two.png",   "lessonId": "numbers"},
    {"id": "NUM_3",  "label": "THREE",  "title": "Show number 3",  "image": "/lessons/numbers/three.png", "lessonId": "numbers"},
    {"id": "NUM_4",  "label": "B",      "title": "Show number 4",  "image": "/lessons/numbers/four.png",  "lessonId": "numbers"},
    {"id": "NUM_5",  "label": "Space",  "title": "Show number 5",  "image": "/lessons/numbers/five.png",  "lessonId": "numbers"},
    {"id": "NUM_6",  "label": "SIX",    "title": "Show number 6",  "image": "/lessons/numbers/six.png",   "lessonId": "numbers"},
    {"id": "NUM_7",  "label": "SEVEN",  "title": "Show number 7",  "image": "/lessons/numbers/seven.png", "lessonId": "numbers"},
    {"id": "NUM_8",  "label": "EIGHT",  "title": "Show number 8",  "image": "/lessons/numbers/eight.png", "lessonId": "numbers"},
    {"id": "NUM_9",  "label": "F",      "title": "Show number 9",  "image": "/lessons/numbers/nine.png",  "lessonId": "numbers"},
    {"id": "NUM_10", "label": "TEN",    "title": "Show number 10", "image": "/lessons/numbers/ten.png",   "lessonId": "numbers"},
]

current_practice_task = None
recent_predictions = deque(maxlen=30)

# ---------- HELPERS ----------

def calc_angle(a, b, c):
    ax, ay = a
    bx, by = b
    cx, cy = c
    ab = (ax - bx, ay - by)
    cb = (cx - bx, cy - by)
    dot = ab[0] * cb[0] + ab[1] * cb[1]
    mag_ab = math.hypot(ab[0], ab[1])
    mag_cb = math.hypot(cb[0], cb[1])
    if mag_ab == 0 or mag_cb == 0:
        return 0.0
    cos_angle = max(min(dot / (mag_ab * mag_cb), 1.0), -1.0)
    return math.degrees(math.acos(cos_angle))

# ---------- MODEL LOAD ----------

try:
    model_dict = pickle.load(open('./model.p', 'rb'))
    model = model_dict['model']
    print("✅ Model loaded successfully!")
except Exception as e:
    print("❌ Error loading the model:", e)
    model = None

# ---------- LABELS + WHITELIST ----------

labels_dict = {
    0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J',
    10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S',
    19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y', 25: 'Z',
    26: 'Hello', 27: 'Done', 28: 'Thank You', 29: 'I Love you',
    30: 'Sorry', 31: 'Please', 32: 'You are welcome.',
    33: 'Stop', 34: 'Help', 35: 'Water', 36: 'More',
    37: 'Friend', 38: 'ok', 39: 'Space',
    40: 'ONE', 41: 'TWO', 42: 'THREE', 43: 'FOUR', 44: 'FIVE',
    45: 'SIX', 46: 'SEVEN', 47: 'EIGHT', 48: 'NINE', 49: 'TEN',
}

TEXT_LABEL_WHITELIST = {
    'A','B','C','D','E','F','G','H','I','J',
    'K','L','M','N','O','P','Q','R','S','T',
    'U','V','W','X','Y','Z',
    'Hello','Done','Thank You','I Love you',
    'Sorry','Please','You are welcome.',
    'Stop','Help','Water','More','Friend','ok','Space'
}

# ---------- BASIC ROUTES ----------

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/start-camera', methods=['POST'])
def start_camera():
    global camera_active, cap
    with camera_lock:
        if not camera_active:
            cap = cv2.VideoCapture(0)
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            camera_active = True
            print("✅ 🚀 Camera STARTED")
            return jsonify({"status": "started", "camera_active": True})
        return jsonify({"status": "already_running", "camera_active": True})

@app.route('/api/stop-camera', methods=['POST'])
def stop_camera():
    global camera_active, cap
    with camera_lock:
        if camera_active and cap:
            cap.release()
            cap = None
            camera_active = False
            print("✅ 🛑 Camera STOPPED")
            return jsonify({"status": "stopped", "camera_active": False})
        return jsonify({"status": "already_stopped", "camera_active": False})

@app.route('/api/camera-status')
def camera_status():
    global camera_active
    return jsonify({
        "camera_active": camera_active,
        "service": "sign-to-text",
        "status": "online",
        "model_loaded": model is not None
    })

@app.route('/api/status')
def status():
    return jsonify({
        "service": "sign-to-text",
        "status": "online",
        "model_loaded": model is not None,
        "camera_active": camera_active
    })

# ---------- PRACTICE ROUTES ----------

@app.route('/api/practice/tasks')
def practice_tasks():
    return jsonify({"tasks": PRACTICE_TASKS})

@app.route('/api/practice/select/<task_id>', methods=['POST'])
def practice_select(task_id):
    global current_practice_task, recent_predictions
    for t in PRACTICE_TASKS:
        if t["id"] == task_id:
            current_practice_task = t
            recent_predictions.clear()
            print(f"🎯 Practice task selected: {t}")
            return jsonify({"status": "ok", "task": t})
    return jsonify({"status": "error", "message": "Task not found"}), 404

# ---------- SOCKET.IO ----------

@socketio.on('connect')
def handle_connect():
    print('✅ SocketIO Client connected!')

# ---------- VIDEO STREAM + SIGN→TEXT + HINTS + PRACTICE FEEDBACK ----------

def generate_frames(mode='text'):
    global camera_active, cap
    global no_hand_frames, last_box_center, current_practice_task, recent_predictions

    if not camera_active or cap is None:
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        cv2.putText(frame, "Camera OFF - Click Dashboard", (80, 240),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
        cv2.putText(frame, "Sign → Text Button", (120, 280),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        return

    mp_hands = mp.solutions.hands
    mp_drawing = mp.solutions.drawing_utils
    mp_drawing_styles = mp.solutions.drawing_styles

    hands = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=2,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )

    print("LABEL KEYS:", sorted(labels_dict.keys()))

    LOW_BRIGHT = 60.0
    HIGH_BRIGHT = 190.0
    MIN_BOX_AREA_RATIO = 0.02
    MAX_CENTER_MOVE = 80.0
    NO_HAND_MAX_FRAMES = 15

    while camera_active:
        with camera_lock:
            if cap is None or not cap.isOpened():
                break
            ret, frame = cap.read()
            if not ret:
                print("❌ Camera read failed")
                break

        frame = cv2.flip(frame, 1)
        H, W, _ = frame.shape

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        mean_brightness = float(np.mean(gray))

        hint = None
        if mean_brightness < LOW_BRIGHT:
            hint = "Background is too dark. Try turning on a light or facing a window."
        elif mean_brightness > HIGH_BRIGHT:
            hint = "Scene is too bright. Move a bit away from direct light."

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(frame_rgb)

        angle_index = 0.0

        if not results.multi_hand_landmarks:
            no_hand_frames += 1
            if no_hand_frames > NO_HAND_MAX_FRAMES and hint is None:
                hint = "Your hand is not in frame. Raise your hand in front of the camera."
        else:
            no_hand_frames = 0
            hand_landmarks = results.multi_hand_landmarks[0]

            mp_drawing.draw_landmarks(
                frame,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS,
                mp_drawing_styles.get_default_hand_landmarks_style(),
                mp_drawing_styles.get_default_hand_connections_style()
            )

            x_ = []
            y_ = []
            for lm in hand_landmarks.landmark:
                x_.append(lm.x)
                y_.append(lm.y)

            data_aux = []
            min_x = min(x_)
            min_y = min(y_)
            for x, y in zip(x_, y_):
                data_aux.append(x - min_x)
                data_aux.append(y - min_y)

            x1 = int(min_x * W) - 10
            y1 = int(min_y * H) - 10
            x2 = int(max(x_) * W) + 10
            y2 = int(max(y_) * H) + 10

            box_w = max(1, x2 - x1)
            box_h = max(1, y2 - y1)
            box_area_ratio = (box_w * box_h) / float(W * H)
            if box_area_ratio < MIN_BOX_AREA_RATIO and hint is None:
                hint = "Move closer to the camera so your hand looks bigger on screen."

            cx = (x1 + x2) / 2.0
            cy = (y1 + y2) / 2.0
            if last_box_center is not None:
                dx = abs(cx - last_box_center[0])
                dy = abs(cy - last_box_center[1])
                if (dx + dy) > MAX_CENTER_MOVE and hint is None:
                    hint = "Try signing slower and keep your hand steady."
            last_box_center = (cx, cy)

            wrist = hand_landmarks.landmark[mp_hands.HandLandmark.WRIST]
            idx_mcp = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_MCP]
            idx_pip = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_PIP]
            angle_index = calc_angle(
                (wrist.x, wrist.y),
                (idx_mcp.x, idx_mcp.y),
                (idx_pip.x, idx_pip.y),
            )

            try:
                print(f"🔥 DEBUG: Hands detected! data_aux={len(data_aux)}")

                if len(data_aux) != 42:
                    print("❌ Skipping frame: not 42 features")
                elif model is not None:
                    X_input = np.asarray(data_aux, dtype=np.float32).reshape(1, -1)

                    prediction = model.predict(X_input)
                    prediction_proba = model.predict_proba(X_input)
                    confidence = float(np.max(prediction_proba[0]))

                    print(f"✅ PREDICTION: {prediction[0]} conf={confidence:.3f}")

                    label_idx = int(prediction[0])
                    if label_idx not in labels_dict:
                        print(f"❌ Missing label for index {label_idx}")
                    else:
                        predicted_character = labels_dict[label_idx]

                        # practice tracking
                        recent_predictions.append({
                            "label_idx": label_idx,
                            "label": predicted_character,
                            "confidence": confidence
                        })

                        if mode == 'practice':
                            # show everything (including numbers)
                            socketio.emit('prediction', {
                                'text': predicted_character,
                                'confidence': confidence
                            })
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 4)
                            cv2.putText(
                                frame,
                                f"{predicted_character} ({confidence*100:.1f}%)",
                                (x1, y1 - 10),
                                cv2.FONT_HERSHEY_SIMPLEX,
                                1.3,
                                (0, 255, 0),
                                3
                            )
                        else:  # sign-to-text mode
                            if predicted_character in TEXT_LABEL_WHITELIST:
                                socketio.emit('prediction', {
                                    'text': predicted_character,
                                    'confidence': confidence
                                })
                                print(f"📡 SENT SOCKET (text): {predicted_character}")
                                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 4)
                                cv2.putText(
                                    frame,
                                    f"{predicted_character} ({confidence*100:.1f}%)",
                                    (x1, y1 - 10),
                                    cv2.FONT_HERSHEY_SIMPLEX,
                                    1.3,
                                    (0, 255, 0),
                                    3
                                )
                            else:
                                print(f"ℹ️ Ignored for sign-to-text: {predicted_character}")

                else:
                    print("❌ Model not loaded - skipping prediction")

            except Exception as e:
                print(f"❌ ERROR: {e}")
                print(f"   data_aux len: {len(data_aux)}")
                import traceback
                traceback.print_exc()

        if hint is not None:
            socketio.emit('hint', {'message': hint})

        if current_practice_task is not None and len(recent_predictions) > 0:
            target_label = current_practice_task["label"]
            total = len(recent_predictions)
            correct = sum(1 for p in recent_predictions if p["label"] == target_label)
            score = int((correct / total) * 100)

            avg_conf = float(np.mean([p["confidence"] for p in recent_predictions]))
            handshape_ok = avg_conf >= 0.5

            details = {
                "score": score,
                "avg_conf": avg_conf,
                "angle_index": float(angle_index),
                "handshape": "Good" if handshape_ok else "Needs improvement",
            }

            socketio.emit('practice_feedback', {
                "taskId": current_practice_task["id"],
                "target": target_label,
                "details": details
            })

        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n'
        )

@app.route('/video_feed')
def video_feed():
    mode = request.args.get('mode', 'text')  # 'text' or 'practice'
    return Response(
        generate_frames(mode=mode),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

if __name__ == '__main__':
    print("🚀 Sign→Text + Practice (with numbers) running on http://localhost:5000")
    print("✅ Camera Control APIs: /api/start-camera, /api/stop-camera")
    print("✅ CORS enabled for React 5173")
    print("✅ SocketIO CORS fixed - No more 400 errors!")
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
