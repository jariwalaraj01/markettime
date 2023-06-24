const Joi = require("joi")
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
    client_response,
} = require("../../services/common_helper");

module.exports = {
    // sign up field validation
    apiSignupValidator: (req, res, next) => {
        const JoiSchema = Joi.object({
            first_name: Joi.string().trim().alphanum().min(3).max(30).required().label('First name'),
            last_name: Joi.string().trim().alphanum().min(3).max(30).required().label('Last name'),
            location: Joi.string().trim().required(),
            department: Joi.string().trim().required(),
            email: Joi.string().email({ tlds: { allow: false } }).trim().required(),
            password: Joi.string().min(8).max(16).required(),
            confirm_password: Joi.string().required().valid(Joi.ref("password")).label("Confirm password"),
        })
        const { value, error } = JoiSchema.validate(req.body, { abortEarly: true })
        if (error?.message) {
            return client_response(res, UNPROCESSABLE_CONTENT, error.message.toString())
        }
        else {
            next()
        }
    },
    // login field validation
    apiLoginValidator: (req, res, next) => {
        const JoiSchema = Joi.object({
            email: Joi.string().email({ tlds: { allow: false } }).trim().required(),
            password: Joi.string().min(8).max(16).required(),
        })
        const { value, error } = JoiSchema.validate(req.body, { abortEarly: true })
        if (error?.message) {
            return client_response(res, UNPROCESSABLE_CONTENT, error.message.toString())
        }
        else {
            next()
        }
    },
    // verify otp field validation
    apiVerifyOTPValidator: (req, res, next) => {
        const JoiSchema = Joi.object({
            email: Joi.string().email({ tlds: { allow: false } }).trim().required(),
            otp: Joi.number().required(),
        })
        const { value, error } = JoiSchema.validate(req.body, { abortEarly: true })
        if (error?.message) {
            return client_response(res, UNPROCESSABLE_CONTENT, error.message.toString())
        }
        else {
            next()
        }
    },
}