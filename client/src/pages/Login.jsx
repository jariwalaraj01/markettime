import React, { useState } from 'react'
import { Container, Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { toast } from 'react-toastify'
import { apiLoginValidator, apiVerifyOTPValidator } from '../validations/validations';
import { loginAPI, verifyOtpAPI } from '../axios/apiList';
const Login = () => {

    const navigate = useNavigate()

    // initialize fields values
    const [values, setValues] = useState({
        email: '',
        password: '',
        password_show: false,
        disabled: false,
        otp: ''
    })

    // update initial values
    const handleChange = e => {
        const { name, value } = e.target
        setValues((values) => ({ ...values, [name]: value }))
    }

    // manually update initial values
    const handleChangeManually = (key, value) => {
        setValues(values => ({ ...values, [key]: value }))
    }

    // submit data and call api
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!values.disabled) {
            const { email, password } = values
            const result = apiLoginValidator({ email, password })
            if (result.status === 0) {
                return toast.error(result.message)
            }
            const id = toast.loading("Please wait...")
            const response = await loginAPI({ email, password })
            if (response?.code === 200) {
                handleChangeManually('disabled', true)
                return toast.update(id, {
                    render: response.message,
                    type: "success",
                    isLoading: false,
                    autoClose: 5000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                return toast.update(id, {
                    render: response.message,
                    type: "error",
                    isLoading: false,
                    autoClose: 5000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            }
        } else {
            const { email, otp } = values
            const result = apiVerifyOTPValidator({ email, otp })
            if (result.status === 0) {
                return toast.error(result.message)
            }

            const response = await verifyOtpAPI({ email, otp })
            if (response?.code === 200) {
                localStorage.setItem('token', response.data.token);
                navigate('/home');
                return toast.success(response.message)
            } else {
                return toast.error(response.message)
            }
        }
    }
    return (
        <Container>
            <div className='position-absolute top-50 start-50 translate-middle w-25'>
                <p className="fs-1 fw-bold text-center">MarketTime</p>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            disabled={values.disabled}
                            type="email"
                            placeholder="Enter Email"
                            required
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {!values.disabled ?
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    disabled={values.disabled}
                                    type={values.password_show ? 'text' : 'password'}
                                    placeholder="Password"
                                    required
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                />
                                <Button
                                    disabled={values.disabled}
                                    variant="outline-secondary"
                                    onClick={(e) => handleChangeManually('password_show', !values.password_show)}
                                >
                                    {values.password_show ? <BsEye /> : <BsEyeSlash />}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        :
                        <Form.Group className="mb-3">
                            <Form.Label>OTP</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter OTP"
                                required
                                name="otp"
                                value={values.otp}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    }

                    {!values.disabled ?
                        <div className='d-flex justify-content-center mt-4'>
                            <Button className='w-50' variant="primary" type="submit">Login</Button>
                        </div>
                        :
                        <div className='d-flex justify-content-center mt-4'>
                            <Button className='w-50' variant="primary" type="submit">Verify OTP</Button>
                        </div>
                    }
                </Form>

                {!values.disabled ?
                    <div className='d-flex justify-content-center mt-4'>
                        <Link to='/signup'>Create new account?</Link>
                    </div>
                    :
                    <div className='d-flex justify-content-center mt-4'>
                        <Link to='#' onClick={() => handleChangeManually('disabled', false)}>Edit email?</Link>
                    </div>
                }
            </div>
        </Container>
    )
}

export default Login