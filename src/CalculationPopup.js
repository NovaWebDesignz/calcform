import React, { useState, useEffect } from "react";
import "./CalculationPopup.css";


// Convert values based on unit selection
const convertToMeters = (value, unit) => {
  const conversionFactors = {
    meters: 1,
    feet: 0.3048,
    inches: 0.0254,
    yards: 0.9144,
    centimeters: 0.01,
  };

  const convertedValue = value * (conversionFactors[unit] || 1);
  return Math.round(convertedValue * 1000) / 1000;
};

const CalculationPopup = ({ selectedOption, onSave, onClose, calculateFor, onCalculateForChange }) => {
  const [inputs, setInputs] = useState({});
  const [quantity, setQuantity] = useState(1); // ✅ Define quantity state
  const [calculateForOption, setCalculateForOption] = useState(() => {
    if (calculateFor) return calculateFor;
    if (selectedOption === "slabs") return "slab";
    if (selectedOption === "holes") return "hole";
    if (selectedOption === "circular") return "circularslab";
    if (selectedOption === "curb") return "curb";
    if (selectedOption === "stairs") return "staircase";
    return "";
  });

  useEffect(() => {
    if (!calculateFor) {
      // Set default based on selected option
      if (selectedOption === "slabs") setCalculateForOption("slab");
      else if (selectedOption === "holes") setCalculateForOption("hole");
      else if (selectedOption === "circular") setCalculateForOption("circularslab");
      else if (selectedOption === "curb") setCalculateForOption("curb");
      else if (selectedOption === "stairs") setCalculateForOption("staircase");
    } else {
      setCalculateForOption(calculateFor);
    }
  }, [selectedOption, calculateFor]); // Re-run when selectedOption or calculateFor changes

  // Handle input change with validation and conversion
  const handleInputChange = (key, value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || value === "") {
      return; // Do nothing if value is empty or invalid
    }

    const currentUnit = inputs[key]?.unit || "meters"; // Get the current unit
    const convertedValue = convertToMeters(numericValue, currentUnit);

    setInputs((prev) => ({
      ...prev,
      [key]: { value: numericValue, unit: currentUnit, convertedValue },
    }));
  };

  // Handle unit change (converts values when unit is changed)
  const handleUnitChange = (key, newUnit) => {
    const currentValue = inputs[key]?.value || 0;
    const convertedValue = convertToMeters(currentValue, newUnit);

    setInputs((prevInputs) => ({
      ...prevInputs,
      [key]: { value: currentValue, unit: newUnit, convertedValue },
    }));
  };

  const handleCalculateForChange = (e) => {
    const value = e.target.value;
    setCalculateForOption(value);
    if (onCalculateForChange) {
      onCalculateForChange(value);
    }
  };

  // Define input fields based on selected option
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
          { label: "Outer Diameter (D1)", key: "outerdiameter" },
          { label: "Inner Diameter (D2)", key: "innerdiameter" },
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

  // Handle saving the data and passing it back to the parent
const handleSave = () => {
    const convertedInputs = [];
    let isValid = true;

    // Iterate over inputs to check validity and prepare the data
    for (const [key, input] of Object.entries(inputs)) {
        if (!input.convertedValue || !input.unit) { // Ensure unit is present
            isValid = false;
        }

        // ✅ Capitalize first letter of each label before saving
        const capitalizedLabel = key.charAt(0).toUpperCase() + key.slice(1);

        convertedInputs.push({
            label: capitalizedLabel, //Now stored as "Length", "Width", etc.
            value: input.convertedValue,
            unit: input.unit, // ✅ Store unit properly
        });
    }

    if (!isValid) {
        alert("Invalid Inputs"); // Alert if inputs are missing or invalid
        return;
    }

    // ✅ Ensure quantity is always included in the saved data
    convertedInputs.push({
      label: "Quantity",
      value: quantity, // ✅ Use state variable 'quantity'
      unit: "", // Quantity typically doesn't have a unit
    });

    // Debugging: Check if labels are capitalized before sending data
    console.log("Saved Data:", convertedInputs);

    onSave(convertedInputs);
    onClose();
};

const imageMap = {
  slab: "/images/slab_image.jpg",
  wall: "/images/wall_image.jpg",
  squareFooting: "/images/square_footing_image.jpg",
  squareColumn: "/images/square_column_image.jpg",
  hole: "/images/hole_image.jpg",
  pile: "/images/hole_image.jpg",
  column: "/images/column_image.jpg",
  roundFooting: "/images/round_footing_image.jpg",
  circularslab: "/images/tube_image.jpg",
  tube: "/images/tube_image.jpg",
  hollowcylinder: "/images/tube_image.jpg",
  curb: "/images/curb_image.jpg",
  gutter: "/images/curb_image.jpg",
  staircase: "/images/steps_image.jpg",
  steps: "/images/steps_image.jpg",
};


  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Measurements</h2>

        <div className="input-group">
          <label>Concrete Structure</label>
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
                <option value="hole">Holes</option>
                <option value="pile">Pile</option>
                <option value="column">Column</option>
                <option value="roundFooting">Round Footing</option>
              </>
            )}
            {selectedOption === "circular" && (
              <>
                <option value="circularslab">Circular</option>
                <option value="tube">Tube</option>
                <option value="hollowcylinder">Hollow Cylinder</option>
              </>
            )}
            {selectedOption === "curb" && (
              <>
                <option value="curb">Curb</option>
                <option value="gutter">Gutter</option>
              </>
            )}
            {selectedOption === "stairs" && (
              <>
                <option value="staircase">Staircase</option>
                <option value="steps">Steps</option>
              </>
            )}
          </select>
          {/* Display image for selected structure */}
          {calculateForOption && imageMap[calculateForOption] && (
            <div className="image-container">
              <img src={imageMap[calculateForOption]} alt={calculateForOption} className="option-image" />
            </div>
          )}
        </div>


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
              <select
                value={inputs[key]?.unit || "meters"}
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

        {/* ✅ Quantity Input */}
        <div className="quantity-group">
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            min="1"
          />
        </div>

        <div className="button-group">
          <button onClick={handleSave}>Calculate</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CalculationPopup;
