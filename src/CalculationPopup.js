import React, { useState } from "react";
import "./CalculationPopup.css";

const CalculationPopup = ({ selectedOption, onSave, onClose }) => {
  const [inputs, setInputs] = useState({});

  const handleInputChange = (key, value) => {
    setInputs((prev) => ({
      ...prev,
      [key]: { value },
    }));
  };

  const getInputFields = () => {
    switch (selectedOption) {
      case "slabs": // Slabs, Square Footings, Walls
        return [
          { label: "Length (L)", key: "length" },
          { label: "Width (W)", key: "width" },
          { label: "Thickness/Height (H)", key: "height" },
          { label: "Quantity", key: "quantity" },
        ];
      case "holes": // Hole, Column, Round Footings
        return [
          { label: "Diameter (D)", key: "diameter" },
          { label: "Depth/Height (H)", key: "height" },
          { label: "Quantity", key: "quantity" },
        ];
      case "circular": // Circular Slab, Tube
        return [
          { label: "Outer Diameter (D1)", key: "outerDiameter" },
          { label: "Inner Diameter (D2)", key: "innerDiameter" },
          { label: "Length/Height (H)", key: "height" },
          { label: "Quantity", key: "quantity" },
        ];
      case "curb": // Curb, Gutter Barrier
        return [
          { label: "Curb Depth", key: "curbDepth" },
          { label: "Gutter Width", key: "gutterWidth" },
          { label: "Curb Height", key: "curbHeight" },
          { label: "Flag Thickness", key: "flagThickness" },
          { label: "Length", key: "length" },
          { label: "Quantity", key: "quantity" },
        ];
      case "stairs": // Stairs
        return [
          { label: "Run", key: "run" },
          { label: "Rise", key: "rise" },
          { label: "Width", key: "width" },
          { label: "Platform Depth", key: "platformDepth" },
          { label: "Number of Steps", key: "steps" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>{selectedOption} Measurements</h2>

        {getInputFields().map(({ label, key }) => (
          <div key={key} className="input-group">
            <label>{label}</label>
            <div className="input-container">
              <input
                type="number"
                value={inputs[key]?.value || ""}
                onChange={(e) => handleInputChange(key, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          </div>
        ))}

        <div className="button-group">
          <button onClick={() => onSave(inputs)}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CalculationPopup;
