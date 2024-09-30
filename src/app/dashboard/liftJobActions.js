"use server";

import { revalidatePath } from "next/cache";
import {
  ConnectToCassandra,
  UpdateQuery,
  SelectQuery,
} from "@/lib/common/db/pool";

const selectLiftJobRowsQuery = "select * from wip_lift_ing.lift_job_control";

const updateRowQuery = `UPDATE wip_lift_ing.lift_job_control 
  SET enable = ?, update_time = ?
  WHERE job_id = ? and warehouse_id = ?`;

const selectAction = async () => {
  return await SelectQuery(selectLiftJobRowsQuery);
};

const updateAction = async (row) => {
  const { enable, job_id, warehouse_id } = row;

  const update_time = new Date().toISOString().slice(0, 19).replace("T", " ");

  const params = [
    enable,
    update_time,
    job_id,
    warehouse_id,
  ];

  return await UpdateQuery(updateRowQuery, params);
};

export { selectAction, updateAction, ConnectToCassandra };
