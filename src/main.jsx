import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css"; // Use styles.css for enhanced design

// Minimal error boundary so blank screen becomes an error message
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 16, fontFamily: "system-ui" }}>
          <h2>App crashed</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {String(this.state.error?.stack || this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);