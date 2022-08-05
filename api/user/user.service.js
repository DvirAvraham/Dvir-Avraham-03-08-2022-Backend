const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
  query,
  getById,
  getByUsername,
  remove,
  update,
  add,
};

async function query() {
  try {
    const collection = await dbService.getCollection('user');
    var users = await collection.find().toArray();
    users = users.map((user) => {
      delete user.password;
      return user;
    });
    return users;
  } catch (err) {
    console.error('cannot find users', err);
    throw err;
  }
}

async function getById(userId) {
  try {
    const collection = await dbService.getCollection('user');
    const user = await collection.findOne({ _id: ObjectId(userId) });
    delete user.password;
    return user;
  } catch (err) {
    console.error(`while finding user ${userId}`, err);
    throw err;
  }
}
async function getByUsername(username) {
  try {
    const collection = await dbService.getCollection('user');
    const user = await collection.findOne({ username });
    return user;
  } catch (err) {
    console.error(`while finding user ${username}`, err);
    throw err;
  }
}

async function remove(userId) {
  try {
    const collection = await dbService.getCollection('user');
    await collection.deleteOne({ _id: ObjectId(userId) });
  } catch (err) {
    console.error(`cannot remove user ${userId}`, err);
    throw err;
  }
}

async function update(user) {
  try {
    const userToSave = {
      _id: ObjectId(user._id),
      username: user.username,
      fullname: user.fullname,
      isAdmin: user.isAdmin,
      friendsIds: user.friendsIds,
      chatsIds: user.chatsIds,
      imgUrl: user.imgUrl,
      isPremium: user.isPremium,
    };
    const collection = await dbService.getCollection('user');
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave });
    return userToSave;
  } catch (err) {
    console.error(`cannot update user ${user._id}`, err);
    throw err;
  }
}

async function add(user) {
  try {
    const userToAdd = {
      username: user.username,
      password: user.password,
      fullname: user.fullname,
      friendsIds: [],
      chatsIds: [],
      isAdmin: user.isAdmin || false,
      isPremium: Math.random() > 0.5 ? true : false,
      imgUrl: '',
    };
    userToAdd.imgUrl = getRandomImg();
    const collection = await dbService.getCollection('user');
    await collection.insertOne(userToAdd);
    return userToAdd;
  } catch (err) {
    console.error('cannot insert user', err);
    throw err;
  }
}

function getRandomImg() {
  const gender = Math.random() > 0.5 ? 'women' : 'men';
  const num = getRandomInt(1, 50);
  const url = `https://randomuser.me/api/portraits/${gender}/${num}.jpg`;
  return url;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
