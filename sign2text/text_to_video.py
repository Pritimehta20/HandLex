from flask import Flask, request, render_template_string, send_from_directory, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

# CORS for React app
CORS(app, origins=["http://localhost:5173"])

DATA2VIDEO_DIR = os.path.join(os.path.dirname(__file__), 'data2video')

TEXT_TO_VIDEO_MAP = {
    # Greetings
    'Good Morning': 'Gretings/gm.gif',
    'Good Night': 'Gretings/gn.gif',
    'Good Afternoon': 'Gretings/gafternoon.gif',
    'Good Evening': 'Gretings/geve.gif',
    'See You Later': 'Gretings/seeyou.gif',
    'What are you doing': 'Gretings/whatdoing.gif',
    'What is your name': 'Gretings/whatname.gif',
    # Colors
    'Black': 'Colors/black.gif',
    'Blue': 'Colors/blue.gif',
    'Gray': 'Colors/gray.gif',
    'Green': 'Colors/green.gif',
    'Orange': 'Colors/orange.gif',
    'Pink': 'Colors/pink.gif',
    'Red': 'Colors/red.gif',
    'Tan': 'Colors/tan.gif',
    'White': 'Colors/white.gif',
    'Yellow': 'Colors/yellow.gif',

    #people
    'BoyFriend':'People/bf.gif',
    'Brother':'People/brother.gif',
    'Father':'People/father.gif',
    'GrandPraents':'People/grandparents.gif',
    'Husband':'People/husband.gif',
    'Mother':'People/mom.gif',
    'Parents':'People/parents.gif',
    'Sister':'People/sister.gif',
    'Wife':'People/wife.gif',

    #fruits 
    'Apple': 'Fruits/apple.gif',
    'Banana': 'Fruits/banana.gif',
    'Blueberry': 'Fruits/blueberry.gif',
    'Cherry': 'Fruits/cherry.gif',
    'Gauava': 'Fruits/gauava.gif',
    'Grapes': 'Fruits/grapes.gif',
    'Kiwi': 'Fruits/kiwi.gif',
    'Mango': 'Fruits/mango.gif',
    'Orange': 'Fruits/orangee.gif',
    'Pear': 'Fruits/pear.gif',
    'Pineapple': 'Fruits/pineapple.gif',
    'Raspberry': 'Fruits/raspberry.gif',
    'Strawberry': 'Fruits/strawberry.gif',
    'Sweet Potato': 'Fruits/sweetpotat.gif',
    'Tomato': 'Fruits/tomato.gif',
    'Watermelon': 'Fruits/watermelon.gif',

    #Emotions
    'Annoyed': 'Emotions/annoyed.gif',
    'Broken Heart': 'Emotions/brokenheart.gif',
    'Excited': 'Emotions/excited.gif',
    'Greedy': 'Emotions/greedy.gif',
    'Happy': 'Emotions/happy.gif',
    'Hate': 'Emotions/hate.gif',
    'Hurt': 'Emotions/hurt.gif',
    'Kind': 'Emotions/kind.gif',
    'Mad': 'Emotions/mad.gif',
    'Obsessed': 'Emotions/obsessed.gif',
    'Overwhelmed': 'Emotions/overwhelmed.gif',
    'Panic': 'Emotions/panick.gif',
    'Proud': 'Emotions/proud.gif',
    'Sad': 'Emotions/sad.gif',
    'Shocked': 'Emotions/shocked.gif',
    'Touched': 'Emotions/touched.gif',

    #Sensation
    'Bloody Nose': 'Sensation/bloodynose.gif',
    'Cold': 'Sensation/cold.gif',
    'Cool': 'Sensation/cool.gif',
    'Cough': 'Sensation/cough.gif',
    'Ear Infection': 'Sensation/earinfection.gif',
    'Fever': 'Sensation/fever.gif',
    'Hot': 'Sensation/hot.gif',
    'Hungry': 'Sensation/hungry.gif',
    'Sick': 'Sensation/sick.gif',
    'Sore Throat': 'Sensation/sorethrougt.gif',
    'Strong Wind': 'Sensation/strongwind.gif',
    'Swollen': 'Sensation/swollen.gif',
    'Thirsty': 'Sensation/thirsty.gif'

}


def get_main_video_for_text(text):
    """Return the first matching video path for the given text."""
    norm_text = text.strip().lower()
    for key, rel_path in TEXT_TO_VIDEO_MAP.items():
        norm_key = key.lower()
        if norm_text in norm_key or norm_key in norm_text:
            full_path = os.path.join(DATA2VIDEO_DIR, rel_path)
            if os.path.isfile(full_path):
                return rel_path
    return None


def get_related_videos_in_same_folder(main_rel_path):
    """
    Given 'Gretings/gm.gif', return other GIFs from the same folder
    (excluding the main one), e.g. ['Gretings/gn.gif', ...].
    """
    if not main_rel_path:
        return []

    folder, filename = os.path.split(main_rel_path)
    related = []

    for _, rel_path in TEXT_TO_VIDEO_MAP.items():
        rel_folder, rel_name = os.path.split(rel_path)
        if rel_folder == folder and rel_path != main_rel_path:
            full_path = os.path.join(DATA2VIDEO_DIR, rel_path)
            if os.path.isfile(full_path):
                related.append(rel_path)

    return related


# JSON API for React
@app.route('/api/text-to-sign', methods=['POST'])
def text_to_sign_api():
    data = request.get_json(silent=True) or {}
    text = (data.get('text') or "").strip()

    if not text:
        return jsonify({
            "error": "Text is required",
            "videos": [],
            "text": ""
        }), 400

    main_video = get_main_video_for_text(text)
    if not main_video:
        return jsonify({
            "text": text,
            "videos": [],
            "main_video": None,
            "related_videos": [],
            "video_urls": []
        })

    related_videos = get_related_videos_in_same_folder(main_video)

    # Backward compatibility: "videos" still returned as list with main first
    videos = [main_video] + related_videos

    return jsonify({
        "text": text,
        "videos": videos,
        "main_video": main_video,
        "related_videos": related_videos,
        "video_urls": [f"http://localhost:5001/video/{v}" for v in videos]
    })


# Status API for React
@app.route('/api/status')
def status():
    return jsonify({
        "service": "text-to-sign",
        "status": "online",
        "available_phrases": list(TEXT_TO_VIDEO_MAP.keys())
    })


@app.route('/', methods=['GET', 'POST'])
def index():
    input_text = ''
    videos = []
    no_video = False

    if request.method == 'POST':
        input_text = request.form.get('input_text', '').strip()
        if input_text:
            main_video = get_main_video_for_text(input_text)
            if main_video:
                related = get_related_videos_in_same_folder(main_video)
                videos = [main_video] + related
            if not videos:
                no_video = True

    return render_template_string("""
<!DOCTYPE html>
<html>
<head>
    <title>Text to ASL Video</title>
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-family: Arial, sans-serif;
            padding: 30px;
            max-width: 900px;
            margin: auto;
        }
        input[type=text] {
            width: 100%;
            padding: 15px;
            font-size: 18px;
            border-radius: 10px;
            border: none;
            margin-bottom: 20px;
            box-sizing: border-box;
            background: rgba(255,255,255,0.1);
            color: white;
        }
        button {
            padding: 15px 30px;
            font-size: 18px;
            border: none;
            border-radius: 10px;
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
            margin-bottom: 30px;
        }
        button:hover {
            background-color: #45a049;
        }
        .video-section {
            text-align: center;
        }
        img {
            max-width: 100%;
            max-height: 400px;
            border-radius: 20px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.4);
            margin: 10px 0;
        }
        .no-video-msg {
            font-size: 24px;
            font-weight: bold;
            color: #ff6b6b;
            text-align: center;
            margin-top: 40px;
        }
    </style>
</head>
<body>
    <h1>🎬 Text to ASL Sign Videos</h1>
    <form method="POST">
        <input type="text" name="input_text" placeholder="Type a phrase like 'Good Morning'" value="{{ input_text|e }}" required>
        <button type="submit">Show Video</button>
    </form>

    {% if videos %}
    <div class="video-section">
        <h3>Showing sign for: "{{ input_text }}"</h3>
        {% for video in videos %}
        <img src="{{ url_for('serve_video', filename=video) }}" alt="ASL Sign Video" loading="lazy">
        {% endfor %}
    </div>
    {% elif no_video %}
    <div class="no-video-msg">
        No video available for "{{ input_text }}"
    </div>
    {% endif %}
</body>
</html>
    """, input_text=input_text, videos=videos, no_video=no_video)


@app.route('/video/<path:filename>')
def serve_video(filename):
    return send_from_directory(DATA2VIDEO_DIR, filename)


if __name__ == '__main__':
    print("🚀 Text→Sign running on http://localhost:5001")
    print("✅ CORS enabled for http://localhost:5173")
    print("✅ API endpoints: /api/text-to-sign (POST), /api/status (GET)")
    app.run(debug=True, host='0.0.0.0', port=5001)
