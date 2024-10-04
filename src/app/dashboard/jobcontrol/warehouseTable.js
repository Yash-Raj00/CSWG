"use client";
import { useEffect, useState } from "react";
import { sort } from "fast-sort";
import {
  selectAction,
  updateAction,
  ConnectToCassandra,
} from "../warehouseJobActions";
import styles from "../../page.module.css";
import Row from "./warehouseJobRow";
import { toast } from "react-toastify";

export default function WarehouseTable({ env }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await ConnectToCassandra(env);
      const data = await selectAction(env);

      console.log("WarehouseTable fetchData", data);

      setList(data);
      setLoading(false);
    };

    fetchData();
  }, [env]);

  const updateRow = async (row) => {
    // attempt to update db
    const result = await updateAction(row, env);

    if (!result) {
      toast.error("Failed to update row");
      return;
    }

    toast.success("Row updated");

    // update local state
    setList((prevList) =>
      prevList.map((item) =>
        item.job_id === row.job_id && item.warehouse_id === row.warehouse_id
          ? row
          : item
      )
    );
  };

  const sortedList = sort(list).asc([(u) => u.job_id, (u) => u.warehouse_id]);

  return (
    <main className={styles.streaming}>
      <h1>Warehouse Job Control</h1>
      <table className={`${styles.table} ${styles.marginTop30}`}>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Warehouse ID</th>
            <th>Enabled</th>
            <th>group_key</th>
            <th>
              unplanned
              <br />
              pick_interval
            </th>
            <th>update_time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedList.map((row) => (
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
