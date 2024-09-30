import { useState } from "react";
import { Modal } from "react-responsive-modal";

import styles from "../../page.module.css";
import "react-responsive-modal/styles.css";
import { dbTypePayload } from "./constants";
import EditRow from "./EditRow";
import ExpandedRowContent from "./ExpandedRowContent";

const activePayload = [
  { value: "Y", label: "Y" },
  { value: "N", label: "N" },
];
const groupNames = [
  { value: "GRP1", label: "GRP1" },
  { value: "GRP2", label: "GRP2" },
  { value: "GRP3", label: "GRP3" },
  { value: "GRP4", label: "GRP4" },
  { value: "GRP5", label: "GRP5" },
  { value: "GRP6", label: "GRP6" },
  { value: "GRP7", label: "GRP7" },
  { value: "WFMGrp", label: "WFMGrp" },
  { value: "GRP0", label: "GRP0-TEST" },
];

export default function Row({
  row,
  index,
  updateRow,
  deleteRow,
  updateLastRunAction,
  handleDuplicateRow,
}) {
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

    const result = await updateLastRunAction(updatedRow);

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
    deleteRow(streamingRow);
  };

  // if index is even then row color is white, else row color is lightgray
  const rowColor = index % 2 !== 0 ? "" : "#bbb";
  const isVoid = !!streamingRow.voided_by;

  let activeCellColor = null;
  if (streamingRow.error_text !== null) {
    activeCellColor = "red";
  } else if (streamingRow.active === "Y") {
    activeCellColor = "lightgreen";
  }

  return (
    <>
      <tr className={styles.row} style={{ backgroundColor: rowColor }}>
        <td className={styles.streamingTd}>
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
        <td className={styles.streamingTd}>
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
        <td className={styles.streamingTd}>
          <select
            value={streamingRow.source_system_dbtype}
            name="source_system_dbtype"
            onChange={handleChange}
          >
            {dbTypePayload.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </td>
        <td className={styles.streamingTd}>
          <input
            name="target_keyspace"
            type="text"
            // className={styles.mediumInput}
            value={streamingRow.target_keyspace}
            onChange={handleChange}
          />
        </td>
        <td className={styles.streamingTd}>
          <input
            name="target_table_name"
            type="text"
            className={styles.mediumInput}
            value={streamingRow.target_table_name}
            onChange={handleChange}
          />
        </td>
        <td className={styles.streamingTd}>
          <select
            name="active"
            onChange={handleChange}
            value={streamingRow.active}
            style={{
              backgroundColor: activeCellColor,
            }}
          >
            {activePayload.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </td>
        <td className={styles.streamingTd}>
          <select
            name="groupid"
            onChange={handleChange}
            value={streamingRow.groupid}
          >
            {groupNames.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </td>

        <td className={styles.streamingTd}>
          <button onClick={handleCopy} style={{ marginRight: 4 }}>
            Copy Query
          </button>
          <button onClick={() => onOpenModal()} style={{ marginRight: 4 }}>
            Edit Query
          </button>
        </td>
      </tr>
      {showExpanded && (
        <tr className={styles.row} style={{ backgroundColor: rowColor }}>
          <td
            colSpan="11"
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <ExpandedRowContent
              streamingRow={streamingRow}
              handleDeleteRow={handleDeleteRow}
              handleChange={handleChange}
              commitChanges={commitChanges}
              changed={changed}
              handleRemoveLastRun={handleRemoveLastRun}
              handleDuplicateRow={handleDuplicateRow}
            />
          </td>
        </tr>
      )}
      <tr style={{ backgroundColor: rowColor }}>
        <td colSpan="11">
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
    </>
  );
}
