import Joi from "joi"

// sign up field validation
export const apiLoginValidator = (values) => {
    const JoiSchema = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).trim().required(),
        password: Joi.string().min(8).max(16).required(),
    })
    // eslint-disable-next-line 
    const { value, error } = JoiSchema.validate(values, { abortEarly: true })

    if (error?.message) {
        return {
            status: 0,
            message: error.message.toString()
        }
    } else {
        return { status: 1 }
    }
}
// login field validation
export const apiVerifyOTPValidator = (values) => {
    const JoiSchema = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).trim().required(),
        otp: Joi.number().required(),
    })
    // eslint-disable-next-line 
    const { value, error } = JoiSchema.validate(values, { abortEarly: true })

    if (error?.message) {
        return {
            status: 0,
            message: error.message.toString()
        }
    } else {
        return { status: 1 }
    }
}
// verify otp field validation
export const apiSignupValidator = (values) => {
    const JoiSchema = Joi.object({
        first_name: Joi.string().trim().alphanum().min(3).max(30).required().label('First name'),
        last_name: Joi.string().trim().alphanum().min(3).max(30).required().label('Last name'),
        location: Joi.string().trim().required(),
        department: Joi.string().trim().required(),
        email: Joi.string().email({ tlds: { allow: false } }).trim().required(),
        password: Joi.string().min(8).max(16).required(),
        confirm_password: Joi.string().required().valid(Joi.ref("password")).label("Confirm password"),
    })
    // eslint-disable-next-line 
    const { value, error } = JoiSchema.validate(values, { abortEarly: true })

    if (error?.message) {
        return {
            status: 0,
            message: error.message.toString()
        }
    } else {
        return { status: 1 }
    }
}

