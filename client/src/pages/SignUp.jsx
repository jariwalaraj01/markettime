import React, { useState } from 'react'
import { Container, Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { toast } from 'react-toastify'
import { apiSignupValidator } from '../validations/validations';
import { signupAPI } from '../axios/apiList';

const SignUp = () => {

    const navigate = useNavigate()

    // initialize fields values
    const [values, setValues] = useState({
        first_name: '',
        last_name: '',
        location: '',
        department: '',
        email: '',
        password: '',
        password_show: false,
        confirm_password: '',
        confirm_password_show: false,
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
        const { first_name, last_name, location, department, email, password, confirm_password } = values
        const data = {
            first_name,
            last_name,
            location,
            department,
            email,
            password,
            confirm_password
        }
        const result = apiSignupValidator(data)
        if (result.status === 0) {
            return toast.error(result.message)
        }
        const response = await signupAPI(data)
        if (response?.code === 201) {
            navigate('/');
            return toast.success(response.message)
        } else {
            return toast.error(response.message)
        }
    }
    return (
        <Container>
            <div className='position-absolute top-50 start-50 translate-middle w-50'>
                <p className="fs-1 fw-bold text-center">Sign Up</p>
                <Form onSubmit={handleSubmit}>
                    <div className='d-flex w-100 gap-3'>
                        <Form.Group className="mb-3 w-50">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter First Name"
                                required
                                name="first_name"
                                value={values.first_name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 w-50">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Last Name"
                                required
                                name="last_name"
                                value={values.last_name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </div>
                    <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Location"
                            required
                            name="location"
                            value={values.location}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Department</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Department"
                            required
                            name="department"
                            value={values.department}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter Email"
                            required
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <div className='d-flex w-100 gap-3'>
                        <Form.Group className="mb-3 w-50">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={values.password_show ? 'text' : 'password'}
                                    placeholder="Password"
                                    required
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={(e) => handleChangeManually('password_show', !values.password_show)}
                                >
                                    {values.password_show ? <BsEye /> : <BsEyeSlash />}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3 w-50">
                            <Form.Label>Confirm Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={values.confirm_password_show ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    required
                                    name="confirm_password"
                                    value={values.confirm_password}
                                    onChange={handleChange}
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={(e) => handleChangeManually('confirm_password_show', !values.confirm_password_show)}
                                >
                                    {values.confirm_password_show ? <BsEye /> : <BsEyeSlash />}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                    </div>
                    <div className='d-flex justify-content-center mt-4'>
                        <Button className='w-50' variant="primary" type="submit">Sign Up</Button>
                    </div>
                </Form>
                <div className='d-flex justify-content-center mt-4'>
                    <Link to='/'>Do you already have an account?</Link>
                </div>
            </div>
        </Container>
    )
}

export default SignUp