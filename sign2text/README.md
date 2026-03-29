.


1. **Python**: Provides a vast array of libraries and frameworks for machine learning, computer vision, and data processing.
2. **TensorFlow**: For building and training machine learning models.
3. **Scikit-learn**: For implementing the Random Forest algorithm for sign language recognition.
4. **Numpy**: For numerical computations and data manipulation.
5. **Mediapipe**: For real-time hand tracking and landmark detection.
6. **OpenCV**: For video processing and computer vision tasks.
7. **Flask**: Web framework to develop the application.
8. **Flask-SocketIO**: Adds low-latency bi-directional communication between clients and the server to Flask applications.

cd sign2text
```

2. Create and activate a virtual environment:

  ```shell
  python -m venv venv
  ```
  ```shell
  source venv/bin/activate  # On Windows use `venv\Scripts\activate`
  ```

3. Install required libraries:

  ```shell
  pip install -r requirements.txt
  ```

4. Ensure a webcam is connected to your system.

## Usage

1. Start the Flask application:
    ```bash
    python app.py
    ```

2. Open your web browser and navigate to :
   ```bash
    http://127.0.0.1:5000/
    ```

4. The web interface will display the webcam feed and detected sign language gestures.





