import React, { useState } from "react";
import "./CalculationPopup.css" // Ensure you have styles for the popup

const CalculationPopup = ({ selectedOption, onClose }) => {
  const [length, setLength] = useState({ value: "", unit: "meters" });
  const [width, setWidth] = useState({ value: "", unit: "meters" });
  const [height, setHeight] = useState({ value: "", unit: "meters" });
  const [quantity, setQuantity] = useState("");

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>{selectedOption} Measurements</h2>

        <label>Length (L)</label>
        <input
          type="number"
          value={length.value}
          onChange={(e) => setLength({ ...length, value: e.target.value })}
          placeholder="Enter length"
        />

        <label>Width (W)</label>
        <input
          type="number"
          value={width.value}
          onChange={(e) => setWidth({ ...width, value: e.target.value })}
          placeholder="Enter width"
        />

        <label>Height/Thickness (H)</label>
        <input
          type="number"
          value={height.value}
          onChange={(e) => setHeight({ ...height, value: e.target.value })}
          placeholder="Enter height"
        />

        <label>Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
        />

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CalculationPopup;
