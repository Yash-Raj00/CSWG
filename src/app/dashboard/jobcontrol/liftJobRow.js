import { getWarehouseName } from "@/utils/helperMethods";
import { useState } from "react";
import styles from "../../page.module.css";
import { activePayload } from "../streaming/constants";

export default function Row({ row, updateRow }) {
  const [changed, setChanged] = useState(false);
  const [streamingRow, setStreamingRow] = useState(row);

  const handleChange = (event) => {
    console.log("handleChange", event.target.name);
    setStreamingRow({
      ...streamingRow,
      [event.target.name]: event.target.value ?? "",
    });

    setChanged(true);
  };

  const commitChanges = () => {
    updateRow(streamingRow);
    setChanged(false);
  };

  return (
    <tr className={styles.row}>
      <td className={styles.td}>
        <span className={styles.smallCell}>{streamingRow.job_id ?? ""}</span>
      </td>
      <td className={styles.td}>
        <span className={styles.limitedSpan}>
          {streamingRow.warehouse_id +
            ", " +
            getWarehouseName(streamingRow.warehouse_id) ?? ""}
        </span>
      </td>
      <td className={styles.td}>
        <select
          name="enable"
          onChange={handleChange}
          value={streamingRow.enable ?? ""}
        >
          {activePayload.map((item) => (
            <option key={item.value} value={item.value ?? ""}>
              {item.label ?? ""}
            </option>
          ))}
        </select>
      </td>
      <td className={styles.td}>
        <span className={styles.smallCell}>
          {streamingRow.update_time ?? ""}
        </span>
      </td>
      <td className={styles.td}>
        <button onClick={commitChanges} disabled={!changed}>
          Save
        </button>
      </td>
    </tr>
  );
}
