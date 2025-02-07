import React, { useState } from "react";
import "./CalculationPopup.css";

const unitConversion = {
  meters: 1,
  feet: 3.28084,
  inches: 39.3701,
  yards: 1.09361,
  centimeters: 100,
};

const CalculationPopup = ({ selectedOption, onSave, onClose }) => {
  const [inputs, setInputs] = useState({});
  const [units, setUnits] = useState({});

  const handleInputChange = (key, value, unit) => {
    setInputs((prev) => ({
      ...prev,
      [key]: { value: parseFloat(value) || 0, unit: unit || "meters" },
    }));
  };

  const handleUnitChange = (key, unit) => {
    setUnits((prev) => ({
      ...prev,
      [key]: unit,
    }));
  };

  const convertValueToMeters = (value, unit) => {
    return value / unitConversion[unit];
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

  const handleSave = () => {
    const convertedInputs = {};
    for (const [key, input] of Object.entries(inputs)) {
      const { value, unit } = input;
      convertedInputs[key] = {
        value: convertValueToMeters(value, unit), // Convert to meters
        unit: "meters", // Saving in meters
      };
    }
    onSave(convertedInputs);
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
                onChange={(e) => handleInputChange(key, e.target.value, units[key])}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
              <select
                value={units[key] || "meters"}
                onChange={(e) => handleUnitChange(key, e.target.value)}
              >
                <option value="meters">Meters</option>
                <option value="feet">Feet</option>
                <option value="inches">Inches</option>
                <option value="yards">Yards</option>
                <option value="centimeters">Centimeters</option>
              </select>
            </div>
          </div>
        ))}

        <div className="button-group">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CalculationPopup;
