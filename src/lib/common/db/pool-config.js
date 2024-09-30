const poolConfig = {
  user: process.env.CASSANDRA_USERNAME,
  password: process.env.CASSANDRA_PASSWORD,
  keyspace: process.env.CASSANDRA_KEYSPACE,
  dc: process.env.CASSANDRA_DC,
  pointOne: process.env.CASSANDRA_POINT_1,
  pointTwo: process.env.CASSANDRA_POINT_2,
};

export const poolProdConfig = {
  user: process.env.CASSANDRA_PROD_USERNAME,
  password: process.env.CASSANDRA_PROD_PASSWORD,
  keyspace: process.env.CASSANDRA_PROD_KEYSPACE,
  dc: process.env.CASSANDRA_PROD_DC,
  pointOne: process.env.CASSANDRA_PROD_POINT_1,
  pointTwo: process.env.CASSANDRA_PROD_POINT_2,
};

// console.log("process.env", process.env);

export default poolConfig;
