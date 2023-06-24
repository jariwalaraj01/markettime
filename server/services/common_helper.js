// import files and modules
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

// all query operations 
const QUERY = {
    find: "find",
    findOne: "findOne",
    create: "create",
    findOneAndUpdate: "findOneAndUpdate",
    upsert: "upsert",
    findOneAndDelete: "findOneAndDelete",
    countDocuments: "countDocuments"
}

// status code for response to client
const HTTPStatus = {
    OK_STATUS: 200, // general success fully call api
    CREATED: 201,  // create and update time
    BAD_REQUEST: 400, // client did not give proper values
    UNAUTHORIZED: 401, // client have no token
    PAYMENT_REQUIRED: 402, // payment not done for client
    FORBIDDEN: 403, // no permission access / granted OR roles or permission
    NOT_FOUND: 404, // finding data not in database/server
    CONFLICT: 409, // already exist OR unique field set
    UNPROCESSABLE_CONTENT: 422, // some parameter are missing from client 
    LOCKED: 423, // user is blocked / disabled
    INTERNAL_SERVER_ERROR: 500, // put on catch block
}

// send response to client function
const client_response = (res, statusCode, message, data = {}) => {
    let responseData = {
        code: statusCode,
        message: message,
    }
    if (Object.keys(data)?.length) responseData.data = data
    return res.status(statusCode).json(responseData);
};

const { find, findOne, create, findOneAndUpdate, upsert, findOneAndDelete, countDocuments, } = QUERY
const common_error_message = "Some thing went wrong."
const please_login_again = "Please login again."
const only_admin_access = "Only admin can access this."

module.exports = {
    QUERY,
    HTTPStatus,
    common_error_message,
    please_login_again,
    only_admin_access,
    client_response,
    // all in one function for all query
    commonQuery: async (model, query, data = {}, update = {}, select = "", populate = null, perPage = 0, page = 0) => {
        try {
            const skip = perPage * (page - 1)
            let res;
            switch (query) {
                case find:
                    res = await model.find(data).sort(update).limit(perPage).skip(skip).select(select).populate(populate).setOptions({ allowDiskUse: true }).lean();
                    break;
                case findOne:
                    res = await model.findOne(data).select(select).populate(populate).lean();
                    break;
                case create:
                    res = await model.create(data)
                    break;
                case findOneAndUpdate:
                    res = await model.findOneAndUpdate(data, update, { returnOriginal: false }).select(select).lean();
                    break;
                case upsert:
                    res = await model.findOneAndUpdate(data, update, { upsert: true, new: true }).lean();
                    break;
                case findOneAndDelete:
                    res = await model.findOneAndDelete(data).lean();
                    break;
                case countDocuments:
                    res = await model.countDocuments(data).lean();
                    break;
            }
            if (!data || !res || res.length == 0) {
                return {
                    status: 2,
                    message: common_error_message
                }
            } else {
                return {
                    status: 1,
                    data: res
                }
            }
        } catch (error) {
            return {
                status: 0,
                error: error
            }
        }
    },
    // generate bcrypt password
    createBcryptPassword: async password => {
        try {
            let hash_password = await bcrypt.hash(password, 4)
            return {
                status: 1,
                hash_password: hash_password
            }
        } catch (error) {
            console.log(error);
            return {
                status: 0,
                error: common_error_message
            }
        }
    },
    // check bcrypt password
    checkBcryptPassword: async (password, savedPassword) => {
        try {
            let is_match = await bcrypt.compare(password, savedPassword)
            if (!is_match) {
                return {
                    status: 0,
                    message: "Password do not match."
                }
            } else {
                return {
                    status: 1,
                    message: "Password Matched"
                }
            }
        } catch (error) {
            return {
                status: 0,
                error: common_error_message
            }
        }
    },
    // generate token for client to access api
    generateToken: async (data, expire = null) => {
        try {
            let optionalData = {}
            if (expire) {
                optionalData = { expiresIn: expire }
            }
            const token = await jwt.sign(data, process.env.SECRET_PRIVATE_KEY, optionalData);
            return {
                status: 1,
                token: token
            }
        } catch (error) {
            return {
                status: 0,
                error: common_error_message
            }
        }
    },
    // client is authenticate or not 
    verifyToken: async token => {
        try {
            const verify = await jwt.verify(token, process.env.SECRET_PRIVATE_KEY);
            return {
                status: 1,
                verify: verify
            }
        } catch (error) {
            return {
                status: 0,
                error: error.message
            }
        }
    }
}