import { useState } from 'react';
import axios from 'axios';
import '@google/model-viewer';
import WebcamCapture from './WebcamCapture';

export default function AvatarCreator() {
  const [file, setFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useWebcam, setUseWebcam] = useState(true);

  const generateAvatar = async () => {
    setError("");

    if (!file) {
      setError("Scatta una foto!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("/generate-avatar", formData, {
        responseType: 'blob'
      });

      if (res.status === 200) {
        setAvatarUrl(URL.createObjectURL(res.data));
      } else {
        setError("Errore backend generico");
      }
    } catch (err) {
      console.error("Errore nella richiesta:", err);

      let message = "Errore sconosciuto";
      if (err.response) {
        const blob = err.response.data;
        try {
          const text = await blob.text();
          message = text;
        } catch (parseErr) {
          message = err.message;
        }
      } else {
        message = err.message;
      }

      setError("Errore nella generazione avatar: " + message);
    }

    setLoading(false);
  };

  const reset = () => {
    setFile(null);
    setAvatarUrl("");
    setError("");
    setUseWebcam(false);
  };

  return (
    <div className="container">
      <img src="./logo.jpg" alt="FFF Logo" className="logo" />

      {error && <div className="error-message">{error}</div>}

      {!avatarUrl ? (
        <>
          <WebcamCapture setFile={setFile} />
          <button onClick={generateAvatar} disabled={loading}>
            {loading ? "Generazione..." : "Genera Avatar 🚀"}
          </button>
        </>
      ) : (
        <>
          <div className="model-container">
            <model-viewer
              src={avatarUrl}
              camera-controls
              auto-rotate
              style={{ height: '350px', width: '100%' }}
            />
          </div>
          <button onClick={() => alert("Invio via mail non implementato.")}>
            📧 Invia via mail
          </button>
          <button onClick={reset}>
            🔄 Crea un altro avatar
          </button>
        </>
      )}
    </div>
  );
}
