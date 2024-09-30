import { useState } from "react";
import styles from "../../page.module.css";
import React from "react";
import Row from "./row";

export default function Table({
  data,
  updateRow,
  deleteRow,
  updateLastRunAction,
  handleDuplicateRow
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Source Name</th>
          <th>Source Table</th>
          <th>Type</th>
          <th>Target Keyspace</th>
          <th>Target Table</th>
          <th>Active</th>
          <th>Group</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <Row
            row={row}
            index={index}
            updateRow={updateRow}
            deleteRow={deleteRow}
            updateLastRunAction={updateLastRunAction}
            handleDuplicateRow={handleDuplicateRow}
            key={`${row.source_system_name}${row.source_table_name}${row.target_table_name}`}
          />
        ))}
      </tbody>
    </table>
  );
}
