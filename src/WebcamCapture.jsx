import Webcam from "react-webcam";
import { useRef, useState } from "react";

export default function WebcamCapture({ setFile }) {
  const webcamRef = useRef(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const capture = () => {
    setMessage("");
    setError("");

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setError("Impossibile acquisire l'immagine dalla webcam.");
      return;
    }

    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "webcam.jpg", { type: "image/jpeg" });
        setFile(file);
        setMessage("Foto scattata correttamente! ✅");
      })
      .catch(() => setError("Errore nello scatto della foto 🚫"));
  };

  return (
    <>
      <div className="webcam-preview">
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      </div>
      <button onClick={capture}>Scatta Foto 📸</button>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
    </>
  );
}
