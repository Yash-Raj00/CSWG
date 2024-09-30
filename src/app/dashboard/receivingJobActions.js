"use server";

import { revalidatePath } from "next/cache";
import {
  ConnectToCassandra,
  UpdateQuery,
  SelectQuery,
} from "@/lib/common/db/pool";

const selectReceivingJobRowsQuery = "select * from wip_rcv_ing.rcv_job_control";

const updateRowQuery = `UPDATE wip_rcv_ing.rcv_job_control
  SET enabled = ?, update_time = ?
  WHERE job_id = ? and warehouse_id = ?`;

const selectAction = async () => {
  return await SelectQuery(selectReceivingJobRowsQuery);
};

const updateAction = async (row) => {
  const { enabled, job_id, warehouse_id } = row;

  const update_time = new Date().toISOString().slice(0, 19).replace("T", " ");

  const params = [enabled, update_time, job_id, warehouse_id];

  return await UpdateQuery(updateRowQuery, params);
};

export { selectAction, updateAction, ConnectToCassandra };
