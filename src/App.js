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
  const [remarks, setRemarks] = useState([]);
  const [savedEntries, setSavedEntries] = useState([]); // Table for saved entries

  // State for customer and site info
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [siteLocation, setSiteLocation] = useState("");

  const handleAddRow = () => {
    setVisibleRows((prev) => prev + 1);
    setSelectedOptions([...selectedOptions, ""]);
    setMeasurements([...measurements, ""]);
    setResults([...results, ""]);
    setRemarks([...remarks, ""]);
  };

  const handleRemoveRow = (index) => {
    setVisibleRows((prev) => prev - 1);
    setSelectedOptions(selectedOptions.filter((_, i) => i !== index));
    setMeasurements(measurements.filter((_, i) => i !== index));
    setResults(results.filter((_, i) => i !== index));
    setRemarks(remarks.filter((_, i) => i !== index));
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
      case "slabs":
        return inputs.length?.value && inputs.width?.value && inputs.height?.value
          ? (inputs.length.value * inputs.width.value * inputs.height.value).toFixed(2)
          : "";
      case "holes":
        return inputs.diameter?.value && inputs.height?.value
          ? (3.14 * (inputs.diameter.value / 2) * inputs.height.value).toFixed(2)  // Using the correct formula
          : "";
      case "circular":
        if (inputs.outerDiameter?.value && inputs.innerDiameter?.value && inputs.height?.value) {
          const outerRadius = inputs.outerDiameter.value / 2;
          const innerRadius = inputs.innerDiameter.value / 2;
          const height = inputs.height.value;
          const volume = 3.14 * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2)) * height;
          return volume.toFixed(2); // Round to two decimal places
        }
        return "";
      case "curb":
        if (
          inputs.curbDepth?.value &&
          inputs.curbHeight?.value &&
          inputs.flagThickness?.value &&
          inputs.length?.value &&
          inputs.gutterWidth?.value
        ) {
          const volumeUnderCurb = inputs.curbDepth.value * (inputs.curbHeight.value + inputs.flagThickness.value) * inputs.length.value;
          const volumeUnderGutter = inputs.gutterWidth.value * inputs.flagThickness.value * inputs.length.value;
          return (volumeUnderCurb + volumeUnderGutter).toFixed(2);
        }
        return "";
      case "stairs":
        if (
          inputs.platformDepth?.value &&
          inputs.rise?.value &&
          inputs.steps?.value &&
          inputs.width?.value &&
          inputs.run?.value
        ) {
          const volumeUnderPlatform = inputs.platformDepth.value * (inputs.rise.value * inputs.steps.value) * inputs.width.value;
          const volumeUnderSteps = inputs.run.value * (inputs.rise.value * inputs.steps.value) * inputs.width.value;
          return (volumeUnderPlatform + volumeUnderSteps).toFixed(2);
        }
        return "";
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

  const handleSaveEntry = (index) => {
    const newEntry = {
      structure: selectedOptions[index] || "N/A",
      measurement: measurements[index] || "N/A",
      requiredQty: results[index] || "N/A",
      unit: "CBM",
      remarks: remarks[index] || "",
    };

    setSavedEntries([newEntry, ...savedEntries]); // Add new entry at the top
  };

  const handleRemoveSavedEntry = (index) => {
    const updatedEntries = savedEntries.filter((_, i) => i !== index);
    setSavedEntries(updatedEntries);
  };

  const handleCustomerSave = () => {
    // Save customer data (can be stored in local state or backend)
    console.log("Customer Saved:", { name: customerName, contact: customerContact });
  };

  const handleSiteSave = () => {
    // Save site location data (can be stored in local state or backend)
    console.log("Site Saved:", siteLocation);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Concrete Calculator</h1>

        {/* Add Font Awesome CDN for icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />

        {/* Customer Table */}
        <table className="customer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  className="remarks-input customer-input"
                  type="text"
                  placeholder="Enter Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </td>
              <td>
                <input
                  className="remarks-input customer-input"
                  type="text"
                  placeholder="Enter Contact"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                />
              </td>
              <td>
                <button onClick={handleCustomerSave}>Save</button>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Site Table */}
        <table className="site-table">
          <thead>
            <tr>
              <th>Site Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  className="remarks-input site-input"
                  type="text"
                  placeholder="Enter Site Location"
                  value={siteLocation}
                  onChange={(e) => setSiteLocation(e.target.value)}
                />
              </td>
              <td>
                <button onClick={handleSiteSave}>Save</button>
              </td>
            </tr>
          </tbody>
        </table>

        {/* MAIN FORM TABLE */}
        <table className="calculator-table">
          <thead>
            <tr>
              <th>
                <button className="action-btn" onClick={handleAddRow}>＋</button>
              </th>
              <th>S.no</th>
              <th>Type of Calculations</th>
              <th>Measurements</th>
              <th>Results</th>
              <th>Units</th>
              <th>Remarks</th>
              <th>Save</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(visibleRows)].map((_, index) => (
              <tr key={index}>
                <td>
                  <button className="action-btn remove-btn" onClick={() => handleRemoveRow(index)}>−</button>
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
                <td>CBM</td>
                <td>
                  <input
                    type="text"
                    placeholder="Enter remarks"
                    className="remarks-input"
                    value={remarks[index] || ""}
                    onChange={(e) => {
                      const newRemarks = [...remarks];
                      newRemarks[index] = e.target.value;
                      setRemarks(newRemarks);
                    }}
                  />
                </td>
                <td>
                  <button className="save-btn" onClick={() => handleSaveEntry(index)}>Save</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* NEW TABLE FOR SAVED ENTRIES */}
        <table className="saved-entries-table">
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>Structure</th>
              <th>Measurement</th>
              <th>Required Qty.</th>
              <th>Unit</th>
              <th>Remarks</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {savedEntries.length > 0 ? (
              savedEntries.map((entry, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{entry.structure}</td>
                  <td>{entry.measurement}</td>
                  <td>{entry.requiredQty}</td>
                  <td>{entry.unit}</td>
                  <td>{entry.remarks}</td>
                  <td>
                    <button className="remove-entry-btn" onClick={() => handleRemoveSavedEntry(index)}>
                      <i className="fa fa-trash"></i> {/* Trash bin icon */}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", fontStyle: "italic" }}>
                  No entries yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </header>

      {popupOption && popupIndex !== null && (
        <CalculationPopup
          selectedOption={popupOption}
          onSave={(data) => handleSaveMeasurements(popupIndex, data)}
          onClose={() => setPopupOption(null)}
        />
      )}
    </div>
  );
}

export default App;
