import React, { useState, useEffect } from "react";
import "./CalculationPopup.css";

const unitConversion = {
  meters: 1,
  feet: 3.28084,
  inches: 39.3701,
  yards: 1.09361,
  centimeters: 100,
};

const CalculationPopup = ({ selectedOption, onSave, onClose, calculateFor, onCalculateForChange }) => {
  const [inputs, setInputs] = useState({});
  const [units, setUnits] = useState({});
  const [calculateForOption, setCalculateForOption] = useState(calculateFor || "");

  useEffect(() => {
    setCalculateForOption(calculateFor);
  }, [calculateFor]);

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

  const handleCalculateForChange = (e) => {
    const value = e.target.value;
    setCalculateForOption(value);
    if (onCalculateForChange) {
      onCalculateForChange(value);
    }
  };

  const convertValueToMeters = (value, unit) => {
    return value / unitConversion[unit];
  };

  const getInputFields = () => {
    switch (selectedOption) {
      case "slabs":
        return [
          { label: "Length (L)", key: "length" },
          { label: "Width (W)", key: "width" },
          { label: "Thickness/Height (H)", key: "height" },
        ];
      case "holes":
        return [
          { label: "Diameter (D)", key: "diameter" },
          { label: "Depth/Height (H)", key: "height" },
        ];
      case "circular":
        return [
          { label: "Outer Diameter (D1)", key: "outerDiameter" },
          { label: "Inner Diameter (D2)", key: "innerDiameter" },
          { label: "Length/Height (H)", key: "height" },
        ];
      case "curb":
        return [
          { label: "Curb Depth", key: "curbDepth" },
          { label: "Gutter Width", key: "gutterWidth" },
          { label: "Curb Height", key: "curbHeight" },
          { label: "Flag Thickness", key: "flagThickness" },
          { label: "Length", key: "length" },
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

  const handleSave = () => {
    const convertedInputs = {};
    for (const [key, input] of Object.entries(inputs)) {
      const { value, unit } = input;
      convertedInputs[key] = {
        value: convertValueToMeters(value, unit),
        unit: "meters",
      };
    }
    convertedInputs["quantity"] = { value: 1, unit: "count" }; // Default quantity
    onSave(convertedInputs);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>{selectedOption} Measurements</h2>

        <div className="input-group">
          <label>Calculate For</label>
          <select value={calculateForOption} onChange={handleCalculateForChange}>
            {selectedOption === "slabs" && (
              <>
                <option value="slab">Slab</option>
                <option value="wall">Wall</option>
                <option value="squareFooting">Square Footing</option>
                <option value="squareColumn">Square Column</option>
              </>
            )}
            {selectedOption === "holes" && (
              <>
                <option value="hole">Hole</option>
                <option value="column">Column</option>
                <option value="roundFooting">Round Footing</option>
              </>
            )}
            {selectedOption === "circular" && (
              <>
                <option value="circularSlab">Circular Slab</option>
                <option value="tube">Tube</option>
              </>
            )}
            {selectedOption === "curb" && (
              <>
                <option value="curb">Curb</option>
                <option value="gutterBarrier">Gutter Barrier</option>
              </>
            )}
            {selectedOption === "stairs" && (
              <>
                <option value="staircase">Staircase</option>
                <option value="steps">Steps</option>
              </>
            )}
          </select>
        </div>

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

        <div className="input-group">
          <label>Quantity</label>
          <span>1</span>
        </div>

        <div className="button-group">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CalculationPopup;
