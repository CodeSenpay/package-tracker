import React, { useState, useEffect } from "react";
import "./css/popup.css"; // Import CSS file for styling (optional)

const Popup = ({ message }) => {
  const [showPopup, setShowPopup] = useState(true);

  // Automatically hide the popup after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className={`popup ${showPopup ? "active" : ""}`}>
      <div className="popup-message">{message}</div>
    </div>
  );
};

export default Popup;
