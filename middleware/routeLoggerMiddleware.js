const fs = require("fs");
const path = require("path");
const morgan = require("morgan");

const logsFolderPath = path.join(__dirname, "../routeLogs");

// Create the route logger middleware
const routeLoggerMiddleware = (route) => {
  const accessLogStream = fs.createWriteStream(
    path.join(logsFolderPath, `${route}.log`),
    { flags: "a" }
  );
  return morgan(
    ":method :url :status :response-time ms - :res[content-length]",
    {
      stream: accessLogStream,
    }
  );
};

module.exports = routeLoggerMiddleware;
