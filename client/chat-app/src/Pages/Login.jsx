import React, { useContext} from 'react';
import { Alert, Button, Form, Row, Col, Stack } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const Login = () => {

    const { loginInfo, updateLoginInfo, loginUser, loginError, isLoginLoading } = useContext(AuthContext)
  return (
    <>
        <Form onSubmit={loginUser}>
            <Row className="justify-content-center pt-5" style={{height: "100vh"}}>
                <Col xs="4">
                    <Stack gap={3}>
                        <h2 className="text-light">Login</h2>
                        <Form.Control type="email" placeholder="Email" onChange={(e) => updateLoginInfo({...loginInfo, email: e.target.value})}/>
                        <Form.Control type="password" placeholder="Password" onChange={(e) => updateLoginInfo({...loginInfo, password: e.target.value})}/>
                        <Button variant="primary" type="submit">
                            { isLoginLoading ? "Logging you in" : "Login"}
                        </Button>
                        {
                            loginError?.error && (
                                <Alert variant="danger" >{loginError.message}</Alert>
                            )
                        }
                        
                    </Stack>
                </Col>
            </Row>
        </Form>
    </>
  )
}

export default Login