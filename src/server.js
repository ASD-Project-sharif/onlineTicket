const express = require('express');
const cors = require('cors');
const sanitizeUserInput = require('./middlewares/xss.middleware');
const errorHandler = require('./middlewares/errors.middleware');
const specs = require('./middlewares/swagger.middleware');
const swaggerUi = require('swagger-ui-express');
const app = express();
const db = require('./models');

const setupDatabase = async () => {
  try {
    const dbLogin = `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}`;
    const dbUrl = `${dbLogin}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;
    await db.mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Successfully connect to MongoDB.');
  } catch (e) {
    console.log(`error`);
    console.log(e);
  }
};

/**
 * @param {Object} app
 */
function setupUses(app) {
  app.use(express.json());
  app.use(sanitizeUserInput);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  app.use(express.urlencoded({extended: true}));

  const corsOpts = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-access-token'],
  };

  app.use(cors(corsOpts));
  app.use(errorHandler);
}

/**
 * @param {Object} app
 */
function setupRoutes(app) {
  app.get('/', (req, res) => {
    res.json({message: 'Welcome to ticket application.'});
  });
  require('./routes/auth.routes')(app);
  require('./routes/ticket.routes')(app);
  require('./routes/information.routes')(app);
  require('./routes/comment.routes')(app);
  require('./routes/product.routes')(app);
  require('./routes/agent.routes')(app);
}

setupDatabase();
setupUses(app);
setupRoutes(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
