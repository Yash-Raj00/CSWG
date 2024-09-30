import * as cassandra from "cassandra-driver";
import poolConfig, { poolProdConfig } from "./pool-config";

let client;
let isConnected = false;
let currEnv;

const ConnectToCassandra = async (env) => {
  // if (isConnected && client) {
  //   console.log("eennvv", env, "\n client-", client.options.localDataCenter);
  //   return true; // Skip connection
  // }

  currEnv = env.toLocaleUpperCase();
  console.log(`Connecting to Cassandra... ${currEnv}`);

  // set correct config
  // console.log("env--", env);
  const config = currEnv === "UAT" ? poolConfig : poolProdConfig;

  try {
    client = new cassandra.Client({
      contactPoints: [config.pointOne, config.pointTwo],
      localDataCenter: config.dc,
      keyspace: config.keyspace,
      credentials: { username: config.user, password: config.password },
    });
    await client.connect(); // Ensure the client is connected
    isConnected = true;
    console.log("Cassandra connection successful");
    return true;
  } catch (error) {
    console.error("Cassandra connection error", error);
    isConnected = false;
    return false;
  }
};

const CloseCassandraConnection = async () => {
  if (client && isConnected) {
    try {
      await client.shutdown();
      isConnected = false;
      console.log("Cassandra connection closed");
    } catch (error) {
      console.error("Error closing Cassandra connection", error);
    }
  }
};

const SelectQuery = async (selectRowsQuery, env) => {
  try {
    // await ConnectToCassandra(env.toLocaleUpperCase());
    await ConnectToCassandra(env || currEnv);
    const result = await client.execute(selectRowsQuery, [], { prepare: true });
    // console.log("🚀 ~ SelectQuery ~ result:", result);

    if (!result) {
      return [];
    }

    return JSON.parse(JSON.stringify(result.rows));
  } catch (error) {
    console.error(JSON.stringify(error));
    return [];
  }
};

const UpdateQuery = async (updateRowQuery, params, env) => {
  try {
    await ConnectToCassandra(env || currEnv);
    await client.execute(updateRowQuery, params, { prepare: true });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const InsertQuery = async (insertRowQuery, params, env) => {
  try {
    await ConnectToCassandra(env || currEnv);
    await client.execute(insertRowQuery, params, { prepare: true });
    console.log("Insert successful");
    return true;
  } catch (error) {
    console.error("Insert query error", error);
    return false;
  }
};

const DeleteQuery = async (deleteRowsQuery, params, env) => {
  try {
    await ConnectToCassandra(env || currEnv);
    await client.execute(deleteRowsQuery, params, { prepare: true });
    console.log("delete successful");
    return true;
  } catch (error) {
    console.error("delete query error", error);
    return false;
  }
};

export {
  ConnectToCassandra,
  SelectQuery,
  UpdateQuery,
  InsertQuery,
  DeleteQuery,
  CloseCassandraConnection,
};
