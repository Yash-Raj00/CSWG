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
