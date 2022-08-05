const chatService = require('../api/chat/chat.service');
const userService = require('../api/user/user.service');
let gIo = null;

function connectSockets(http, session) {
  gIo = require('socket.io')(http, {
    cors: {
      origin: '*',
    },
  });
  gIo.on('connection', (socket) => {
    socket.on('notify-toggle-friends', async ({ to, from, msg }) => {
      if (!from.chatsIds.some((id) => to.chatsIds.includes(id))) {
        const chat = await chatService.createChat([
          { _id: to._id, fullname: to.fullname, imgUrl: to.imgUrl },
          { _id: from._id, fullname: from.fullname, imgUrl: from.imgUrl },
        ]);
        to.chatsIds.push(chat._id);
        from.chatsIds.push(chat._id);
        await userService.update(to);
        await userService.update(from);
      }
      emitToUser('toggeled-friends', { msg, friend: from }, to._id);
      emitToUser('load-user', '', from._id);
    });

    socket.on('add-msg', ({ msg, to, chat }) => {
      emitToUser('msg-notify', { chat, msg }, to._id);
    });

    socket.on('sign-up', ({ userId }) => {
      broadcast('load-users', '', userId);
    });

    socket.on('set-user-socket', (userId) => {
      socket.userId = userId;
    });
    socket.on('unset-user-socket', () => {
      delete socket.userId;
    });
  });
}

async function emitToUser(type, data, userId) {
  const socket = await _getUserSocket(userId);
  if (socket) socket.emit(type, data);
}
async function broadcast(type, data, userId) {
  const excludedSocket = await _getUserSocket(userId);
  if (!excludedSocket) return;
  excludedSocket.broadcast.emit(type, data);
}

async function _getUserSocket(userId) {
  const sockets = await _getAllSockets();
  const socket = sockets.find((s) => s.userId == userId);
  return socket;
}
async function _getAllSockets() {
  const sockets = await gIo.fetchSockets();
  return sockets;
}

module.exports = {
  connectSockets,
  emitToUser,
  broadcast,
};
