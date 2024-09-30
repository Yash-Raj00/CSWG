import { useEffect, useState } from "react";

import styles from "../../page.module.css";

const statusPayload = {};

statusPayload[0] = "Not Started";
statusPayload[1] = "Started";
statusPayload[2] = "Completed";
statusPayload[-1] = "Error";

export default function Row({ row }) {
  const streamingRow = row;
  return (
    <tr className={styles.row}>
      <td className={styles.td}>
        <span className={styles.smallCell}>
          {statusPayload[streamingRow.status]}
        </span>
      </td>
      <td className={styles.td}>
        <span className={styles.limitedSpan}>
          {streamingRow.source_system_name}
        </span>
      </td>
      <td className={styles.td}>
        <span className={styles.limitedSpan}>
          {streamingRow.source_table_name}
        </span>
      </td>
      <td className={styles.td}>
        <span className={styles.limitedSpan}>
          {streamingRow.target_table_name}
        </span>
      </td>
      <td className={styles.td}>
        <span className={styles.limitedSpan}>{streamingRow.type}</span>
      </td>
      <td className={styles.td}>
        <span className={styles.limitedSpan}>{streamingRow.created_date}</span>
      </td>
      <td className={styles.td}>
        <span className={styles.limitedSpan}>
          {streamingRow.completed_date}
        </span>
      </td>
      <td className={styles.td}>
        <span className={styles.limitedSpan}>{streamingRow.comment}</span>
      </td>
    </tr>
  );
}
