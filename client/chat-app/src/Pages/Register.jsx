import React, { useContext } from 'react';
import { Alert, Button, Form, Row, Col, Stack } from 'react-bootstrap';
import  {AuthContext}  from '../context/AuthContext';


const Register = () => {

    const { registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading } = useContext(AuthContext);


  return (
    <>
        <Form onSubmit={registerUser}>
            <Row className="justify-content-center pt-5" style={{height: "100vh"}}>
                <Col xs="4">
                    <Stack gap={3}>
                        <h2 className="text-light">Register</h2>
                        <Form.Control type="text" placeholder="Name" onChange={(e) => updateRegisterInfo({...registerInfo, name: e.target.value})}/>
                        <Form.Control type="email" placeholder="Email" onChange={(e) => updateRegisterInfo({...registerInfo, email: e.target.value})}/>
                        <Form.Control type="password" placeholder="Password" onChange={(e) => updateRegisterInfo({...registerInfo, password: e.target.value})}/>
                        <Button variant="primary" type="submit">
                            {isRegisterLoading ? "Creating your account" : "Register"}
                        </Button>
                        {
                            registerError?.error && <Alert variant="danger" ><p>{registerError.message}</p></Alert>
                        }
                        
                    </Stack>
                </Col>
            </Row>
        </Form>
    </>
  )
}

export default Register