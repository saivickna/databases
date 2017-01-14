var Sequelize = require('sequelize');
var db = new Sequelize('chatter', 'root', '');
/* TODO this constructor takes the database name, username, then password.
 * Modify the arguments if you need to */

/* first define the data structure by giving property names and datatypes
 * See http://sequelizejs.com for other datatypes you can use besides STRING. */
var User = db.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  user: Sequelize.STRING
});

var Room = db.define('rooms', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  room: Sequelize.STRING
});

var Message = db.define('messages', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  message: Sequelize.STRING
});

Message.belongsTo(User, {as: 'user'});
Message.belongsTo(Room, {as: 'room'});

module.exports = {
  messages: {
    get: function () {
      return Message.findAll({attributes: ['user', 'room', 'message'], include: [User, Room]});
      //db.query('select u.user, r.room, m.message from messages m inner join users u on (m.userID = u.id) inner join rooms r on (m.roomID = r.ID)', [], callback);
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
    get: function () {
      return User.findAll({attributes: ['user']});
      //db.query('select user from users', callback);

    },
    post: function (user, callback) {
      User.findAll({attributes: ['user'], where: {user: user}})
      .then(users => {
        
      });
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
    get: function () {
      return Room.findAll({attributes: ['room']});
      //db.query('select room from rooms', callback);

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

