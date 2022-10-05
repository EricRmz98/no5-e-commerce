const { app } = require('./app');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// Utils
const { initModels } = require('./models/initModels');
const { db } = require('./utils/database.util');

const startServer = async () => {
    try {
        await db.authenticate();

        // Establish the relations between models
        initModels();

        await db.sync();

        // Set server to listen
        const PORT = process.env.PORT || 4000;

        app.listen(PORT, () => {
            console.log('Express app running!', PORT);
        });
    } catch (error) {
        console.log(error);
    }
};

startServer();
