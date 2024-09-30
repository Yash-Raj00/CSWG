import { useEffect, useState } from "react";

import styles from "../../page.module.css";

import Row from "./row";

export default function Table({ data, updateRow }) {
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
          <th>Run Freq</th>
          <th>Last Run</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <Row
            row={row}
            updateRow={updateRow}
            key={`${row.source_system_name}${row.source_table_name}${row.target_table_name}`}
          />
        ))}
      </tbody>
    </table>
  );
}
