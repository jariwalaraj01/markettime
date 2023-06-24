const User = require("../../models/user");
const {
    QUERY: { find, findOne, create, findOneAndUpdate, upsert, findOneAndDelete, countDocuments },
    HTTPStatus: {
        OK_STATUS, //general successfully call api
        CREATED, // create and update time
        BAD_REQUEST, // client did not give proper values
        UNAUTHORIZED, // client have no token
        PAYMENT_REQUIRED, // payment not done for client
        FORBIDDEN, // no permission access / granted OR roles or permission
        NOT_FOUND, // finding data not in database/server
        CONFLICT, // already exist OR unique field set
        UNPROCESSABLE_CONTENT, // some parameter are missing from client 
        LOCKED, // user is blocked / disabled
        INTERNAL_SERVER_ERROR, // put on catch block
    },
    common_error_message,
    please_login_again,
    commonQuery,
    createBcryptPassword, checkBcryptPassword,
    generateToken, verifyToken,
    only_admin_access,
    client_response
} = require("../../services/common_helper");
const { sendMail } = require("../../services/nodemailer");

module.exports = {
    // signup or register api
    signupUserAPI: async (req, res, next) => {
        try {
            const {
                first_name,
                last_name,
                location,
                department,
                email,
                password,
                confirm_password
            } = req.body
            if (password != confirm_password) {
                return client_response(res, BAD_REQUEST, 'please check your confirm password')
            }
            const bcryptPassword = await createBcryptPassword(password)
            const data = {
                first_name,
                last_name,
                location,
                department,
                email,
                password: bcryptPassword.hash_password
            }
            if (bcryptPassword.status == 1) {
                const createUser = await commonQuery(User, create, data)
                if (createUser.status == 1) {
                    return client_response(res, CREATED, 'user signup successfully.')
                } else {
                    if (createUser.error.code == 11000) {
                        const field_name = Object.keys(createUser?.error?.keyValue)[0].replace("_", " ")
                        return client_response(res, CONFLICT, `This ${field_name} is already exist please change it.`)
                    } else {
                        return client_response(res, BAD_REQUEST, common_error_message)
                    }
                }
            } else {
                return client_response(res, NOT_FOUND, common_error_message)
            }
        } catch (error) {
            console.log(error);
            return client_response(res, INTERNAL_SERVER_ERROR, common_error_message)
        }
    },
    // login api
    loginUserAPI: async (req, res, next) => {
        try {
            const { email, password } = req.body
            const findOneUser = await commonQuery(User, findOne, { email: email })
            if (findOneUser.status == 1 && !findOneUser.data.is_disable) {
                const checkPassword = await checkBcryptPassword(password, findOneUser.data.password)
                if (checkPassword.status == 1) {
                    const generateOTP = Math.floor(100000 + Math.random() * 900000)
                    const { _id, email } = findOneUser.data
                    const mailResponse = await sendMail(email, generateOTP)
                    if (mailResponse.status == 1) {
                        const updateUser = await commonQuery(User, findOneAndUpdate, { _id }, { otp: generateOTP })
                        if (updateUser.status == 1) {
                            return client_response(res, OK_STATUS, 'Mail sent successfully please check your mail box.')
                        } else {
                            return client_response(res, BAD_REQUEST, common_error_message)
                        }
                    } else {
                        return client_response(res, BAD_REQUEST, common_error_message)
                    }
                } else {
                    return client_response(res, BAD_REQUEST, 'Password is wrong.')
                }
            } else {
                return client_response(res, NOT_FOUND, 'Email or password are wrong.')
            }
        } catch (error) {
            return client_response(res, INTERNAL_SERVER_ERROR, common_error_message)
        }
    },
    // check user is authenticate via OTP
    verifyOTPUserAPI: async (req, res, next) => {
        try {
            const { email, otp } = req.body
            const findOneUser = await commonQuery(User, findOne, { email: email })
            if (findOneUser.status == 1 && !findOneUser.data.is_disable) {
                if (findOneUser.data.otp === Number(otp)) {
                    const { _id, is_disable } = findOneUser.data
                    const token = await generateToken({ _id, is_disable }, '1d')
                    const updateUser = await commonQuery(User, findOneAndUpdate, { _id }, { otp: null, token: token.token })
                    if (updateUser.status == 1) {
                        return client_response(res, OK_STATUS, 'User is login successfully.', { token: token.token })
                    } else {
                        return client_response(res, BAD_REQUEST, common_error_message)
                    }
                } else {
                    return client_response(res, BAD_REQUEST, 'Please enter valid OTP.')
                }
            } else {
                return client_response(res, NOT_FOUND, 'Email or password are wrong.')
            }
        } catch (error) {
            return client_response(res, INTERNAL_SERVER_ERROR, common_error_message)
        }
    },
    // fetch user details for home page
    fetchUserAPI: async (req, res, next) => {
        try {
            const { _id, is_disable } = req.user.verify
            if (req.user.status == 1 && !is_disable) {
                selectData = '-_id -otp -password -token -is_disable -created_at -updated_at'
                const findOneUser = await commonQuery(User, findOne, { _id }, {}, selectData)
                if (findOneUser.status == 1) {
                    return client_response(res, OK_STATUS, 'User fetched successfully.', findOneUser.data)
                } else {
                    return client_response(res, BAD_REQUEST, common_error_message)
                }
            } else {
                return client_response(res, LOCKED, 'Your account is blocked. Please contact to admin.')
            }
        } catch (error) {
            return client_response(res, INTERNAL_SERVER_ERROR, common_error_message)
        }
    },
    // logout api
    logoutUserAPI: async (req, res, next) => {
        try {
            const { _id, is_disable } = req.user.verify
            if (req.user.status == 1 && !is_disable) {
                const updateUser = await commonQuery(User, findOneAndUpdate, { _id }, { token: null })
                if (updateUser.status == 1) {
                    return client_response(res, OK_STATUS, 'User logout successfully.')
                } else {
                    return client_response(res, BAD_REQUEST, common_error_message)
                }
            } else {
                return client_response(res, LOCKED, 'Your account is blocked. Please contact to admin.')
            }
        } catch (error) {
            return client_response(res, INTERNAL_SERVER_ERROR, common_error_message)
        }
    },
}