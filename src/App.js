import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Concrete Calculator Form</h1>
        <table className="calculator-table">
          <thead>
            <tr>
              <th>+</th>
              <th>S.no</th>
              <th>Type of Calculations</th>
              <th>Measurements</th>
              <th>Units</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>+</td>
              <td>1</td>
              <td>Concrete Volume</td>
              <td>Length x Width x Height</td>
              <td>Cubic Yards</td>
              <td>Enter dimensions to calculate volume</td>
            </tr>
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
