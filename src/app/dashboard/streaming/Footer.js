import React, { useEffect, useState } from "react";
import { groupTypePayload } from "./constants";

function Footer({ data, loading }) {
  const [groupCounts, setGroupCounts] = useState(new Map());

  const exportToJson = () => {
    const json = JSON.stringify(data, null, 2); // Pretty print JSON
    const blob = new Blob([json], { type: "application/json" });
    saveAs(blob, "streaming_data.json");
  };

  useEffect(() => {
    const grpCounts = new Map();
    groupTypePayload.map((group) => {
      grpCounts.set(group.value, 0);
    });
    data.forEach((item) => {
      grpCounts.set(
        item.groupid || "unknown",
        (grpCounts.get(item.groupid || "unknown") || 0) + 1
      );
    });
    setGroupCounts(grpCounts);
  }, [data]);

  return (
    !loading && (
      <>
        <div className="footer">
          {[...groupCounts].map(([key, value]) => (
            <span
              key={key}
              style={{ fontSize: 14, marginLeft: 25, marginRight: 25 }}
            >
              {key}: {value}
            </span>
          ))}
        </div>
        <button
          disabled={loading}
          style={{ marginTop: "20px", padding: "2px 6px" }}
          onClick={exportToJson}
        >
          Export JSON
        </button>
      </>
    )
  );
}

export default Footer;
