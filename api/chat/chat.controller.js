const chatService = require('./chat.service');

module.exports = {
  getChatById,
  updateChat,
};

async function getChatById(req, res) {
  try {
    const { id } = req.params;
    const chat = await chatService.getById(id);
    res.send(chat);
  } catch (err) {
    console.error('Failed to get chat', err);
    res.status(500).send({ err: 'Failed to get chat' });
  }
}

async function updateChat(req, res) {
  try {
    const { id } = req.params;
    const msg = req.body;
    const chatToSave = await chatService.getById(id);
    chatToSave.msgs.push(msg);
    await chatService.update(chatToSave);
    res.send(chatToSave);
  } catch (err) {
    console.error('Failed to update chat', err);
    res.status(500).send({ err: 'Failed to update chat' });
  }
}
