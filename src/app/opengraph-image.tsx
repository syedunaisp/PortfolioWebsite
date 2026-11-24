import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Syed Unais Panjathan — AI Engineer & Machine Learning Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #0d0d1a 100%)",
          padding: "0 80px",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Blue glow */}
        <div
          style={{
            position: "absolute",
            right: "-100px",
            top: "50%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(0,217,255,0.08)",
            transform: "translateY(-50%)",
            filter: "blur(60px)",
          }}
        />
        {/* Purple glow */}
        <div
          style={{
            position: "absolute",
            left: "-100px",
            top: "50%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(188,19,254,0.08)",
            transform: "translateY(-50%)",
            filter: "blur(60px)",
          }}
        />

        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            left: "80px",
            top: "250px",
            width: "6px",
            height: "140px",
            borderRadius: "3px",
            background: "linear-gradient(180deg, #00d9ff, #bc13fe)",
          }}
        />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", paddingLeft: "36px", gap: "0px" }}>
          {/* Name */}
          <span
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-2px",
              lineHeight: 1.1,
              marginBottom: "12px",
            }}
          >
            Syed Unais Panjathan
          </span>

          {/* Title */}
          <span
            style={{
              fontSize: "30px",
              fontWeight: 400,
              color: "#00d9ff",
              marginBottom: "32px",
            }}
          >
            AI Engineer &amp; Machine Learning Developer
          </span>

          {/* Tags */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {["Generative AI", "LLM Applications", "MLOps", "Applied AI"].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(0,217,255,0.25)",
                    color: "#aaaaaa",
                    fontSize: "18px",
                  }}
                >
                  {tag}
                </div>
              )
            )}
          </div>
        </div>

        {/* URL watermark */}
        <span
          style={{
            position: "absolute",
            bottom: "48px",
            left: "116px",
            fontSize: "22px",
            color: "#444444",
          }}
        >
          unais.vercel.app
        </span>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
