import { useState } from "react";
import styles from "../../page.module.css";

export default function Row({ row, updateRow }) {
  const [changed, setChanged] = useState(false);
  const [streamingRow, setStreamingRow] = useState(row);
  const [isSelected, setIsSelected] = useState(false);

  const handleChange = (event) => {
    // console.log("handleChange", event.target.name);
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
    <tr
      onClick={() => setIsSelected(!isSelected)}
      className={styles.row}
      style={{
        backgroundColor: isSelected ? "#f2ffbf" : "",
      }}
    >
      <td className={styles.td} style={{ paddingLeft: 2 }}>
        <span className={styles.smallCell}>
          {streamingRow.created_by ?? ""}
        </span>
      </td>
      <td className={styles.td}>
        <span className={styles.smallCell}>
          {streamingRow.creation_date ?? ""}
        </span>
      </td>
      <td className={styles.td}>
        <span className={styles.smallCell}>
          {streamingRow.last_update_date ?? ""}
        </span>
      </td>
      <td className={styles.td}>
        <span className={styles.smallCell}>
          {streamingRow.last_updated_by ?? ""}
        </span>
      </td>
      <td className={styles.td}>
        <span className={styles.smallCell}>
          {streamingRow.level_code ?? ""}
        </span>
      </td>
      <td className={styles.td}>
        <span className={styles.smallCell}>
          {streamingRow.level_value ?? ""}
        </span>
      </td>
      <td className={styles.td}>
        <input
          onClick={(e) => e.stopPropagation()}
          name="level_value_meaning"
          type="text"
          className={styles.shortInput}
          value={streamingRow.level_value_meaning ?? ""}
          onChange={handleChange}
        />
      </td>
      <td className={styles.td}>
        <span className={styles.smallCell}>
          {streamingRow.lookup_code ?? ""}
        </span>
      </td>
      <td className={styles.td}>
        <input
          onClick={(e) => e.stopPropagation()}
          name="lookup_description"
          type="text"
          className={styles.mediumInput}
          value={streamingRow.lookup_description ?? ""}
          onChange={handleChange}
        />
      </td>
      <td className={styles.td}>
        <input
          onClick={(e) => e.stopPropagation()}
          name="profile_value"
          type="text"
          className={styles.shortInput}
          value={streamingRow.profile_value ?? ""}
          onChange={handleChange}
        />
      </td>
      <td className={styles.td}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            commitChanges();
          }}
          style={{
            padding: 1,
            marginRight: 2,
            backgroundColor: changed ? "#98FB98" : "",
          }}
          disabled={!changed}
        >
          Save
        </button>
      </td>
    </tr>
  );
}
