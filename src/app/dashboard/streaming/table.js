import React, { useEffect, useState } from "react";
import styles from "../../page.module.css";
import Row from "./row";

export default function Table({
  data,
  updateRow,
  deleteRow,
  unvoidRow,
  updateLastRunAction,
  handleDuplicateRow,
}) {
  const [tableKey, setTableKey] = useState(0);
  useEffect(() => {
    setTableKey((prev) => prev + 1);
  }, [data]);

  return (
    <table className={styles.table} key={tableKey}>
      <thead>
        <tr>
          <th className={styles.pb_4}>Source Name</th>
          <th className={styles.pb_4}>Source Table</th>
          <th className={styles.pb_4}>Type</th>
          <th className={styles.pb_4}>Target Keyspace</th>
          <th className={styles.pb_4}>Target Table</th>
          <th className={styles.pb_4}>Active</th>
          <th className={styles.pb_4}>Group</th>
          <th className={styles.pb_4}></th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <Row
            row={{ ...row }}
            index={index}
            updateRow={updateRow}
            deleteRow={deleteRow}
            unvoidRow={unvoidRow}
            updateLastRunAction={updateLastRunAction}
            handleDuplicateRow={handleDuplicateRow}
            key={`${row.source_system_name}${row.source_table_name}${row.target_table_name}`}
          />
        ))}
      </tbody>
    </table>
  );
}
