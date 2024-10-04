import { useEffect, useState } from "react";
import styles from "../../page.module.css";
import React from "react";
import Row from "./row";

export default function Table({
  data,
  updateRow,
  deleteRow,
  unvoidRow,
  updateLastRunAction,
  handleDuplicateRow
}) {

  const [datas, setdatas] = useState([])
  const [tableKey, setTableKey] = useState(0);
  useEffect(() => {
    setdatas(data);
    setTableKey(prev => prev + 1); // Change the key to force re-render
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
        {datas.map((row, index) => (
          <Row
            row={{...row}}
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
