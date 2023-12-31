const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API',
            version: '1.0.0',
            description: 'API Documentation',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    description: "JWT Authorization",
                    type: "apiKey",
                    in: "header",
                    name: "x-access-token",
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/**/*.js'], // Path to the API handle folder
};
const specs = swaggerJsdoc(swaggerOptions);

module.exports = specs;
