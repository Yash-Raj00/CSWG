"use client";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { FiRefreshCw } from "react-icons/fi";
import { selectAction } from "../runLogActions";
import styles from "../../page.module.css";
import Row from "./RunLogRow";

export default function RunLog({ env }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    setLoading(true);
    const data = await selectAction(env);

    console.log("WarehouseTable fetchData", data);

    setList(data);
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className={styles.streaming}>
      <data className={styles.logHeader}>
        <h1>Run Log</h1>
        <div
          className={`${styles.refreshIcon} ${
            isRefreshing ? styles.loading : ""
          }`}
        >
          <FiRefreshCw onClick={async () => await fetchData()} />
        </div>
      </data>

      <table className={`${styles.table} ${styles.marginTop30}`}>
        <thead>
          <tr>
            <th>Status</th>
            <th>Source System</th>
            <th>Source Table</th>
            <th>Target Table</th>
            <th>Type</th>
            <th>Created Date</th>
            <th>Completed Date</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {list.map((row) => (
            <Row row={row} key={`${row.id}`} />
          ))}
        </tbody>
      </table>
    </main>
  );
}
