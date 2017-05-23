const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`🚫 → ${err.message}`);
})

require('./models/Transaction');
require('./models/Category');
require('./models/User');

const app = require('./app');
const server = app.listen(process.env.PORT || 1234, () => {
  console.log(`💻 → PORT ${server.address().port}`);
})
