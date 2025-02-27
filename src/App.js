import React, { useState } from "react";
import "./App.css";
import CalculationPopup from "./CalculationPopup";
import jsPDF from "jspdf";
import "jspdf-autotable";

function App() {
  const [visibleRows, setVisibleRows] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [popupOption, setPopupOption] = useState(null);
  const [popupIndex, setPopupIndex] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [results, setResults] = useState([]);
  const [savedEntries, setSavedEntries] = useState([]); // Table for saved entries

  // State for customer and site info
  const [customerName, setCustomerName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [typeofWork, setTypeofWork] = useState("");
  const [siteDistance, setSiteDistance] = useState("");

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
 
  const getValue = (obj, key) => (obj?.[key]?.value !== undefined ? obj[key].value : 0);

const calculateResult = (option, inputs) => {
    switch (option) {
        case "slabs":
            return (
                getValue(inputs, "length") * 
                getValue(inputs, "width") * 
                getValue(inputs, "height")
            ).toFixed(2);
        
        case "holes":
            return (
                3.14 * 
                Math.pow(getValue(inputs, "diameter") / 2, 2) * 
                getValue(inputs, "height")
            ).toFixed(2);
        
        case "circular":
            console.log("Circular Calculation Input:", JSON.stringify(inputs, null, 2));

            const outerD = getValue(inputs, "outerdiameter");
            const innerD = getValue(inputs, "innerdiameter");
            const height = getValue(inputs, "height");

            if (!outerD || !innerD || !height) {
                console.error("Missing required inputs for circular:", { outerD, innerD, height });
                return "Error: Missing values";
            }

            if (outerD <= innerD) {
                console.error("Invalid input: Outer diameter must be greater than inner diameter");
                return "Error: OuterD must be > InnerD";
            }

            return (3.14 * (Math.pow(outerD / 2, 2) - Math.pow(innerD / 2, 2)) * height).toFixed(2);
        
        case "curb":
            console.log("Curb Calculation Input:", JSON.stringify(inputs, null, 2));

            const curbDepth = getValue(inputs, "curbdepth");
            const curbHeight = getValue(inputs, "curbheight");
            const flagThickness = getValue(inputs, "flagthickness");
            const gutterWidth = getValue(inputs, "gutterwidth");
            const length = getValue(inputs, "length");

            if (!curbDepth || !curbHeight || !flagThickness || !length || !gutterWidth) {
                console.error("Missing required inputs for curb:", { curbDepth, curbHeight, flagThickness, length, gutterWidth });
                return "Error: Missing values";
            }

            // Calculate Volume Under Curb
            const volumeUnderCurb = curbDepth * (curbHeight + flagThickness) * length;
            // Calculate Volume Under Gutter
            const volumeUnderGutter = gutterWidth * flagThickness * length;
    
            // Total Volume
            const totalVolume = (volumeUnderCurb + volumeUnderGutter).toFixed(2);

            console.log("Calculated Total Volume:", totalVolume);

            return totalVolume;
        
        case "stairs":
            return (
                getValue(inputs, "run") * 
                getValue(inputs, "rise") * 
                getValue(inputs, "width") * 
                getValue(inputs, "steps")
            ).toFixed(2);
        
        default:
            return "";
    }
  };
  

  const handleSaveMeasurements = (rowIndex, newMeasurements) => {
    if (!Array.isArray(newMeasurements)) {
        console.error('Expected newMeasurements to be an array:', newMeasurements);
        return;
    }

    // Convert array of measurements into an object with keys as expected by calculateResult
    const formattedMeasurements = {};
    newMeasurements.forEach((item) => {
        formattedMeasurements[item.label.toLowerCase().replace(/ /g, "")] = {
            value: parseFloat(item.value) || 0,
            unit: item.unit || "" // ✅ Ensure unit is stored
        };
    });
    

    // Update state correctly
    const updatedMeasurements = [...measurements];
    updatedMeasurements[rowIndex] = formattedMeasurements;
    setMeasurements(updatedMeasurements);

    // Automatically calculate results once measurements are saved
    handleCalculateResult(rowIndex, formattedMeasurements);
  };
  

  const handleSaveEntry = (index) => {
    const measurementObj = measurements[index];

    if (!measurementObj) {
      console.error(`No measurement data found for index ${index}`);
      return;
    }

    // Format the measurement details
    const formattedMeasurement = measurementObj 
      ? (Object.entries(measurementObj)
        .map(([key, value]) => 
            `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value.value} ${
              value.unit ? value.unit.charAt(0).toUpperCase() + value.unit.slice(1) : ""
            }`
        )
        .join(", "))
      : "";

    // Ensure quantity value is a valid number
    const quantityValue = parseFloat(measurementObj.quantity?.value) || 0; 
    if (quantityValue === 0) {
      console.warn(`Invalid quantity value at index ${index}`);
    }

    // Ensure required quantity is a valid number
    const requiredQty = parseFloat(results[index]); 
    if (isNaN(requiredQty)) {
      console.warn(`Invalid requiredQty at index ${index}`);
      return; // Prevent adding invalid entries
    }

    // Calculate total concrete requirement
    const totalConcreteRequirement = (requiredQty * quantityValue).toFixed(2);

    // Create new entry object
    const newEntry = {
        structure: selectedOptions[index] || "N/A",
        measurement: formattedMeasurement,
        requiredQty: results[index] || "N/A",
        quantity: quantityValue, 
        unit: "CBM",
        totalConcreteRequirement,
    };

    // Update saved entries (prepend new entry)
    setSavedEntries([newEntry, ...savedEntries]);
  };

  const handleRemoveSavedEntry = (index) => {
    const updatedEntries = savedEntries.filter((_, i) => i !== index);
    setSavedEntries(updatedEntries);
  };

  const handleCustomerSave = () => {
    // Save customer data (can be stored in local state or backend)
    console.log("Customer Saved:", { name: customerName, project: projectName, contact: customerLocation });
  };

  const handleSiteSave = () => {
    // Save site location data (can be stored in local state or backend)
    console.log("Site Saved:", { work: typeofWork, distance: siteDistance });
  };

  const handleCalculateResult = (index, measurementData = null) => {
    const selectedOption = selectedOptions[index];
    const measurementValues = measurementData || measurements[index];

    if (!measurementValues) {
        console.error(`Missing measurement data for index ${index}`);
        return;
    }

    console.log('Calculating for:', selectedOption, measurementValues); // ✅ Debugging log

    const result = calculateResult(selectedOption, measurementValues);

    // Log the result for debugging
    console.log('Calculated result:', result); // ✅ Debugging log

    const formattedResult = typeof result === 'object' 
        ? JSON.stringify(result) 
        : result;

    const updatedResults = [...results];
    updatedResults[index] = formattedResult;
    setResults(updatedResults);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(23);
    doc.text("Concrete Calculator Report", 14, 20);
    
    // Customer Information
    doc.setFontSize(14);
    doc.setFontSize(12);

    // Define alignment positions
    const labelX = 14;
    const valueX = 60; // Adjust this value for better alignment

    doc.text("Client Name:", labelX, 40);
    doc.text(`${customerName || "N/A"}`, valueX, 40);

    doc.text("Project Name:", labelX, 50);
    doc.text(`${projectName || "N/A"}`, valueX, 50);

    doc.text("Location:", labelX, 60);
    doc.text(`${customerLocation || "N/A"}`, valueX, 60);

    doc.text("Type of Work:", labelX, 70);
    doc.text(`${typeofWork || "N/A"}`, valueX, 70);

    doc.text("Distance (one way):", labelX, 80);
    doc.text(`${siteDistance || "N/A"}`, valueX, 80);

    // Saved Entries Table
    if (savedEntries.length > 0) {
        doc.autoTable({
            startY: 100,
            head: [["Sl. No.", "Structure", "Measurement", "No. of Structures", "Required Qty.", "Unit", "Total Concrete Required"]],
            body: savedEntries.map((entry, index) => [
                index + 1,
                entry.structure,
                entry.measurement,
                entry.quantity,
                entry.requiredQty,
                "m³",
                entry.totalConcreteRequirement
            ]),
            styles: { halign: "center" }, // Center align all content
            headStyles: { halign: "center" }, // Center align headers
            columnStyles: {
              2: { cellWidth: 40 },  // Measurement
            }
        });
    } else {
        doc.text("No saved entries.", 14, 70);
    }

    // Save the PDF
    doc.save("Concrete_Calculator_Report.pdf");
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
              <th>Client Name</th>
              <th>Project Name</th>
              <th>Location</th>
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
                  placeholder="Enter Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </td>
              <td>
                <input
                  className="remarks-input customer-input"
                  type="text"
                  placeholder="Enter Location"
                  value={customerLocation}
                  onChange={(e) => setCustomerLocation(e.target.value)}
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
              <th>Type of Work</th>
              <th>Distance-oneway</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  className="remarks-input site-input"
                  type="text"
                  placeholder="Enter Type of Work"
                  value={typeofWork}
                  onChange={(e) => setTypeofWork(e.target.value)}
                />
              </td>
              <td>
                <input
                  className="remarks-input site-input"
                  type="text"
                  placeholder="Enter Distance (one way)"
                  value={siteDistance}
                  onChange={(e) => setSiteDistance(e.target.value)}
                />
              </td>
              <td>
                <button onClick={handleSiteSave}>Save</button>
              </td>
            </tr>
          </tbody>
        </table>

        {/* NEW TABLE FOR SAVED ENTRIES */}
        <table className="saved-entries-table">
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>Structure</th>
              <th className="measurement-column">Measurement</th>
              <th>No. of Structures</th>
              <th>Required Qty.</th>
              <th>Unit</th>
              <th>Total Concrete Volume Required</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {savedEntries.length > 0 ? (
              savedEntries.map((entry, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{entry.structure}</td>
                  <td className="measurement-column">
                    {typeof entry.measurement === "object"
                      ? Object.entries(entry.measurement)
                      .map(([key, value]) => 
                        `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value.value} ${
                          value.unit ? value.unit.charAt(0).toUpperCase() + value.unit.slice(1) : ""
                        }`)
                        .join(", ")
                      : entry.measurement}
                  </td>
                  <td>{entry.quantity || "N/A"}</td>
                  <td>{entry.requiredQty}</td>
                  <td>m³</td>
                  <td className="saved-column">{entry.totalConcreteRequirement}</td>
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

        <button onClick={generatePDF}>Download PDF</button>

        {/* MAIN FORM TABLE */}
        <table className="calculator-table">
          <thead>
            <tr>
              <th>
                <button className="action-btn" onClick={handleAddRow}>＋</button>
              </th>
              <th>SI. No.</th>
              <th>Concrete Structure</th>
              <th>Measurements</th>
              <th>No. of Structure</th> {/* ✅ New column */}
              <th>Required Qty.</th>
              <th className="unit-column">Unit</th>
              <th>Total Concrete Volume Required</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(visibleRows)].map((_, index) => {
              const measurementObj = measurements[index] || {};
              const formattedMeasurement = measurementObj && typeof measurementObj === "object"
                ? Object.entries(measurementObj)
                .map(([key, value]) => 
                    `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value.value} ${
                      value.unit ? value.unit.charAt(0).toUpperCase() + value.unit.slice(1) : ""
                    }`)
                    .join(", ")
                : "Enter measurements";

              // Ensure quantity value is valid
              const quantityValue = parseFloat(measurementObj.quantity?.value) || 0;

              // Ensure required quantity is a valid number
              const requiredQty = parseFloat(results[index]) || 0;

              // Calculate total concrete requirement safely
              const totalConcreteRequirement = (requiredQty * quantityValue).toFixed(2);

              return (
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
                      <option value="holes">Holes, Pile, Column, or Round Footings</option>
                      <option value="circular">Circular Slab, Tube, Hollow Cylinder</option>
                      <option value="curb">Curb and Gutter Barrier</option>
                      <option value="stairs">Stairs</option>
                    </select>
                  </td>
                  <td>{formattedMeasurement}</td>
                  <td>{quantityValue || "N/A"}</td>
                  <td>{typeof results[index] === 'object' ? JSON.stringify(results[index]) : results[index] || "N/A"}</td>
                  <td className="unit-column">m³</td>
                  <td>{isNaN(totalConcreteRequirement) ? "N/A" : totalConcreteRequirement}</td>
                  <td>
                    <button className="save-btn" onClick={() => { handleSaveEntry(index); handleCalculateResult(index); }}>
                      Save
                    </button>
                  </td>
                </tr>
              );
            })}
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
