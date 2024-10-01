import React from "react";
import styles from "../../page.module.css";

function ExpandedRowContent({
  streamingRow,
  handleDeleteRow,
  handleChange,
  commitChanges,
  changed,
  handleRemoveLastRun,
  handleDuplicateRow,
}) {
  const tableRowStyle = {
    display: "inline-flex",
    flexDirection: "column",
    padding: "2px",
    height: "90px",
  };

  return (
    <div
      style={{
        flex: 1,
        flexDirection: "row",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div className={styles.streamingTdMid} style={tableRowStyle}>
        <span className={styles.tinySpan}>
          {streamingRow.voided_by && (
            <>
              voided_by
              <br /> {streamingRow.voided_by}
            </>
          )}
        </span>
      </div>
      <div className={styles.streamingTdMid} style={tableRowStyle}>
        <span className={styles.smallCell}>
          Last run: <br />
          {streamingRow.last_run_timestamp}
          <p onClick={handleRemoveLastRun}>Clear Last Run</p>
        </span>
        <br />
        <span className={styles.smallCell}>
          Updated: <br />
          {streamingRow.updated_date ? new Date(streamingRow.updated_date * 1000).toLocaleDateString() + " " + new Date(streamingRow.updated_date * 1000).toLocaleTimeString() : ""}
        </span>
      </div>
      <div className={styles.streamingTdMid} style={tableRowStyle}>
        <span className={styles.smallCell}>Facility</span>
        <span className={styles.smallCell}>
          <input
            name="facility"
            type="text"
            className={styles.shortInput}
            value={streamingRow.facility}
            onChange={handleChange}
          />
        </span>
      </div>
      <div className={styles.streamingTdMid} style={tableRowStyle}>
        <span className={styles.smallCell}>run freq</span>
        <span className={styles.smallCell}>
          <input
            name="run_frequency_in_secs"
            type="text"
            className={styles.shortInput}
            value={streamingRow.run_frequency_in_secs}
            onChange={handleChange}
          />
        </span>
      </div>
      <div className={styles.streamingTdMid} style={tableRowStyle}>
        <span className={styles.smallCell}>default run</span>
        <span className={styles.smallCell}>
          <input
            name="default_run_frequency_in_secs"
            type="text"
            className={styles.shortInput}
            value={streamingRow.default_run_frequency_in_secs}
            onChange={handleChange}
          />
        </span>
      </div>
      <div className={styles.streamingTdMid} style={tableRowStyle}>
        <span className={styles.smallCell}>alert</span>
        <span className={styles.smallCell}>
          <input
            name="alert_frequency_in_secs"
            type="text"
            className={styles.shortInput}
            value={streamingRow.alert_frequency_in_secs}
            onChange={handleChange}
          />
        </span>
      </div>
      <div className={styles.streamingTdMid} style={tableRowStyle}>
        <span className={styles.smallCell}>batch</span>
        <span className={styles.smallCell}>
          <input
            name="batch_size"
            type="text"
            className={styles.shortInput}
            value={streamingRow.batch_size}
            onChange={handleChange}
          />
        </span>
      </div>
      <div className={styles.streamingTdMid} style={tableRowStyle}>
        <span className={styles.smallCell}>Notes</span>
        <textarea
          name="notes"
          value={streamingRow.notes}
          onChange={handleChange}
          rows={3}
          style={{
            height: "70px",
            width: "250px",
            maxHeight: "70px",
            maxWidth: "250px",
            minHeight: "70px",
            minWidth: "250px",
          }}
        />
      </div>
      <div className={styles.streamingTdMid} style={tableRowStyle}>
        <span className={styles.smallCell}></span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            height: "80px",
            padding: "2px",
          }}
        >
          <button onClick={() => handleDuplicateRow(streamingRow)} style={{ width: "60px" }}>
            Duplicate
          </button>
          <button onClick={handleDeleteRow} style={{ width: "60px" }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpandedRowContent;
