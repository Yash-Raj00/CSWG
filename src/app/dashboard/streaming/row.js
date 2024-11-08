import { useState } from "react";
import { Modal } from "react-responsive-modal";
import styles from "../../page.module.css";
import "react-responsive-modal/styles.css";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { activePayload, dbTypePayload, groupTypePayload } from "./constants";
import EditRow from "./EditRow";
import ExpandedRowContent from "./ExpandedRowContent";

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
  const [isSelectedRow, setSelectedRow] = useState(false);

  const handleFacilityChange = (selectedFacilities) => {
    // strip object down to value only
    const facilities = [
      ...selectedFacilities.map((facility) => facility.value),
    ];
    // console.log("handleFacilityChange", selectedFacilities, facilities);

    // join array to string
    setStreamingRow({
      ...streamingRow,
      facility: facilities.join(", "),
    });
    setChanged(true);
  };

  const onOpenModal = () => setModalOpen(true);

  const onCloseModal = () => setModalOpen(false);

  const handleChange = (event) => {
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
      toast.success("Copied to clipboard");
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

  function convertJsonToSqlUpdate(json) {
    // Table name
    const tableName = "wip_configuration.spark_streaming_some_table";

    // Remove fields used in WHERE clause and define the remaining columns for SET clause
    const { source_system_name, source_table_name, ...columns } = json;

    // WHERE
    const whereClause = `WHERE
   source_system_name = '${source_system_name}'
   AND source_table_name = '${source_table_name}';`;

    // Build the SET clause by iterating over the keys and values of the columns object
    const setClause = Object.entries(columns)
      .filter(([, value]) => value !== null)
      .map(([key, value]) => {
        // Convert value to appropriate SQL format
        if (typeof value === "string") return `   ${key} = '${value}'`;
        if (Array.isArray(value)) {
          console.log(key);
          return `   ${key} = ${JSON.stringify(value)}`;
        }
        return `   ${key} = ${value}`;
      })
      .join(",\n");

    // Combine into the final SQL statement
    const sqlUpdate = `
UPDATE ${tableName}
SET
${setClause}
${whereClause}`;

    return sqlUpdate;
  }

  const handleExportQuery = async () => {
    try {
      await navigator.clipboard.writeText(convertJsonToSqlUpdate(streamingRow));
      toast.success("Copied to clipboard");
    } catch (error) {
      console.error("Unable to copy to clipboard:", error);
    }
  };

  const handleUnvoidRow = () => {
    if (!window.confirm("Are you sure you want to un-void this row?")) {
      return;
    }
    unvoidRow(streamingRow, env);
  };

  const handleRowClick = () => {
    setSelectedRow((prev) => !prev);
  };

  const isVoid = !!streamingRow.voided_by;

  const getBorderColor = () => {
    if (
      streamingRow.error_text ||
      streamingRow.run_frequency_in_secs === 3600
    ) {
      return "red";
    }
    if (streamingRow.active === "Y" && !streamingRow.voided_by) {
      return "lightgreen";
    }
    if (streamingRow.active === "Y" && streamingRow.voided_by) {
      return "violet";
    }
    return "grey";
  };

  const getRowColor = () => {
    if (isSelectedRow) return "#f5ffcc";
    return index % 2 !== 0 ? "" : "#bbb";
  };

  let activeRowColor = getRowColor();
  let activeRowBorderColor = getBorderColor();
  let rowBorderStyle =
    streamingRow.active === "N" && activeRowBorderColor === "grey"
      ? "dashed"
      : "solid";

  return (
    <>
      <tr
        id="headRow"
        onClick={handleRowClick}
        className={styles.streamingRow}
        style={{
          backgroundColor: activeRowColor,
          borderColor: activeRowBorderColor,
          borderStyle: rowBorderStyle,
        }}
      >
        <td
          className={`${styles.streamingTd} ${styles.border_l_2} ${styles.border_r_2}`}
        >
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
        <td
          className={`${styles.streamingTd} ${styles.border_l_2} ${styles.border_r_2}`}
        >
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
        <td
          className={`${styles.streamingTd} ${styles.border_l_2} ${styles.border_r_2}`}
        >
          <select
            onClick={(e) => e.stopPropagation()}
            value={streamingRow.source_system_dbtype}
            name="source_system_dbtype"
            onChange={handleChange}
            disabled={true}
          >
            {dbTypePayload.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </td>
        <td
          className={`${styles.streamingTd} ${styles.border_l_2} ${styles.border_r_2}`}
        >
          <input
            onClick={(e) => e.stopPropagation()}
            name="target_keyspace"
            type="text"
            // className={styles.mediumInput}
            value={streamingRow.target_keyspace}
            onChange={handleChange}
            disabled={isVoid}
          />
        </td>
        <td
          className={`${styles.streamingTd} ${styles.border_l_2} ${styles.border_r_2}`}
        >
          <input
            onClick={(e) => e.stopPropagation()}
            name="target_table_name"
            type="text"
            className={styles.mediumInput}
            value={streamingRow.target_table_name}
            onChange={handleChange}
            disabled={isVoid}
          />
        </td>
        <td
          className={`${styles.streamingTd} ${styles.border_l_2} ${styles.border_r_2}`}
        >
          <select
            onClick={(e) => e.stopPropagation()}
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
        <td
          className={`${styles.streamingTd} ${styles.border_l_2} ${styles.border_r_2}`}
        >
          <select
            onClick={(e) => e.stopPropagation()}
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

        <td
          className={`${styles.streamingTd} ${styles.border_l_2} ${styles.border_r_2}`}
        >
          <button
            disabled={isVoid}
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            style={{ marginRight: 4 }}
          >
            Copy Query
          </button>
          <button
            disabled={isVoid}
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal();
            }}
            style={{ marginRight: 4 }}
          >
            Edit Query
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              commitChanges();
            }}
            disabled={!changed}
            style={{
              width: "60px",
              margin: "0px 1px 0px 0px",
              backgroundColor: changed ? "#98FB98" : "",
            }}
          >
            Save
          </button>
        </td>
      </tr>
      {showExpanded && (
        <tr
          className={`${styles.rowMid}`}
          onClick={handleRowClick}
          style={{
            backgroundColor: activeRowColor,
            borderColor: activeRowBorderColor,
            borderLeftStyle: rowBorderStyle,
            borderRightStyle: rowBorderStyle,
          }}
        >
          <td
            className=""
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
              handleUnvoidRow={handleUnvoidRow}
              handleChange={handleChange}
              handleExportQuery={handleExportQuery}
              handleRemoveLastRun={handleRemoveLastRun}
              handleDuplicateRow={handleDuplicateRow}
              handleFacilityChange={handleFacilityChange}
            />
          </td>
        </tr>
      )}
      <tr
        style={{
          backgroundColor: activeRowColor,
          border: "2.5px solid",
          borderColor: activeRowBorderColor,
          borderLeftStyle: rowBorderStyle,
          borderRightStyle: rowBorderStyle,
          borderBottomStyle: rowBorderStyle,
          borderTop: "none",
        }}
        onClick={handleRowClick}
      >
        <td colSpan="11" style={{ paddingTop: 4 }}>
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
