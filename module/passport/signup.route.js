const express = require('express');
const bcrypt = require('bcryptjs')
const route = express.Router();
const userService = require('../../components/user/user.service');
const { use } = require('passport');
route.post('/', async function (req, res, next) {
    console.log(req);

    await userService.createUser(req.body);
    res.json('success');
})
module.exports = route;