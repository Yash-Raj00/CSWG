import React from "react";
import { TbDatabaseExport } from "react-icons/tb";
import { MultiSelect } from "react-multi-select-component";
import styles from "../../page.module.css";
import { facilityPayload } from "./constants";

function ExpandedRowContent({
  streamingRow,
  handleDeleteRow,
  handleUnvoidRow,
  handleChange,
  handleExportQuery,
  handleRemoveLastRun,
  handleDuplicateRow,
  handleFacilityChange,
}) {
  const tableRowStyle = {
    display: "inline-flex",
    flexDirection: "column",
    padding: "2px",
    height: "90px",
  };

  const isVoid = streamingRow.voided_by;

  // convert facility string to array
  const facilities = streamingRow.facility
    ? streamingRow.facility
        .split(",")
        .map((facilityRow) => {
          const foundFacility = facilityPayload.find(
            (item) => item.value === facilityRow.trim()
          );
          return foundFacility;
        })
        .filter((item) => item)
    : [];

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
          {isVoid && (
            <>
              voided_by
              <br /> {streamingRow.voided_by}
            </>
          )}
        </span>
        <br />
        <span
          className={styles.smallCell}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          export query:
          <TbDatabaseExport
            onClick={(e) => {
              e.stopPropagation();
              handleExportQuery();
            }}
            style={{ width: 20, height: 20, cursor: "pointer" }}
          />
          <br />
          {""}
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
          {streamingRow.updated_date
            ? new Date(streamingRow.updated_date * 1000).toLocaleDateString() +
              " " +
              new Date(streamingRow.updated_date * 1000).toLocaleTimeString()
            : ""}
        </span>
      </div>
      <div
        className={styles.streamingTdMid}
        style={{
          tableRowStyle,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          marginTop: 2,
        }}
      >
        <span className={styles.smallCell}>Facility</span>
        <span
          onClick={(e) => e.stopPropagation()}
          style={{ marginTop: 1, width: 185, fontSize: 11 }}
        >
          <MultiSelect
            options={facilityPayload}
            value={facilities}
            onChange={(facility) => handleFacilityChange(facility)}
            labelledBy="Facility"
          />
        </span>
        {streamingRow.source_system_dbtype === "REST-Webservice" && (
          <span
            className={styles.smallCell}
            style={{ position: "relative", top: 23 }}
          >
            <span>Rest url:</span>
            <div>
              <input
                onClick={(e) => e.stopPropagation()}
                name="rest_url"
                type="text"
                className={styles.shortInput}
                value={streamingRow.rest_url || ""}
                onChange={handleChange}
                disabled={isVoid}
                style={{
                  width: "100%",
                }}
              />
            </div>
          </span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>
          <div
            className={styles.streamingTdMid}
            style={{ ...tableRowStyle, height: 60 }}
          >
            <span className={styles.smallCell}>run freq</span>
            <span className={styles.smallCell}>
              <input
                onClick={(e) => e.stopPropagation()}
                name="run_frequency_in_secs"
                type="text"
                className={styles.shortInput}
                value={streamingRow.run_frequency_in_secs || ""}
                onChange={handleChange}
                disabled={isVoid}
              />
            </span>
          </div>
          <div
            className={styles.streamingTdMid}
            style={{ ...tableRowStyle, height: 60 }}
          >
            <span className={styles.smallCell}>default run</span>
            <span className={styles.smallCell}>
              <input
                onClick={(e) => e.stopPropagation()}
                name="default_run_frequency_in_secs"
                type="text"
                className={styles.shortInput}
                value={streamingRow.default_run_frequency_in_secs || ""}
                onChange={handleChange}
                disabled={isVoid}
              />
            </span>
          </div>
          <div
            className={styles.streamingTdMid}
            style={{ ...tableRowStyle, height: 60 }}
          >
            <span className={styles.smallCell}>alert</span>
            <span className={styles.smallCell}>
              <input
                onClick={(e) => e.stopPropagation()}
                name="alert_frequency_in_secs"
                type="text"
                className={styles.shortInput}
                value={streamingRow.alert_frequency_in_secs || ""}
                onChange={handleChange}
                disabled={isVoid}
              />
            </span>
          </div>
          <div
            className={styles.streamingTdMid}
            style={{ ...tableRowStyle, height: 60 }}
          >
            <span className={styles.smallCell}>batch</span>
            <span className={styles.smallCell}>
              <input
                onClick={(e) => e.stopPropagation()}
                name="batch_size"
                type="text"
                className={styles.shortInput}
                value={streamingRow.batch_size}
                onChange={handleChange}
                disabled={isVoid}
              />
            </span>
          </div>
        </div>
        {streamingRow.voided_by && (
          <span className={styles.smallCell}>
            Update by:{" "}
            {streamingRow.update_by ? streamingRow.update_by : "No Data"}
          </span>
        )}
      </div>
      <div className={styles.streamingTdMid} style={tableRowStyle}>
        <span className={styles.smallCell}>Notes</span>
        <textarea
          onClick={(e) => e.stopPropagation()}
          name="notes"
          value={streamingRow.notes}
          onChange={handleChange}
          rows={3}
          disabled={isVoid}
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDuplicateRow(streamingRow);
            }}
            style={{ width: "60px" }}
          >
            Duplicate
          </button>
          {isVoid ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUnvoidRow();
              }}
              style={{ width: "60px" }}
            >
              Unvoid
            </button>
          ) : (
            <button
              disabled={streamingRow.active === "Y"}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteRow();
              }}
              style={{ width: "60px" }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpandedRowContent;
