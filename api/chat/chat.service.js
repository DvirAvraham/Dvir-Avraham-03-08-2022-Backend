const dbService = require('../../services/db.service');
const utilService = require('../../services/util.service');

module.exports = {
  getById,
  update,
  createChat,
};

async function createChat(members) {
  try {
    const chatToAdd = {
      members,
      msgs: [],
      _id: utilService.makeId(),
    };
    const collection = await dbService.getCollection('chat');
    await collection.insertOne(chatToAdd);
    return chatToAdd;
  } catch (err) {
    console.error(`while finding chat ${chatId}`, err);
    throw err;
  }
}
async function getById(chatId) {
  try {
    const collection = await dbService.getCollection('chat');
    const chat = await collection.findOne({ _id: chatId });
    return chat;
  } catch (err) {
    console.error(`while finding chat ${chatId}`, err);
    throw err;
  }
}

async function update(chat) {
  try {
    const chatToSave = {
      _id: chat._id,
      members: chat.members,
      msgs: chat.msgs,
      createdBy: chat.createdBy,
    };
    const collection = await dbService.getCollection('chat');
    await collection.updateOne({ _id: chatToSave._id }, { $set: chatToSave });
    return chatToSave;
  } catch (err) {
    console.error(`cannot update chat ${chat._id}`, err);
    throw err;
  }
}
