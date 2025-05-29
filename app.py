from flask import Flask, request, jsonify
import re
import io
import fitz  # PyMuPDF
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def extract_info_from_pdf(pdf_bytes):
    doc = fitz.open("pdf", pdf_bytes)
    text = "\n".join(page.get_text() for page in doc)

    name_match = re.search(r"(?i)(?:name[:\s]*)?([A-Z][a-z]+\s[A-Z][a-z]+)", text)
    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    phone_match = re.search(r"\+?\d[\d\s\-\(\)]{7,}\d", text)

    return {
        "name": name_match.group(1) if name_match else "",
        "email": email_match.group(0) if email_match else "",
        "phone": phone_match.group(0) if phone_match else ""
    }

@app.route('/extract', methods=['POST'])
def extract():
    file = request.files.get('resume')
    if not file:
        return jsonify({"error": "No file"}), 400

    data = extract_info_from_pdf(file.read())
    r = jsonify(data)
    return r

if __name__ == '__main__':
    app.run(debug=True)
