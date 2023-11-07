const backendConfig = require('./config/backend.config.json');
const dbService = require('./services/database.service.js');
const userRoutes = require('./routes/users.route.js');
const entryRoutes = require('./routes/entries.route.js');
const loggerService = require('./services/logging.service.js')
const express = require('express');
const cors = require('cors')

const app = express();
app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/entries', entryRoutes);
dbService.initialize().then(() => {
    const listener = app.listen(process.env.PORT || backendConfig.port, () => {
        loggerService.logInfo('The app is listening on port ' + listener.address().port);
    });
}, (error) => {
    throw error;
});