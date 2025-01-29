import React, { useState } from "react";
import "./App.css";

function App() {
  // State to track the number of rows visible
  const [visibleRows, setVisibleRows] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Logic to add one row per click
  const handleAddRow = () => {
    setVisibleRows(visibleRows + 1); // Increment the number of rows displayed
    setSelectedOptions([...selectedOptions, ""]); // Add an empty value for the new row
  };

  // Logic to remove the last row
  const handleRemoveRow = (index) => {
    setVisibleRows(visibleRows - 1); // Decrease the number of rows displayed
    setSelectedOptions(selectedOptions.filter((_, i) => i !== index)); // Remove the corresponding option
  };

  // Handle option change for each row
  const handleOptionChange = (index, value) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = value; // Update the specific row's selected option
    setSelectedOptions(newSelectedOptions);
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
                <td> {/* Add a button to remove the row */}
                  <button onClick={() => handleRemoveRow(index)}>-</button>
                </td>
                <td>{index + 1}</td> {/* Display the row number */}
                <td> {/* Add a dropdown to select the calculation type */}
                  <div className="dropdown-container">
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
                  </div>
                </td>
                <td>Length x Width x Height</td> {/* Display the measurements */}
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
    </div>
  );
}

export default App;
