const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const app = express();

const corsOpts = {
    origin: '*',

    methods: [
        'GET',
        'POST',
    ],

    allowedHeaders: [
        'Content-Type',
    ],
};

app.use(cors(corsOpts));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

app.use(
    cookieSession({
        name: "ticket-session",
        keys: ["COOKIE_SECRET"], // should use as secret environment variable
        httpOnly: true
    })
);

const db = require("./models");
const {createDocument, countDocuments} = require("./dataAccess/dataAccess");

const setupDatabase = async () => {
    try {
        const dbUrl =`mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;
        await db.mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Successfully connect to MongoDB.");
    } catch (e) {
        console.log(`error`)
        console.log(e)
    }
}

setupDatabase()

// simple route
app.get("/", (req, res) => {
    res.json({message: "Welcome to ticket application."});
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

module.exports = app