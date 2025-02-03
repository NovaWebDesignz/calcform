import React, { useState } from "react";
import "./App.css";
import CalculationPopup from "./CalculationPopup";

function App() {
  // State variables
  const [visibleRows, setVisibleRows] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [popupOption, setPopupOption] = useState(null);

  // Add a row
  const handleAddRow = () => {
    setVisibleRows((prev) => prev + 1);
    setSelectedOptions([...selectedOptions, ""]);
  };

  // Remove a row
  const handleRemoveRow = (index) => {
    setVisibleRows((prev) => prev - 1);
    setSelectedOptions(selectedOptions.filter((_, i) => i !== index));
  };

  // Handle dropdown selection
  const handleOptionChange = (index, value) => {
    const newOptions = [...selectedOptions];
    newOptions[index] = value;
    setSelectedOptions(newOptions);
    setPopupOption(value); // Always update state in a non-conditional manner
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
                  <div className="dropdown-container">
                    <select
                      className="dropdown-select"
                      value={selectedOptions[index] || ""}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    >
                      <option value="">Select Calculation</option>
                      <option value="Slabs">Slabs, Square Footings, or Walls</option>
                      <option value="Holes">Hole, Column, or Round Footings</option>
                      <option value="Circular">Circular Slab or Tube</option>
                      <option value="Curb">Curb and Gutter Barrier</option>
                      <option value="Stairs">Stairs</option>
                    </select>
                  </div>
                </td>
                <td>Length x Width x Height</td>
                <td></td>
                <td>Cubic Yards</td>
                <td>
                  <input type="text" placeholder="Enter remarks" className="remarks-input" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>

      {/* Popup for input fields */}
      {popupOption && <CalculationPopup selectedOption={popupOption} onClose={() => setPopupOption(null)} />}
    </div>
  );
}

export default App;
