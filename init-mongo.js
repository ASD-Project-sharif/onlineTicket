// init-mongo.js

db.createUser({
    user: "ticket-admin",
    pwd: "ticket-admin",
    roles: [ "readWrite", "dbAdmin" ]
});
