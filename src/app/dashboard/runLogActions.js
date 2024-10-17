"use server";

import { revalidatePath } from "next/cache";
import { SelectQuery } from "@/lib/common/db/pool";

const selectAction = async (env) => {
  const selectShippingJobRowsQueryAllTime = `select * from wip_configurations.spark_streaming_orsyp_run_log LIMIT 500`;
  const selectShippingJobRowsQueryToday = `SELECT * FROM wip_configurations.spark_streaming_orsyp_run_log 
  WHERE created_date >= toTimestamp(toDate(now()))
  LIMIT 500
  ALLOW FILTERING`;
  const data = await SelectQuery(selectShippingJobRowsQueryToday, env);
  const orderedData = data.sort(
    (a, b) => b.created_date.localeCompare(a.created_date)
  );

  return orderedData;
};

export { selectAction };
