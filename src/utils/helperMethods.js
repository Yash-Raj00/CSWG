const { facilityPayload } = require("@/app/dashboard/streaming/constants");

export const getWarehouseName = (warehouseId) => {
  return (
    facilityPayload.find((val) => val.value == warehouseId)?.label ?? "Unknown"
  );
};
