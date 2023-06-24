import React, { useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Table } from 'react-bootstrap'
import { logoutAPI, userDetailAPI } from '../axios/apiList';
import { toast } from 'react-toastify'

const Home = () => {

    const navigate = useNavigate()
    const [values, setValues] = useState({})

    // call this function after page is loaded 
    useLayoutEffect(() => {
        fetchUserDetail()
    }, [])

    // get user details api
    const fetchUserDetail = async () => {
        const response = await userDetailAPI()
        if (response?.code === 200) {
            setValues(response.data)
        } else {
            return toast.error(response.message)
        }
    }

    // handle logout and call api
    const handleLogout = async (e) => {
        e.preventDefault()

        const response = await logoutAPI()
        if (response?.code === 200) {
            window.localStorage.removeItem('token')
            navigate('/')
            return toast.success(response.message)
        } else {
            return toast.error(response.message)
        }
    }

    return (
        <div>
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#home">Market Time</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#">Features</Nav.Link>
                            <Nav.Link href="#">Pricing</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link href="#">{`${values?.first_name} ${values?.last_name}`}</Nav.Link>
                            <NavDropdown title="Setting" id="collasible-nav-dropdown">
                                <NavDropdown.Item href="#" onClick={handleLogout}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className='d-flex justify-content-center mt-5'>
                <Table className='w-50'>
                    <tbody>
                        <tr className='remove-border-style'>
                            <td>First Name</td>
                            <td>: {values?.first_name}</td>
                        </tr>
                        <tr className='remove-border-style'>
                            <td>Last Name</td>
                            <td>: {values?.last_name}</td>
                        </tr>
                        <tr className='remove-border-style'>
                            <td>Location</td>
                            <td>: {values?.location}</td>
                        </tr>
                        <tr className='remove-border-style'>
                            <td>Department</td>
                            <td>: {values?.department}</td>
                        </tr>
                        <tr style={{ width: '50%' }} className='remove-border-style'>
                            <td>Email</td>
                            <td>: {values?.email}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default Home