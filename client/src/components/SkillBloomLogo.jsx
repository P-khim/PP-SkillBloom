import React from "react";

function SkillBloomLogo({ fillColor = "#1dbf73", fontSize = "28px" }) {
  return (
    <div
      style={{
        color: fillColor,
        fontWeight: "bold",
        fontSize: fontSize,
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        letterSpacing: "-1px",
        userSelect: "none",
      }}
    >
      SkillBloom
    </div>
  );
}

export default SkillBloomLogo;
