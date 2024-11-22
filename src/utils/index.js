const { facilityPayload } = require("@/app/dashboard/streaming/constants");

export function getFormattedWarehouseInfoById(warehouseId) {
  if (!warehouseId) return "";
  return (
    warehouseId +
    ", " +
    (facilityPayload.find((warehouse) => warehouse.value == warehouseId)
      ?.label ?? "Unknown")
  );
}

export function convertJsonToSqlUpdate(json) {
  const tableName = "wip_configurations.spark_streaming_table_config";

  const { source_system_name, source_table_name, ...columns } = json;

  const whereClause = `WHERE
 source_system_name = '${source_system_name}'
 AND source_table_name = '${source_table_name}';`;

  const setClause = Object.entries(columns)
    .filter(([, value]) => value !== null)
    .map(([key, value]) => {
      if (key === "source_table_query" || typeof value === "string")
        return `   ${key} = '${value.replace(/'/g, "''")}'`;
      if (Array.isArray(value)) {
        const arrayValues = value
          .map((v) => `'${v.replace(/'/g, "''")}'`)
          .join(", ");
        return `   ${key} = [${arrayValues}]`;
      }
      return `   ${key} = ${value}`;
    })
    .join(",\n");

  const sqlUpdate = `UPDATE ${tableName}\nSET\n${setClause}\n${whereClause}`;

  return sqlUpdate;
}
