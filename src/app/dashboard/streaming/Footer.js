import { convertJsonToSqlUpdate } from "@/utils";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import { groupTypePayload } from "./constants";

function Footer({ data, loading }) {
  const [groupCounts, setGroupCounts] = useState(new Map());

  const exportToJson = () => {
    const json = JSON.stringify(data, null, 2); // Pretty print JSON
    const blob = new Blob([json], { type: "application/json" });
    saveAs(blob, "streaming_data.json");
  };

  const exportToQueries = () => {
    const sqlUpdates = data.map(convertJsonToSqlUpdate).join("\n\n");
    const blob = new Blob([sqlUpdates], { type: "text/plain" });
    saveAs(blob, "streaming_data.sql");
  };

  useEffect(() => {
    const grpCounts = new Map();
    groupTypePayload.map((group) => {
      grpCounts.set(group.value, 0);
    });
    data.forEach((item) => {
      grpCounts.set(
        item.groupid || "NOT SET",
        (grpCounts.get(item.groupid || "NOT SET") || 0) + 1
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
        <div
          style={{
            display: "flex",
            gap: 20,
          }}
        >
          <button
            disabled={loading}
            style={{ marginTop: "20px", padding: "2px 6px" }}
            onClick={exportToJson}
          >
            Export JSON
          </button>
          <button
            disabled={loading}
            style={{ marginTop: "20px", padding: "2px 6px" }}
            onClick={exportToQueries}
          >
            Export Queries
          </button>
        </div>
      </>
    )
  );
}

export default Footer;
