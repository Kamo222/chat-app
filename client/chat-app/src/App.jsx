import { useState, useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Chat from './Pages/Chat';
import Login from './Pages/Login';
import Register from './Pages/Register';
import { Container } from "react-bootstrap";
import NavBar from './Components/Navbar';
import { AuthContext } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';

const App = () => {
  
  const { user } = useContext(AuthContext);

  return (
    <>
      <ChatContextProvider user={user}>
        <NavBar />
        <Container>
          <Routes>
            <Route path="/" element={ user ? <Chat/> : <Login />} />
            <Route path="/register" element={user ? <Chat/> : <Register/>} />
            <Route path="/login" element={user ? <Chat /> : <Login/>} />
            <Route path="*" element={<Navigate to="/"/>} />
          </Routes>
        </Container>
      </ChatContextProvider>
    </>
  )
}

export default App
