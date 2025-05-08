const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create a log directory if it doesn't exist
const logDirectory = path.join(__dirname, '../logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, 'access.log'), 
  { flags: 'a' }
);

// Different logging formats based on environment
const developmentLogger = morgan('dev');
const productionLogger = morgan('combined', { stream: accessLogStream });

// Export the appropriate logger based on environment
const logger = process.env.NODE_ENV === 'production' 
  ? productionLogger 
  : developmentLogger;

module.exports = logger;