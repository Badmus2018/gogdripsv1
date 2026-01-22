import React from "react";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Starry background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "radial-gradient(white 1px, transparent 1px), radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "40px 40px, 80px 80px",
          backgroundPosition: "0 0, 20px 20px",
          opacity: 0.25
        }}
      />
      <div style={{ maxWidth: "400px", width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h1
          style={{
            fontSize: "5rem",
            fontWeight: 700,
            marginBottom: "1rem",
            color: "#60a5fa"
          }}
        >
          404
        </h1>
        <h2 style={{ fontSize: "2rem", fontWeight: 500, marginBottom: "1.5rem" }}>
          Oops... we can&apos;t find the window of our shop
        </h2>
        <a
          href="/"
          style={{ color: "#60a5fa", textDecoration: "underline", fontSize: "1.1rem" }}
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
