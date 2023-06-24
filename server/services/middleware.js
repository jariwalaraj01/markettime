const {
    HTTPStatus: { UNAUTHORIZED },
    verifyToken,
    client_response
} = require("./common_helper");

module.exports = {
    // authentication middleware
    authentication: async (req, res, next) => {
        try {
            const [bearer, token] = req.headers.authorization.split(" ");
            if (!token) return client_response(res, UNAUTHORIZED, 'Access denied.')
            const decoded = await verifyToken(token)
            if (decoded.status == 1) {
                req.user = decoded;
                next();
            } else {
                return client_response(res, UNAUTHORIZED, 'Access denied.', { error: decoded.error })
            }
        } catch (error) {
            return client_response(res, UNAUTHORIZED, 'Invalid token.')
        }
    },
}