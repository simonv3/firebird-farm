import React, { useState } from "react";
import { createPortal } from "react-dom";

interface LightboxProps {
  images: string[];
}

const Lightbox: React.FC<LightboxProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setCurrentIndex(null);
  };

  const showNext = () => {
    if (currentIndex !== null && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const showPrev = () => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div>
      <div className="image-grid">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index}`}
            onClick={() => openLightbox(index)}
            style={{ cursor: "pointer", width: "100px", margin: "5px" }}
          />
        ))}
      </div>

      {currentIndex !== null &&
        createPortal(
          <div className="lightbox-overlay" style={overlayStyle}>
            <div className="lightbox-content" style={contentStyle}>
              <button onClick={closeLightbox} style={closeButtonStyle}>
                &times;
              </button>
              <button
                onClick={showPrev}
                disabled={currentIndex === 0}
                style={navButtonStyle}
              >
                &#8249;
              </button>
              <img
                src={images[currentIndex]}
                alt={`Image ${currentIndex}`}
                style={imageStyle}
              />
              <button
                onClick={showNext}
                disabled={currentIndex === images.length - 1}
                style={navButtonStyle}
              >
                &#8250;
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const contentStyle: React.CSSProperties = {
  position: "relative",
  textAlign: "center",
};

const closeButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "none",
  border: "none",
  color: "white",
  fontSize: "24px",
  cursor: "pointer",
};

const navButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "white",
  fontSize: "24px",
  cursor: "pointer",
  margin: "0 10px",
};

const imageStyle: React.CSSProperties = {
  maxWidth: "90%",
  maxHeight: "80%",
};

export default Lightbox;
