"use server";

import { SelectQuery, UpdateQuery } from "@/lib/common/db/pool";

const selectShippingJobRowsQuery =
  "select * from wip_shipping_ing.shipping_job_control";

const updateRowQuery = `UPDATE wip_shipping_ing.shipping_job_control 
  SET enabled = ?, update_time = ?
  WHERE job_id = ? and warehouse_id = ?`;

const selectAction = async (env) => {
  return await SelectQuery(selectShippingJobRowsQuery, env);
};

const updateAction = async (row, env) => {
  const { enabled, job_id, warehouse_id } = row;

  // create time string like this, based on UTC 2017-08-28 15:15:00
  const update_time = new Date().toISOString().slice(0, 19).replace("T", " ");

  const params = [enabled, update_time, job_id, warehouse_id];

  return await UpdateQuery(updateRowQuery, params, env);
};

export { selectAction, updateAction };
