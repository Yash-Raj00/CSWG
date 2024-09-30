"use server";

import { revalidatePath } from "next/cache";
import {
  ConnectToCassandra,
  UpdateQuery,
  SelectQuery,
  InsertQuery,
  DeleteQuery,
} from "@/lib/common/db/pool";

const selectRowsQuery =
  "select * from wip_configurations.spark_streaming_table_config ALLOW FILTERING";

const updateRowQuery = `UPDATE wip_configurations.spark_streaming_table_config 
  SET groupid = ?, active = ?, run_frequency_in_secs = ?, default_run_frequency_in_secs = ?, source_table_query = ? , 
  facility = ?, alert_frequency_in_secs = ?, batch_size = ?, notes = ?, updated_date = ?, target_keyspace = ?, target_table_name = ?, target_table_list = ?
  WHERE source_system_name = ? and source_table_name = ?`;

const insertRowQuery = `INSERT INTO wip_configurations.spark_streaming_table_config 
  (source_system_name, source_table_name, active, alert_frequency_in_secs, batch_size, facility, groupid, run_frequency_in_secs, default_run_frequency_in_secs, source_system_dbtype, source_table_query, target_keyspace, target_table_list, target_table_name) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const updateLastRunTimestamp = `UPDATE wip_configurations.spark_streaming_table_config
   SET last_run_timestamp = '' WHERE source_system_name = ? and source_table_name = ? `;

const deleteRowQuery = `UPDATE wip_configurations.spark_streaming_table_config 
  SET voided_by = ?, active = ?, updated_date = ?
  WHERE source_system_name = ? and source_table_name = ?`;

const selectAction = async () => {
  return await SelectQuery(selectRowsQuery);
};

const updateLastRunAction = async (row) => {
  const { source_system_name, source_table_name } = row;
  const params = [source_system_name, source_table_name];
  return await UpdateQuery(updateLastRunTimestamp, params);
};

const updateAction = async (row) => {
  const {
    groupid,
    active,
    run_frequency_in_secs,
    default_run_frequency_in_secs,
    source_system_name,
    source_table_name,
    source_table_query,
    facility,
    alert_frequency_in_secs,
    batch_size,
    notes,
    target_keyspace,
    target_table_name,
  } = row;

  const update_time = Date.now() / 1000;

  const target_table_list = [`${target_keyspace}.${target_table_name}`];

  const params = [
    groupid,
    active,
    run_frequency_in_secs,
    default_run_frequency_in_secs,
    source_table_query,
    facility,
    alert_frequency_in_secs,
    batch_size,
    notes,
    update_time,
    target_keyspace,
    target_table_name,
    target_table_list,
    source_system_name,
    source_table_name,
  ];

  return await UpdateQuery(updateRowQuery, params);
};

const insertAction = async (row) => {
  const {
    source_system_name,
    source_table_name,
    active,
    alert_frequency_in_secs,
    batch_size,
    facility,
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

  return await InsertQuery(insertRowQuery, params);
};

const deleteAction = async (row) => {
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

  return await DeleteQuery(deleteRowQuery, params);
};

export {
  selectAction,
  updateAction,
  insertAction,
  deleteAction,
  updateLastRunAction,
  ConnectToCassandra,
};
