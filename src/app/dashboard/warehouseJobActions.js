"use server";

import { revalidatePath } from "next/cache";
import { UpdateQuery, SelectQuery } from "@/lib/common/db/pool";

const selectWarehouseJobRowsQuery =
  "select * from wip_warehouse_data.warehouse_job_control";

const updateRowQuery = `UPDATE wip_warehouse_data.warehouse_job_control 
  SET enable = ?, group_key = ?, unplanned_pick_interval = ?, update_time = ?
  WHERE job_id = ? and warehouse_id = ?`;

const selectAction = async (env) => {
  return await SelectQuery(selectWarehouseJobRowsQuery, env);
};

const updateAction = async (row, env) => {
  const { enable, group_key, unplanned_pick_interval, job_id, warehouse_id } =
    row;

  const update_time = new Date().toISOString().slice(0, 19).replace("T", " ");

  const params = [
    enable,
    group_key,
    unplanned_pick_interval,
    update_time,
    job_id,
    warehouse_id,
  ];

  return await UpdateQuery(updateRowQuery, params, env);
};

export { selectAction, updateAction };
