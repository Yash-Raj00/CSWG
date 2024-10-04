import { useState } from "react";
import { Modal } from "react-responsive-modal";

import styles from "../../page.module.css";
import "react-responsive-modal/styles.css";
import { dbTypePayload, groupTypePayload, activePayload } from "./constants";
import EditRow from "./EditRow";
import ExpandedRowContent from "./ExpandedRowContent";
import { useSearchParams } from "next/navigation";

export default function Row({
  row,
  index,
  updateRow,
  deleteRow,
  unvoidRow,
  updateLastRunAction,
  handleDuplicateRow,
}) {
  const env = useSearchParams().get("env");
  const [modalOpen, setModalOpen] = useState(false);
  const [changed, setChanged] = useState(false);
  const [streamingRow, setStreamingRow] = useState(row);
  const [showExpanded, setShowExpanded] = useState(false);

  const onOpenModal = () => setModalOpen(true);

  const onCloseModal = () => setModalOpen(false);

  const handleChange = (event) => {
    // console.log("handleChange", event.target.name);
    setStreamingRow({
      ...streamingRow,
      [event.target.name]: event.target.value,
    });

    setChanged(true);
  };

  const commitChanges = () => {
    const parsed_default_run_frequency_in_secs = parseInt(
      streamingRow.default_run_frequency_in_secs
    );
    if (
      !parsed_default_run_frequency_in_secs ||
      isNaN(parsed_default_run_frequency_in_secs) ||
      parsed_default_run_frequency_in_secs === 0
    ) {
      return alert("Invalid Default Run Frequency value.");
    }
    updateRow(streamingRow);
    setChanged(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(streamingRow.source_table_query);
      console.log("Copied to clipboard");
    } catch (error) {
      console.error("Unable to copy to clipboard:", error);
    }
  };

  const handleRemoveLastRun = async () => {
    if (!window.confirm("Are you sure you want to remove the last run?")) {
      return;
    }
    const updatedRow = {
      source_system_name: streamingRow.source_system_name,
      source_table_name: streamingRow.source_table_name,
    };

    const result = await updateLastRunAction(updatedRow, env);

    if (!result) {
      console.error("Failed to remove last run");
      return;
    }

    console.log("Last run removed");

    setStreamingRow(updatedRow);
  };

  const handleDeleteRow = () => {
    if (!window.confirm("Are you sure you want to delete this row?")) {
      return;
    }
    deleteRow(streamingRow, env);
  };

  const handleUnvoidRow = () => {
    if (!window.confirm("Are you sure you want to un-void this row?")) {
      return;
    }
    unvoidRow(streamingRow, env);
  };

  // if index is even then row color is white, else row color is lightgray
  const rowColor = index % 2 !== 0 ? "" : "#bbb";
  const isVoid = streamingRow.voided_by;

  let activeRowBorderColor = "grey";
  if (streamingRow.error_text !== null || streamingRow.run_frequency_in_secs === 3600) {
    activeRowBorderColor = "red";
  } else if (streamingRow.active === "Y" && !streamingRow.voided_by) {
    activeRowBorderColor = "lightgreen";
  } else if(streamingRow.active === "Y" && streamingRow.voided_by) {
    activeRowBorderColor = "violet";
  }

  return (
    <>
      <tr className={styles.row} style={{ backgroundColor: rowColor, borderColor: activeRowBorderColor}}>
        <td className={`${styles.streamingTd} ${styles.border_l_2} ${styles.border_r_2}`}>
          <span
            className={styles.tinySpan}
            style={{
              textDecorationLine: isVoid && "line-through",
              color: isVoid ? "grey" : "black",
            }}
          >
            {streamingRow.source_system_name}
          </span>
        </td>
        <td className={`${styles.streamingTd} ${styles.border_l_2} ${styles.border_r_2}`}>
          <span
            className={styles.limitedSpan}
            style={{
              textDecorationLine: isVoid && "line-through",
              color: isVoid ? "grey" : "black",
            }}
          >
            {streamingRow.source_table_name}
          </span>
        </td>
        <td className={`${styles.streamingTd} ${styles.border_l_2} ${styles.border_r_2}`}>
          <select
            value={streamingRow.source_system_dbtype}
            name="source_system_dbtype"
            onChange={handleChange}
            disabled={isVoid}
          >
            {dbTypePayload.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </td>
        <td className={`${styles.streamingTd} ${styles.border_l_2} ${styles.border_r_2}`}>
          <input
            name="target_keyspace"
            type="text"
            // className={styles.mediumInput}
            value={streamingRow.target_keyspace}
            onChange={handleChange}
            disabled={isVoid}
          />
        </td>
        <td className={`${styles.streamingTd} ${styles.border_l_2} ${styles.border_r_2}`}>
          <input
            name="target_table_name"
            type="text"
            className={styles.mediumInput}
            value={streamingRow.target_table_name}
            onChange={handleChange}
            disabled={isVoid}
          />
        </td>
        <td className={`${styles.streamingTd} ${styles.border_l_2} ${styles.border_r_2}`}>
          <select
            name="active"
            onChange={handleChange}
            value={streamingRow.active}
            disabled={isVoid}
          >
            {activePayload.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </td>
        <td className={`${styles.streamingTd} ${styles.border_l_2} ${styles.border_r_2}`}>
          <select
            name="groupid"
            onChange={handleChange}
            value={streamingRow.groupid}
            disabled={isVoid}
          >
            {groupTypePayload.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </td>

        <td className={`${styles.streamingTd} ${styles.border_l_2} ${styles.border_r_2}`}>
          <button
          disabled={isVoid}
           onClick={handleCopy} style={{ marginRight: 4 }}>
            Copy Query
          </button>
          <button
          disabled={isVoid}
           onClick={() => onOpenModal()} style={{ marginRight: 4 }}>
            Edit Query
          </button>
          <button
            onClick={commitChanges}
            disabled={!changed}
            style={{ width: "60px" }}
          >
            Save
          </button>
        </td>
      </tr>
      {showExpanded && (
        <tr className={`${styles.rowMid}`} style={{ backgroundColor: rowColor, borderColor: activeRowBorderColor}}>
          <td
          className=''
            colSpan="11"
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <ExpandedRowContent
              streamingRow={streamingRow}
              handleDeleteRow={handleDeleteRow}
              handleUnvoidRow={handleUnvoidRow}
              handleChange={handleChange}
              commitChanges={commitChanges}
              changed={changed}
              handleRemoveLastRun={handleRemoveLastRun}
              handleDuplicateRow={handleDuplicateRow}
            />
          </td>
        </tr>
      )}
      <tr style={{ backgroundColor: rowColor, border: "2.5px solid", borderColor: activeRowBorderColor, borderTop: "none",}}>
        <td colSpan="11" style={{paddingTop: 4 }} >
          <EditRow
            setShowExpanded={setShowExpanded}
            showExpanded={showExpanded}
          />
        </td>
      </tr>
      <Modal
        open={modalOpen}
        onClose={onCloseModal}
        center
        classNames={{
          overlay: styles.customOverlay,
          modal: styles.customModal,
        }}
      >
        <h2>Query</h2>
        <p>
          {streamingRow.source_table_name} {streamingRow.target_keyspace}{" "}
          {streamingRow.target_table_name}
        </p>
        {modalOpen && (
          <textarea
            style={{ width: "100%", height: 400 }}
            value={streamingRow.source_table_query}
            name="source_table_query"
            onChange={handleChange}
          />
        )}
      </Modal>
      <br />
    </>
  );
}
