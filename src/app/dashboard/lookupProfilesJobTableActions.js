"use server";

import { SelectQuery, UpdateQuery } from "@/lib/common/db/pool";

const selectLookupProfileJobRowsQuery =
  "select * from wip_configurations.lookup_profiles_config";

const updateRowQuery = `UPDATE wip_configurations.lookup_profiles_config 
  SET profile_value = ?, lookup_description = ?, level_value_meaning = ?, last_update_date = ?, last_updated_by = ?
  WHERE lookup_code = ? and level_code = ? and level_value = ?`;

const selectAction = async (env) => {
  return await SelectQuery(selectLookupProfileJobRowsQuery, env);
};

const updateAction = async (row, env) => {
  const {
    profile_value,
    lookup_description,
    level_value_meaning,
    last_updated_by,
    lookup_code,
    level_code,
    level_value,
  } = row;

  const last_update_date = new Date().toISOString();

  const params = [
    profile_value,
    lookup_description,
    level_value_meaning,
    last_update_date,
    last_updated_by,
    lookup_code,
    level_code,
    level_value,
  ];

  console.log("parara", params);

  return await UpdateQuery(updateRowQuery, params, env);
};

export { selectAction, updateAction };
