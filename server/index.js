const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes");

const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Answer API requests.
  app.get('/api', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the custom server!"}');
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  // Set up promises with mongoose
  mongoose.Promise = global.Promise;
  // Connect to the Mongo DB
  mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost/nytdb",
    {
      useMongoClient: true
    }
  );

  // Configure body parser for AJAX requests
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  // Serve up static assets
  app.use(express.static("react-ui/build"));
  // Add routes, both API and view
  app.use(routes);

  app.listen(PORT, function () {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });
}
