import React, { useState } from "react";
import "./App.css";
import CalculationPopup from "./CalculationPopup";

function App() {
  const [visibleRows, setVisibleRows] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [popupOption, setPopupOption] = useState(null);
  const [popupIndex, setPopupIndex] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [results, setResults] = useState([]);

  const handleAddRow = () => {
    setVisibleRows((prev) => prev + 1);
    setSelectedOptions([...selectedOptions, ""]);
    setMeasurements([...measurements, ""]);
    setResults([...results, ""]);
  };

  const handleRemoveRow = (index) => {
    setVisibleRows((prev) => prev - 1);
    setSelectedOptions(selectedOptions.filter((_, i) => i !== index));
    setMeasurements(measurements.filter((_, i) => i !== index));
    setResults(results.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...selectedOptions];
    newOptions[index] = value;
    setSelectedOptions(newOptions);

    setPopupOption(null);
    setPopupIndex(null);
    setTimeout(() => {
      setPopupOption(value);
      setPopupIndex(index);
    }, 50);
  };

  const calculateResult = (option, inputs) => {
    switch (option) {
      case "slabs": // Area = 2 × (L × W × H)
        return inputs.length?.value && inputs.width?.value && inputs.height?.value
          ? (2 * (inputs.length.value * inputs.width.value * inputs.height.value)).toFixed(2)
          : "";
      case "holes": // Area = 3.14 × (D / 2) × H
        return inputs.diameter?.value && inputs.height?.value
          ? (3.14 * (inputs.diameter.value / 2) * inputs.height.value).toFixed(2)
          : "";
      case "circular": // Volume = 3.14 × R × R × H
        return inputs.outerDiameter?.value && inputs.height?.value
          ? (3.14 * Math.pow(inputs.outerDiameter.value / 2, 2) * inputs.height.value).toFixed(2)
          : "";
      case "curb": // Custom Formula: Volume = (Curb Depth × Gutter Width) + (Curb Height × Flag Thickness) × Length
        return inputs.curbDepth?.value &&
          inputs.gutterWidth?.value &&
          inputs.curbHeight?.value &&
          inputs.flagThickness?.value &&
          inputs.length?.value
          ? (
              (inputs.curbDepth.value * inputs.gutterWidth.value) +
              (inputs.curbHeight.value * inputs.flagThickness.value) * inputs.length.value
            ).toFixed(2)
          : "";
      case "stairs": // Custom Formula: Volume = Run × Rise × Width × Steps
        return inputs.run?.value &&
          inputs.rise?.value &&
          inputs.width?.value &&
          inputs.steps?.value
          ? (inputs.run.value * inputs.rise.value * inputs.width.value * inputs.steps.value).toFixed(2)
          : "";
      default:
        return "";
    }
  };

  const handleSaveMeasurements = (index, data) => {
    const formattedMeasurement = Object.values(data)
      .map((item) => item.value)
      .filter(Boolean)
      .join(" x ");
    const newMeasurements = [...measurements];
    newMeasurements[index] = formattedMeasurement;
    setMeasurements(newMeasurements);

    const newResults = [...results];
    newResults[index] = calculateResult(selectedOptions[index], data);
    setResults(newResults);

    setPopupOption(null);
    setPopupIndex(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Concrete Calculator Form</h1>
        <table className="calculator-table">
          <thead>
            <tr>
              <th>
                <button onClick={handleAddRow}>+</button>
              </th>
              <th>S.no</th>
              <th>Type of Calculations</th>
              <th>Measurements</th>
              <th>Results</th>
              <th>Units</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(visibleRows)].map((_, index) => (
              <tr key={index}>
                <td>
                  <button onClick={() => handleRemoveRow(index)}>-</button>
                </td>
                <td>{index + 1}</td>
                <td>
                  <select
                    className="dropdown-select"
                    value={selectedOptions[index] || ""}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  >
                    <option value="">Select Calculation</option>
                    <option value="slabs">Slabs, Square Footings, or Walls</option>
                    <option value="holes">Hole, Column, or Round Footings</option>
                    <option value="circular">Circular Slab or Tube</option>
                    <option value="curb">Curb and Gutter Barrier</option>
                    <option value="stairs">Stairs</option>
                  </select>
                </td>
                <td>{measurements[index] || "Enter measurements"}</td>
                <td>{results[index] || "N/A"}</td>
                <td>Cubic Yards</td>
                <td>
                  <input type="text" placeholder="Enter remarks" className="remarks-input" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>

      {popupOption && popupIndex !== null && (
        <CalculationPopup
          selectedOption={popupOption}
          onSave={(data) => handleSaveMeasurements(popupIndex, data)}
          onClose={() => {
            setPopupOption(null);
            setPopupIndex(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
