const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const route = express.Router();
const passport = require('../../module/passport/index');
const userModel = require('./user.model');




module.exports = route;
