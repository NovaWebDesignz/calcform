import React, { useState } from "react";
import "./CalculationPopup.css"; // Ensure you have styles for the popup

const CalculationPopup = ({ selectedOption, onClose }) => {
  const [inputs, setInputs] = useState({});

  const handleInputChange = (key, value, unit) => {
    setInputs((prev) => ({
      ...prev,
      [key]: { value, unit },
    }));
  };

  const getInputFields = () => {
    switch (selectedOption) {
      case "slabs":
        return [
          { label: "Length (L)", key: "length" },
          { label: "Width (W)", key: "width" },
          { label: "Thickness/Height (H)", key: "height" },
          { label: "Quantity", key: "quantity" },
        ];
      case "holes":
        return [
          { label: "Diameter (D)", key: "diameter" },
          { label: "Depth/Height (H)", key: "height" },
          { label: "Quantity", key: "quantity" },
        ];
      case "circular":
        return [
          { label: "Outer Diameter (D1)", key: "outerDiameter" },
          { label: "Inner Diameter (D2)", key: "innerDiameter" },
          { label: "Length/Height (H)", key: "height" },
          { label: "Quantity", key: "quantity" },
        ];
      case "curb":
        return [
          { label: "Curb Depth", key: "curbDepth" },
          { label: "Gutter Width", key: "gutterWidth" },
          { label: "Curb Height", key: "curbHeight" },
          { label: "Flag Thickness", key: "flagThickness" },
          { label: "Length", key: "length" },
          { label: "Quantity", key: "quantity" },
        ];
      case "stairs":
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

  const unitOptions = ["meters", "feet", "inches", "yards", "centimeters"];

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
                onChange={(e) =>
                  handleInputChange(key, e.target.value, inputs[key]?.unit || "meters")
                }
                placeholder={`Enter ${label.toLowerCase()}`}
              />
              <select
                value={inputs[key]?.unit || "meters"}
                onChange={(e) =>
                  handleInputChange(key, inputs[key]?.value || "", e.target.value)
                }
              >
                {unitOptions.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CalculationPopup;
