var express = require('express');
const { signupUserAPI, loginUserAPI, verifyOTPUserAPI, fetchUserAPI, logoutUserAPI } = require('../../../controllers/api/user');
const { authentication } = require('../../../services/middleware');
const { apiSignupValidator, apiLoginValidator, apiVerifyOTPValidator } = require('../../../validators/api/user');
var router = express.Router();

router.post('/signup', apiSignupValidator, signupUserAPI)
router.post('/login', apiLoginValidator, loginUserAPI)
router.post('/verify-otp', apiVerifyOTPValidator, verifyOTPUserAPI)
router.get('/', authentication, fetchUserAPI)
router.get('/logout', authentication, logoutUserAPI)



module.exports = router;
