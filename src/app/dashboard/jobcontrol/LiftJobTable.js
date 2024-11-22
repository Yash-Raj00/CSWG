"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../page.module.css";
import { selectAction, updateAction } from "../liftJobActions";
import Row from "./liftJobRow";

export default function LiftTable({ env }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await selectAction(env);
      if (!data) {
        setLoading(false);
        return toast.error("Unable to Connect to DB");
      }

      console.log("LiftTable fetchData", data);

      setList(data);
      setLoading(false);
    };

    fetchData();
  }, [env]);

  const updateRow = async (row) => {
    try {
      // Attempt to update the database
      const result = await updateAction(row, env);

      if (!result) {
        toast.error("Failed to update row");
        return;
      }

      toast.success("Row updated");

      setList((prevList) =>
        prevList.map((item) =>
          item.job_id === row.job_id && item.warehouse_id === row.warehouse_id
            ? row
            : item
        )
      );
    } catch (error) {
      console.error("Error updating row:", error);
      toast.error("An error occurred while updating the row");
    }
  };

  return (
    <main className={styles.streaming}>
      <h1>Lift Job Control</h1>
      <table className={`${styles.table} ${styles.marginTop30}`}>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Warehouse</th>
            <th>Enabled</th>
            <th>update_time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.map((row) => (
            <Row
              row={row}
              updateRow={updateRow}
              key={`${row.job_id}${row.warehouse_id}`}
            />
          ))}
        </tbody>
      </table>
    </main>
  );
}
