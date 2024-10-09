import * as cassandra from "cassandra-driver";
import poolConfig, { poolProdConfig } from "./pool-config";

let clientUat;
let clientProd;
let isConnectedUat = false;
let isConnectedProd = false;

const ConnectToCassandra = async (env) => {
  let currEnv = env.toLocaleUpperCase();

  // set correct config
  if (currEnv === "UAT" && isConnectedUat) {
    console.log("Connection exists for UAT");
    return clientUat; // Skip connection for UAT
  }
  if (currEnv === "PROD" && isConnectedProd) {
    console.log("Connection exists for PROD");
    return clientProd; // Skip connection for PROD
  }

  console.log(`Connecting to Cassandra... ${currEnv}`);

  if (currEnv === "UAT") {
    try {
      clientUat = new cassandra.Client({
        contactPoints: [poolConfig.pointOne, poolConfig.pointTwo],
        localDataCenter: poolConfig.dc,
        keyspace: poolConfig.keyspace,
        credentials: {
          username: poolConfig.user,
          password: poolConfig.password,
        },
      });
      await clientUat.connect(); // Ensure the client is connected
      isConnectedUat = true;
      console.log(
        "Cassandra connection successful " + clientUat.options.localDataCenter
      );
      return clientUat;
    } catch (error) {
      console.error("Cassandra connection error", error);
      isConnectedUat = false;
      return false;
    }
  } else if (currEnv === "PROD") {
    try {
      clientProd = new cassandra.Client({
        contactPoints: [poolProdConfig.pointOne, poolProdConfig.pointTwo],
        localDataCenter: poolProdConfig.dc,
        keyspace: poolProdConfig.keyspace,
        credentials: {
          username: poolProdConfig.user,
          password: poolProdConfig.password,
        },
      });
      await clientProd.connect(); // Ensure the client is connected
      isConnectedProd = true;
      console.log(
        "Cassandra connection successful " + clientProd.options.localDataCenter
      );
      return clientProd;
    } catch (error) {
      console.error("Cassandra connection error", error);
      isConnectedProd = false;
      return false;
    }
  }
};

const CloseCassandraConnection = async () => {
  if (clientUat && isConnectedUat) {
    try {
      await clientUat.shutdown();
      isConnectedUat = false;
      console.log("Cassandra connection closed for UAT");
    } catch (error) {
      console.error("Error closing Cassandra connection for UAT", error);
    }
  }
  if (clientProd && isConnectedProd) {
    try {
      await clientProd.shutdown();
      isConnectedProd = false;
      console.log("Cassandra connection closed for PROD");
    } catch (error) {
      console.error("Error closing Cassandra connection for PROD", error);
    }
  }
};

const SelectQuery = async (selectRowsQuery, env) => {
  try {
    const client = await ConnectToCassandra(env);
    let result;
    result = await client.execute(selectRowsQuery, [], {
      prepare: true,
    });
    // console.log("SelectQuery ~ result:", selectRowsQuery, result.rows);

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
    const client = await ConnectToCassandra(env);
    await client.execute(updateRowQuery, params, { prepare: true });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const InsertQuery = async (insertRowQuery, params, env) => {
  try {
    const client = await ConnectToCassandra(env);
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
    const client = await ConnectToCassandra(env);
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
