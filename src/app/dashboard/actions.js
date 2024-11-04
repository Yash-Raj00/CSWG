"use server";

import { revalidatePath } from "next/cache";
import {
  UpdateQuery,
  SelectQuery,
  InsertQuery,
  DeleteQuery,
  SelectWhereQuery,
} from "@/lib/common/db/pool";

const selectRowsQuery =
  "select * from wip_configurations.spark_streaming_table_config ALLOW FILTERING";

const selectRowsWhereQuery =
  "select * from wip_configurations.spark_streaming_table_config WHERE source_system_name = ? and source_table_name = ? ALLOW FILTERING";

const updateRowQuery = `UPDATE wip_configurations.spark_streaming_table_config 
  SET groupid = ?, active = ?, run_frequency_in_secs = ?, default_run_frequency_in_secs = ?, source_table_query = ? , 
  facility = ?, rest_url = ?, alert_frequency_in_secs = ?, batch_size = ?, notes = ?, updated_date = ?, target_keyspace = ?, target_table_name = ?, target_table_list = ?, source_system_dbtype = ?
  WHERE source_system_name = ? and source_table_name = ?`;

const insertRowQuery = `INSERT INTO wip_configurations.spark_streaming_table_config 
  (source_system_name, source_table_name, active, alert_frequency_in_secs, batch_size, facility, rest_url, groupid, run_frequency_in_secs, default_run_frequency_in_secs, source_system_dbtype, source_table_query, target_keyspace, target_table_list, target_table_name) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const updateLastRunTimestamp = `UPDATE wip_configurations.spark_streaming_table_config
   SET last_run_timestamp = '' WHERE source_system_name = ? and source_table_name = ? `;

const deleteRowQuery = `UPDATE wip_configurations.spark_streaming_table_config 
  SET voided_by = ?, active = ?, updated_date = ?
  WHERE source_system_name = ? and source_table_name = ?`;

const unvoidRowQuery = `UPDATE wip_configurations.spark_streaming_table_config 
  SET voided_by = ?, active = ?, updated_date = ?
  WHERE source_system_name = ? and source_table_name = ?`;

// target table that needs extra additions
const picks_by_employee_id_list = [
  "wip_warehouse_data.picks_by_employee_id",
  "wip_warehouse_data.picks_by_update_time",
  "wip_warehouse_data.picks_by_employee_id_history",
];

const rds_loads_ing_details_list = [
  "wip_rcv_ing.rds_loads_ing_details",
  "wip_rcv_hist.rds_loads_ing_details_hist",
];

const rds_unsched_bh_ing_details_list = [
  "wip_rcv_ing.rds_unsched_bh_ing_details",
  "wip_rcv_hist.rds_unsched_bh_ing_details_hist",
];

const aba_capacity_by_opsday_list = [
  "wip_shipping_ing.aba_capacity_by_opsday",
  "wip_shipping_ing.aba_capacity_by_opsday_history",
];

const employee_images_by_id_list = [
  "wip_warehouse_data.employee_images_by_id",
  "wip_warehouse_data.employee_data_by_id",
];

const attendance_plan_by_shift_list = [
  "wip_warehouse_data.attendance_plan_by_shift",
  "wip_warehouse_data.attendance_plan_by_wh_and_shift",
  "wip_warehouse_data.attendance_plan_by_wh_and_employee",
];

const aba_thruput_by_warehouse_list = [
  "wip_warehouse_data.aba_thruput_by_warehouse",
  "wip_warehouse_data_archive.aba_thruput_by_warehouse_hist",
];

const planned_thruput_by_warehouse_list = [
  "wip_warehouse_data.planned_thruput_by_warehouse",
  "wip_warehouse_data_archive.planned_thruput_by_warehouse_hist",
];

const load_loaders_by_warehouse_list = [
  "wip_shipping_ing.load_loaders_by_warehouse",
  "wip_shipping_ing.load_trans_by_loader",
];

// const load_details_by_warehouse_stream_list = [
//   "wip_shipping_ing.load_details_by_warehouse_stream",
//   "wip_shipping_ing.load_details_by_warehouse_stream_hist",
// ];

const warehouse_recv_secondpass_data_list = [
  "wip_rcv_ing.warehouse_recv_secondpass_data",
  "wip_rcv_hist.warehouse_recv_secondpass_data_hist",
];

const warehouse_lift_productivity_list = [
  "wip_lift_ing.warehouse_lift_productivity",
  "wip_lift_ing.warehouse_lift_productivity_data",
  "wip_lift_hist.warehouse_lift_productivity_data_hist",
];

const lumperlink_data_by_warehouse_list = [
  "wip_rcv_ing.lumperlink_data_by_warehouse",
  "wip_rcv_hist.lumperlink_data_by_warehouse_hist",
];

const selectAction = async (env) => {
  return await SelectQuery(selectRowsQuery, env);
};

const selectRowsWhereAction = async (env, source_system_name, source_table_name) => {
  return await SelectWhereQuery(selectRowsWhereQuery, {source_system_name, source_table_name}, env);
};

const updateLastRunAction = async (row, env) => {
  const { source_system_name, source_table_name } = row;
  const params = [source_system_name, source_table_name];
  return await UpdateQuery(updateLastRunTimestamp, params, env);
};

const updateAction = async (row, env) => {
  const {
    groupid,
    active,
    run_frequency_in_secs,
    default_run_frequency_in_secs,
    source_system_name,
    source_table_name,
    source_table_query,
    facility,
    rest_url,
    alert_frequency_in_secs,
    batch_size,
    notes,
    target_keyspace,
    target_table_name,
    source_system_dbtype,
  } = row;

  const update_time = Date.now() / 1000;

  let target_table_list;

  // inject extra table list when condition matches
  switch (target_table_name) {
    case "picks_by_employee_id":
      target_table_list = picks_by_employee_id_list;
      break;
    case "rds_loads_ing_details":
      target_table_list = rds_loads_ing_details_list;
      break;
    case "rds_unsched_bh_ing_details":
      target_table_list = rds_unsched_bh_ing_details_list;
      break;
    case "aba_capacity_by_opsday":
      target_table_list = aba_capacity_by_opsday_list;
      break;
    case "employee_images_by_id":
      target_table_list = employee_images_by_id_list;
      break;
    case "attendance_plan_by_shift":
      target_table_list = attendance_plan_by_shift_list;
      break;
    case "aba_thruput_by_warehouse":
      target_table_list = aba_thruput_by_warehouse_list;
      break;
    case "planned_thruput_by_warehouse":
      target_table_list = planned_thruput_by_warehouse_list;
      break;
    case "load_loaders_by_warehouse":
      target_table_list = load_loaders_by_warehouse_list;
      break;
    case "warehouse_recv_secondpass_data":
      target_table_list = warehouse_recv_secondpass_data_list;
      break;
    case "warehouse_lift_productivity":
      target_table_list = warehouse_lift_productivity_list;
      break;
    case "lumperlink_data_by_warehouse":
      target_table_list = lumperlink_data_by_warehouse_list;
      break;
    default:
      target_table_list = [`${target_keyspace}.${target_table_name}`];
  }

  const params = [
    groupid,
    active,
    run_frequency_in_secs,
    default_run_frequency_in_secs,
    source_table_query,
    facility,
    rest_url,
    alert_frequency_in_secs,
    batch_size,
    notes,
    update_time,
    target_keyspace,
    target_table_name,
    target_table_list,
    source_system_dbtype,
    source_system_name,
    source_table_name,
  ];

  return await UpdateQuery(updateRowQuery, params, env);
};

const insertAction = async (row, env) => {
  const {
    source_system_name,
    source_table_name,
    active,
    alert_frequency_in_secs,
    batch_size,
    facility,
    rest_url,
    groupid,
    run_frequency_in_secs,
    default_run_frequency_in_secs,
    source_system_dbtype,
    source_table_query,
    target_keyspace,
    target_table_list,
    target_table_name,
  } = row;

  const params = [
    source_system_name,
    source_table_name,
    active,
    alert_frequency_in_secs,
    batch_size,
    facility,
    rest_url,
    groupid,
    run_frequency_in_secs,
    default_run_frequency_in_secs,
    source_system_dbtype,
    source_table_query,
    target_keyspace,
    target_table_list,
    target_table_name,
  ];

  console.log("params: ", params);

  return await InsertQuery(insertRowQuery, params, env);
};

const deleteAction = async (row, env) => {
  const { source_system_name, source_table_name, updated_date } = row;

  console.log("deleteAction: ", row);

  // if voided_by is not set, it will unvoid the row

  const active = "N";
  const voided_by = "system";

  const params = [
    voided_by,
    active,
    updated_date,
    source_system_name,
    source_table_name,
  ];

  return await DeleteQuery(deleteRowQuery, params, env);
};

const unvoidAction = async (row, env) => {
  const {
    source_system_name,
    source_table_name,
    updated_date,
    voided_by,
    active,
  } = row;

  const params = [
    voided_by,
    active,
    updated_date,
    source_system_name,
    source_table_name,
  ];

  return await UpdateQuery(unvoidRowQuery, params, env);
};

export {
  selectAction,
  selectRowsWhereAction,
  updateAction,
  insertAction,
  deleteAction,
  unvoidAction,
  updateLastRunAction,
};
