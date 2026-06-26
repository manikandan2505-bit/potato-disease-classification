import { useState } from "react";
import axios from "axios";

const diseaseInfo = {
  Potato___Early_blight: {
    disease: "Early Blight",
    cause: "Fungal disease caused by Alternaria solani.",
    treatment: "Apply fungicide and remove infected leaves."
  },

  Potato___Late_blight: {
    disease: "Late Blight",
    cause: "Disease caused by Phytophthora infestans.",
    treatment: "Use copper fungicide and improve drainage."
  },

  Potato___healthy: {
    disease: "Healthy Plant",
    cause: "No disease detected.",
    treatment: "No treatment required."
  }
};

function App() {

  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const predictDisease = async () => {

    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();

    formData.append("file", image);

    try {

  const response = await axios.post(
     `${import.meta.env.VITE_API_URL}/predict`,
      formData
  );

  setResult(response.data);

} catch (error) {

  alert("Prediction failed. Make sure backend is running.");

  console.error(error);
}

   
  };

  return (
    <div className="container">

      <h1>Potato Disease Classifier</h1>

      <input
        type="file"
        onChange={(e) =>
          setImage(e.target.files[0])
        }
      />

      <br />
      <br />

    {image && (
  <img
    src={URL.createObjectURL(image)}
    alt="preview"
    style={{
      width: "250px",
      borderRadius: "15px",
      marginBottom: "20px"
    }}
  />
)}

      <button onClick={predictDisease}>
        Predict
      </button>

      {result && (

        <div className="result-card">

          <h2>
            Disease:
            {" "}
            {diseaseInfo[result.class].disease}
          </h2>

          <h3>
            Confidence:
            {" "}
            {Number(result.confidence).toFixed(2)}%
          </h3>

          <p>
            <strong>Cause:</strong>
            {" "}
            {diseaseInfo[result.class].cause}
          </p>

          <p>
            <strong>Treatment:</strong>
            {" "}
            {diseaseInfo[result.class].treatment}
          </p>

        </div>

      )}

    </div>
  );
}

export default App;