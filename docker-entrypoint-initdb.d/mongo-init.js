// init-mongo.js

db = db.getSiblingDB(process.env.MONGO_DB)

db.createUser({
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
    roles: ["readWrite", "dbAdmin"]
});
