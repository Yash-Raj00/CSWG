"use server";

import { revalidatePath } from "next/cache";
import {
  UpdateQuery,
  SelectQuery,
} from "@/lib/common/db/pool";

const selectShippingJobRowsQuery =
  "select * from wip_shipping_ing.shipping_job_control";

const updateRowQuery = `UPDATE wip_shipping_ing.shipping_job_control 
  SET enabled = ?, update_time = ?
  WHERE job_id = ? and warehouse_id = ?`;

const selectAction = async () => {
  return await SelectQuery(selectShippingJobRowsQuery);
};

const updateAction = async (row) => {
  const {
    enabled,
    job_id,
    warehouse_id,
  } = row;

  // create time string like this, based on UTC 2017-08-28 15:15:00
  const update_time = new Date().toISOString().slice(0, 19).replace("T", " ");

  const params = [
    enabled,
    update_time,
    job_id,
    warehouse_id,
  ];

  return await UpdateQuery(updateRowQuery, params);
};

export { selectAction, updateAction };
