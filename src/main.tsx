import React, { Component, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("React Error Boundary Caught Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "3rem 1.5rem", fontFamily: "sans-serif", textAlign: "center", maxWidth: "600px", margin: "40px auto", border: "2px solid black", background: "#FAF8F5" }}>
          <h2 style={{ textTransform: "uppercase", fontWeight: 900 }}>Memuat Ulang Tampilan...</h2>
          <p style={{ color: "#555", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Terjadi pembaruan data sistem. Klik tombol di bawah untuk memuat ulang tampilan secara bersih.
          </p>
          <button
            onClick={() => {
              try {
                localStorage.removeItem("andika_portfolio_projects");
              } catch (e) {}
              window.location.reload();
            }}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#000",
              color: "#FFCC00",
              border: "2px solid black",
              cursor: "pointer",
              fontWeight: 900,
              textTransform: "uppercase"
            }}
          >
            Muat Ulang Website
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);