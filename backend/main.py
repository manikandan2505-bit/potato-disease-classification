from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

import tensorflow as tf
import numpy as np
from PIL import Image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = tf.keras.models.load_model("potato_model.keras")

CLASS_NAMES = [
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy"
]


@app.get("/")
def home():
    return {
        "message": "Potato Disease API Running"
    }


@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):

    image = Image.open(file.file)

    image = image.convert("RGB")

    image = image.resize((256, 256))

    img_array = np.array(image)

    img_array = np.expand_dims(
        img_array,
        axis=0
    )

    predictions = model.predict(
        img_array
    )

    predicted_class = CLASS_NAMES[
        np.argmax(predictions[0])
    ]

    confidence = float(
        np.max(predictions[0]) * 100
    )

    return {
        "class": predicted_class,
        "confidence": round(confidence, 2)
    }