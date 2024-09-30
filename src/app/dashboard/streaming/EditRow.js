import React from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

function EditRow({ setShowExpanded, showExpanded }) {
  const container = {
    textAlign: "center",
    width: "100%",
    marginBottom: 15,
  };
  const buttonStyle = {
    width: "100px",
    padding: "1px",
    transition: "max-height 0.5s ease-out",
  };
  return (
    <div style={container}>
      <button
        style={buttonStyle}
        onClick={() => setShowExpanded(!showExpanded)}
      >
        {showExpanded ? <AiOutlineUp /> : <AiOutlineDown />}
      </button>
    </div>
  );
}

export default EditRow;
