var express = require('express');
var router = express.Router();
const userRoutes = require("./subRoutes/user")

// user rest apis
router.use('/user', userRoutes);

module.exports = router;
