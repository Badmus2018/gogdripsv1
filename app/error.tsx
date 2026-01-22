"use client";
import React from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
        <h1 style={{ fontSize: "4rem", fontWeight: 700, marginBottom: "1rem", color: "#f87171" }}>Something went wrong</h1>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 500, marginBottom: "1.5rem" }}>Oops... the window of our shop is currently closed.</h2>
        <button onClick={reset} style={{ color: "#60a5fa", background: "#23232b", border: "none", padding: "0.75rem 2rem", borderRadius: "0.5rem", fontSize: "1.1rem", cursor: "pointer", marginBottom: "1.5rem" }}>
          Try Again
        </button>
        <div>
          <a href="/" style={{ color: "#60a5fa", textDecoration: "underline", fontSize: "1.1rem" }}>Go back home</a>
        </div>
      </div>
    </div>
  );
}
