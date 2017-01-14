var models = require('../models/index');

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'content-type': 'text/plain'
};

module.exports = {
  messages: {
    get: function (req, res) {
      //res.writeHead(200, headers);
      models.messages.get((err, results) => {
        if (err) {
          throw err;
        }
        headers['Content-Length'] = Buffer.byteLength(JSON.stringify(results));
        res.set(headers);
        res.send(JSON.stringify(results));
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      res.writeHead(201, headers);
      models.messages.post(req.body, (err, results) => {
        if (err) {
          throw err;
        }
        res.end();
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      res.writeHead(200, headers);
      models.users.get((err, results) => {
        if (err) {
          throw err;
        }
        res.send(JSON.stringify(results));
      });
    },
    post: function (req, res) {
      res.writeHead(201, headers);
      models.users.post(req.body.username, (err, results) => {
        if (err) {
          throw err;
        }
        res.end();
        //res.send('');
      });

    }
  },

  rooms: {
    // Ditto as above
    get: function (req, res) {
      res.writeHead(200, headers);
      models.rooms.get((err, results) => {
        if (err) {
          throw err;
        }
        res.send(JSON.stringify(results));
      });
    },
    post: function (req, res) {
      res.writeHead(201, headers);

      models.rooms.post(req.body.roomname, (err, results) => {
        if (err) {
          throw err;
        }
        res.end();
      });
    }
  }
};

