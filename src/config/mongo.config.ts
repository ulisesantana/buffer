export default  {
  hostArray: process.env.MONGO_HOSTS || 'localhost:27017',  // DB server IP/name
  db: 'buffer',                                             // Database schema
  authDb: process.env.MONGO_AUTHDB || 'admin',              // Authentication database
  auth: 'SCRAM-SHA-1',                                      // Authentication mechanism
  user: process.env.MONGO_USER || 'dev',                    // Database username
  pass: process.env.MONGO_PASS || 'dev',                    // Authentication password
  replicaSet: process.env.MONGO_REPLICASET || '',           // Replica Set name
  collections: {
    messages: 'messages'
  }
};