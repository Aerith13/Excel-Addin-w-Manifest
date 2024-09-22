import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS)
CORS(app)

@app.route('/ocr', methods=['POST'])
def perform_ocr():
    # Get the API key from environment variables or config file
    api_key = 'K85034884388957'  # :) bruh 

    # Get the image file from the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    
    # Prepare the API request
    url = 'https://api.ocr.space/parse/image'
    payload = {
        'apikey': api_key,
        'language': 'eng',  # You can change this based on your needs
        'isOverlayRequired': False
    }
    
    # Send the request to OCR.space API
    response = requests.post(url, files={'file': file}, data=payload)
    
    if response.status_code == 200:
        result = response.json()
        if result['IsErroredOnProcessing'] == False:
            extracted_text = result['ParsedResults'][0]['ParsedText']
            return jsonify({'text': extracted_text})
        else:
            return jsonify({'error': 'OCR processing failed'}), 500
    else:
        return jsonify({'error': 'Failed to connect to OCR service'}), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, host='127.0.0.1', port=5000)  # You can change the port here if needed
