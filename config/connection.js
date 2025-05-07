const mongoose = require('mongoose');

// Remove the deprecated options and specify a database name
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aiAppointments', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})


module.exports = mongoose.connection;
