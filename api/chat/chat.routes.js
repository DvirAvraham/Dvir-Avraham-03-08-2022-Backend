const express = require('express');
const { getChatById, updateChat } = require('./chat.controller');

const router = express.Router();

router.get('/:id', getChatById);
router.put('/:id', updateChat);

module.exports = router;
