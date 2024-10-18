"use client";
import { useEffect, useState } from "react";
import { sort } from "fast-sort";
import { selectAction, updateAction } from "../lookupProfilesJobTableActions";
import styles from "../../page.module.css";
import Row from "./lookupProfilesJobRow";
import { toast } from "react-toastify";

export default function LookupProfilesTable({ env }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await selectAction(env);

      console.log("LookupProfilesTable fetchData", data);

      setList(data);
      setLoading(false);
    };

    fetchData();
  }, [env]);

  const updateRow = async (row) => {
    // attempt to update db
    const result = await updateAction({ ...row, last_updated_by: localStorage.getItem("user") }, env);

    if (!result) {
      toast.error("Failed to update row");
      return;
    }

    toast.success("Row updated");

    // update local state  WILL WORK ON THIS LATER...
    // setList((prevList) =>
    //   prevList.map((item) =>
    //     item.job_id === row.job_id && item.warehouse_id === row.warehouse_id
    //       ? row
    //       : item
    //   )
    // );
  };
  const sortedList = sort(list).desc((u) => u.last_update_date);

  return (
    <main className={styles.streaming}>
      <h1>Lookup Profiles Job Control</h1>
      <table className={`${styles.table} ${styles.marginTop30}`}>
        <thead>
          <tr>
            <th>Created By</th>
            <th>Creation Date</th>
            <th>Last Update Date</th>
            <th>Last Updated By</th>
            <th>Level Code</th>
            <th>Level Value</th>
            <th>Level Value Meaning</th>
            <th>Lookup Code</th>
            <th>Lookup Description</th>
            <th>Profile Value</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedList.map((row, i) => (
            <Row row={row} updateRow={updateRow} key={i} />
          ))}
        </tbody>
      </table>
    </main>
  );
}
