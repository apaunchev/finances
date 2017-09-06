const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DATABASE, { useMongoClient: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`🚫 → ${err.message}`);
})

require('./models/Transaction');
require('./models/Category');
require('./models/User');

const app = require('./app');
app.set('port', process.env.PORT || 1234);
const server = app.listen(app.get('port'), () => {
  console.log(`💻 → PORT ${server.address().port}`);
})
