const { facilityPayload } = require("@/app/dashboard/streaming/constants");

export function getWarehouseDetails(warehouseId) {
  if (!warehouseId) return "";
  return (
    warehouseId +
    ", " +
    (facilityPayload.find((warehouse) => warehouse.value == warehouseId)
      ?.label ?? "Unknown")
  );
}
