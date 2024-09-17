from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import pytesseract
import io

# Initialize Flask app
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS)
CORS(app)

@app.route('/ocr', methods=['POST'])
def ocr():
    # Check if an image file is provided in the request
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    # Get the image file from the request
    image_file = request.files['image']
    # Open the image using PIL (Python Imaging Library)
    image = Image.open(io.BytesIO(image_file.read()))
    # Perform OCR (Optical Character Recognition) on the image
    text = pytesseract.image_to_string(image)

    # Return the extracted text as JSON response
    return jsonify({'text': text})

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=False, host='127.0.0.1')
