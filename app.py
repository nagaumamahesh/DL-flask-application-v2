import numpy as np
import cv2
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import tensorflow_hub as hub
from reportlab.lib.pagesizes import letter
from reportlab.platypus import Image, SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import io
import os
from werkzeug.utils import secure_filename
from flask import Flask, render_template, send_file, request, make_response

app = Flask(__name__)

# model = load_model(('Model.h5'), custom_objects={'KerasLayer': hub.KerasLayer})


def model_predict(img_path, loaded_model):
    img = cv2.imread(img_path)
    img = cv2.resize(img, (224, 224))
    img_array = np.array(img)
    img_array = img_array.reshape(1, 224, 224, 3)
    predictions = loaded_model.predict(img_array)
    predicted_class_index = np.argmax(predictions)
    labels = ['No Tumor Detected', 'Pituitary Tumor Detected',
              'Meningioma Tumor Detected', 'Glioma Tumor Detected']
    predicted_class_label = labels[predicted_class_index]
    print("Predicted class index:", predicted_class_index)
    print("Predicted class label:", predicted_class_label)
    return predicted_class_label

# Home page route
@app.route('/')
def home():
    return render_template('index.html')


@app.route('/classify')
def classify():
    return render_template('classify.html')


# @app.route('/predict', methods=['GET', 'POST'])
# def upload():
#     return "No Tumor Detected"


def generate_report(image_path, prediction_result):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    header_style = styles["Heading1"]
    normal_style = styles["Normal"]
    tumor_styles = {
        'No Tumor Detected': {"textColor": "black", "fontName": "Helvetica"},
        'Pituitary Tumor Detected': {"textColor": "green", "fontName": "Helvetica-Bold"},
        'Meningioma Tumor Detected': {"textColor": "blue", "fontName": "Helvetica-Bold"},
        'Glioma Tumor Detected': {"textColor": "red", "fontName": "Helvetica-Bold"}
    }
    tumor_style = tumor_styles.get(
        prediction_result, {"textColor": "black", "fontName": "Helvetica"})
    story = []
    title_text = "<b>Brain Tumor Detection Report</b>"
    title_paragraph = Paragraph(title_text, header_style)
    story.append(title_paragraph)
    story.append(Spacer(1, 12))
    img = Image(image_path, width=400, height=400)
    story.append(img)
    story.append(Spacer(10, 20))
    prediction_text = f"<b>Prediction:</b> <font color='{tumor_style['textColor']}' face='{tumor_style['fontName']}'>{prediction_result}</font>"
    prediction_paragraph = Paragraph(prediction_text, normal_style)
    story.append(prediction_paragraph)
    story.append(Spacer(1, 12))

    description_text = "This report provides the results of brain tumor detection based on the analysis of medical imaging data"

    description_paragraph = Paragraph(description_text, normal_style)
    story.append(description_paragraph)
    story.append(Spacer(1, 12))
    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()


@app.route('/predict', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        f = request.files['file']
        basepath = os.path.dirname(__file__)
        current_directory = os.getcwd()

        file_path = os.path.join(
            current_directory, 'uploads', secure_filename(f.filename))
        f.save(file_path)
        # preds = model_predict(file_path, model)
        # result = preds
        result = "No Tumor Detected"
        pdf_data = generate_report(file_path, result)
        response = make_response(pdf_data)
        response.headers['Content-Type'] = 'application/pdf'
        response.headers['Content-Disposition'] = 'attachment; filename=report.pdf'
        response.headers['X-Prediction-Result'] = result
        # print(response)
        return response
    return None


if __name__ == '__main__':
    app.run(debug=True)
