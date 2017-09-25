const mongoose = require('mongoose');

require('dotenv').config({ path: './variables.env' });

mongoose.connect(process.env.DATABASE, { useMongoClient: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`🚫 → ${err.message}`);
})

require('./server/models/Transaction');
require('./server/models/Category');
require('./server/models/User');

const app = require('./server/app');
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
  console.log(`💻 → PORT ${server.address().port}`);
})
