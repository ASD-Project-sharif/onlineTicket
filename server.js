const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const dbConfig = require("./config/db.config.js");

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

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
const Role = db.role;

const setup = async () => {
    try {
        await db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Successfully connect to MongoDB.");
        initial();
    } catch (e) {
        console.log(`error`)
        console.log(e)
    }
}

setup()

async function initial() {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
        const user = new Role({
            name: "user"
        })
        await user.save();

        const agent = new Role({
            name: "agent"
        });
        await agent.save();

        const admin = new Role({
            name: "admin"
        });
        await admin.save();
    }
}

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