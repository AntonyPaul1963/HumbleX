import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";


const ACTIONS = [
  "Alert",
  "Show Text",
  "Show Image",
  "Refresh Page",
  "Set LocalStorage",
  "Get LocalStorage",
  "Increase Button Size",
  "Close Window",
  "Prompt and Show",
  "Change Button Color",
  "Disable Button",
];

const ConfigPage = () => {
  const [buttonLabel, setButtonLabel] = useState("Click Me!");
  const [workflow, setWorkflow] = useState([]);

  useEffect(() => {
    const savedConfig = JSON.parse(localStorage.getItem("buttonConfig"));
    if (savedConfig) {
      setButtonLabel(savedConfig.label);
      setWorkflow(savedConfig.workflow);
    }
  }, []);

  const handleAddAction = (action) => {
    setWorkflow([...workflow, { type: action, value: "" }]);
  };

  const handleSave = () => {
    localStorage.setItem("buttonConfig", JSON.stringify({ label: buttonLabel, workflow }));
  };

  return (
    <div style={{ display: "flex",flexDirection: "column", backgroundColor: "#0f172a",minHeight: "100vh",alignItems: "center", width: "100vw" }}>
      <h2 style={{height:"100px",backgroundColor: "#0f172a", display: "flex", alignItems: "center", padding: "0 20px",fontSize: "5rem", fontWeight: "bold"}}>Config Page</h2>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", backgroundColor: "#1e293b", borderRadius: "10px" }}>
        <label>Button Label:</label>
        <input
          type="text"
          value={buttonLabel}
          onChange={(e) => setButtonLabel(e.target.value)}
        />
        <h3>Workflow:</h3>
        <ul>
          {workflow.map((action, index) => (
            <li key={index}>{action.type}</li>
          ))}
        </ul>
        <select onChange={(e) => handleAddAction(e.target.value)}>
          <option value="">Select Action</option>
          {ACTIONS.map((action) => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
        <button onClick={handleSave}>Save</button>
        <Link to="/output">Go to Output Page</Link>
      </div>
    </div>
  );
};

const OutputPage = () => {
  const [response, setResponse] = useState(null);
  const [config, setConfig] = useState(null);
  const [buttonSize, setButtonSize] = useState(16);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [text,setText] = useState("Hello World!");
  const [istext,setIsText] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const savedConfig = JSON.parse(localStorage.getItem("buttonConfig"));
    setConfig(savedConfig);
  }, []);

  const handleClick = async () => {
    if (!config) return;
    for (const action of config.workflow) {
      switch (action.type) {
        case "Alert":
          alert("Hello!");
          break;
        case "Show Text":
          setIsText(true);
          setText("Hello World!");
          break;
        case "Show Image":
          setIsImage(true);
          console.log("Showing Image");
          break;
        case "Refresh Page":
          window.location.reload();
          break;
        case "Set LocalStorage":
          localStorage.setItem("key", "value");
          break;
        case "Increase Button Size":
          setButtonSize(buttonSize + 5);
          break;
        case "Close Window":
          window.close();
          break;
        case "Prompt and Show":
          setResponse(prompt("Enter something:"));
          console.log("User input:", response);
          break;
        case "Change Button Color":
          document.body.style.backgroundColor = "#" + Math.floor(Math.random()*16777215).toString(16);
          break;
        case "Disable Button":
          setButtonDisabled(true);
          return;
        default:
          break;
      }
    }
  };

  if (!config) return <div>Loading...</div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#0f172a", minHeight: "100vh", alignItems: "center", width: "100vw" }}>
      <h2 style={{height:"180px",backgroundColor: "#0f172a", display: "flex", alignItems: "center", padding: "0 20px",fontSize: "5rem", fontWeight: "bold"}}>Output Page</h2>
      <button
        style={{ fontSize: `${buttonSize}px`, backgroundColor: "blue", color: "white", padding: "10px 20px", borderRadius: "5px" }}
        disabled={buttonDisabled}
        onClick={handleClick}
      >
        {config.label}
      </button>
      {istext === true && <p>{text}</p>}
      {isImage === true && <input
        type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
      />}
      {isImage === true && <img src={imageUrl} style={{ width: "700px", height: "700px" }} alt="Image" />}
      {response && <p>User input: {response}</p>}
      <Link to="/">Back to Config Page</Link>
    </div>
  );
};

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<ConfigPage />} />
          <Route path="/output" element={<OutputPage />} />
        </Routes>
      </Router>
  );
};

export default App;