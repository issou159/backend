const express = require('express');
const router = express.Router();
const findRouter= require('./find')
const createRouter = require('./create');
const updateRouter = require('./update');
const deleteRouter = require('./delete');
const {Register} = require("../controllers/Users.controllers");

router.use('/',findRouter);
router.use('/', createRouter);
router.use('/', updateRouter);
router.use('/', deleteRouter);
router.post('/register',Register)

module.exports = router;