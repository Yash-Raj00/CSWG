"use server";

import { revalidatePath } from "next/cache";
import { ConnectToCassandra, SelectQuery } from "@/lib/common/db/pool";

const selectAction = async (env) => {
  const selectShippingJobRowsQuery = `select * from wip_configurations.spark_streaming_orsyp_run_log LIMIT 500`;
  const data = await SelectQuery(selectShippingJobRowsQuery, env);
  const orderedData = data.sort(
    (a, b) => new Date(b.created_date) - new Date(a.created_date)
  );

  return orderedData;
};

export { selectAction, ConnectToCassandra };
