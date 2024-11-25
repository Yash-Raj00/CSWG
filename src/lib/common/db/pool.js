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

  let clientConfig = currEnv === "UAT" ? poolConfig : poolProdConfig;
  try {
    let client = new cassandra.Client({
      contactPoints: [clientConfig.pointOne, clientConfig.pointTwo],
      localDataCenter: clientConfig.dc,
      keyspace: clientConfig.keyspace,
      credentials: {
        username: clientConfig.user,
        password: clientConfig.password,
      },
    });
    await client.connect(); // Ensure the client is connected
    console.log(
      "Cassandra connection successful " + client.options.localDataCenter
    );
    if (currEnv === "UAT") {
      isConnectedUat = true;
      clientUat = client;
      return clientUat;
    } else {
      isConnectedProd = true;
      clientProd = client;
      return clientProd;
    }
  } catch (error) {
    console.error("Cassandra connection error", error);
    currEnv === "UAT" ? (isConnectedUat = false) : (isConnectedProd = false);
    return false;
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
    return false;
  }
};

const SelectWhereQuery = async (selectRowsQuery, params, env) => {
  try {
    const client = await ConnectToCassandra(env);
    let result;
    result = await client.execute(selectRowsQuery, params, {
      prepare: true,
    });

    if (!result) {
      return [];
    }

    return JSON.parse(JSON.stringify(result.rows));
  } catch (error) {
    console.error(JSON.stringify(error));
    return false;
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
  SelectWhereQuery,
  UpdateQuery,
  InsertQuery,
  DeleteQuery,
  CloseCassandraConnection,
};
