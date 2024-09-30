import * as cassandra from "cassandra-driver";
import poolConfig, { poolProdConfig } from "./pool-config";

let client;
let isConnected = false;

const ConnectToCassandra = async (env) => {
  if (isConnected && client) {
    return true; // Skip connection
  }

  console.log(`Connecting to Cassandra... ${env}`);

  // set correct config
  const config = env === "PROD" ? poolProdConfig : poolConfig;

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

const SelectQuery = async (selectRowsQuery) => {
  try {
    await ConnectToCassandra();
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

const UpdateQuery = async (updateRowQuery, params) => {
  try {
    await ConnectToCassandra();
    await client.execute(updateRowQuery, params, { prepare: true });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const InsertQuery = async (insertRowQuery, params) => {
  try {
    await ConnectToCassandra();
    await client.execute(insertRowQuery, params, { prepare: true });
    console.log("Insert successful");
    return true;
  } catch (error) {
    console.error("Insert query error", error);
    return false;
  }
};

const DeleteQuery = async (deleteRowsQuery, params) => {
  try {
    await ConnectToCassandra();
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
