var db = require('../db/index');
db.connect();

module.exports = {
  messages: {
    get: function (callback) {

      db.query('select u.user, r.room, m.message from messages m inner join users u on (m.userID = u.id) inner join rooms r on (m.roomID = r.ID)', [], callback);
      //db.query('SELECT * FROM rooms', [], callback);
    }, // a function which produces all the messages
    post: function (message, callback) {
      module.exports.users.post(message.username, (err, userID) => {
        module.exports.rooms.post(message.roomname, (err, roomID) => {
          db.query('insert into messages (message, userID, roomID) values ("' + message.message + '",' + userID + ',' + roomID + ')', callback);

        });
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (callback) {

      db.query('select user from users', callback);

    },
    post: function (user, callback) {
      db.query('select id from users where user = "' + user + '"', (err, results) => {
        if (results.length === 0) {
          db.query('insert into users (user) values ("' + user + '")', () => {        
            module.exports.users.post(user, callback);
          });
        } else {
          callback(null, results[0].id);
        }
      });
    }
  },

  rooms: {
    // Ditto as above.
    get: function (callback) {

      db.query('select room from rooms', callback);

    },
    post: function (room, callback) {
      db.query('select id from rooms where room = "' + room + '"', (err, results) => {
        if (results.length === 0) {
          db.query('insert into rooms (room) values ("' + room + '")', () => {
            module.exports.rooms.post(room, callback);
          });
        } else {
          callback(null, results[0].id);
        }
      });


    }
  }
};

