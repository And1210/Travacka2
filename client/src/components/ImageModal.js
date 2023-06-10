import React from 'react';

function ImageModal({src, onClose}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content">
        <img src={src} alt="enlarged" />
      </div>
    </div>
  );
}

export default ImageModal;
