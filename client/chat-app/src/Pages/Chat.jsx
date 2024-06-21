import React, { useEffect } from 'react';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { Container, Stack } from 'react-bootstrap';
import UserChat from '../Components/chat/UserChat';
import { AuthContext } from '../context/AuthContext';
import PotentialChats from '../Components/chat/PotentialChats';
import ChatBox from '../Components/chat/ChatBox'; 

const Chat = () => {

  const { userChats, isUserChatsLoading, userChatError, updateCurrentChat } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  return (
    <Container>
      <PotentialChats />
      {
        userChats?.length < 1 ? null : <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {isUserChatsLoading && <p>Loading chats...</p>}
            {
              
              userChats?.map((chat, index) => {
                return (
                  <div key={index} onClick={() => updateCurrentChat(chat)}>
                    <UserChat chat={chat} user={user}/>
                  </div>
                )
              })
            }
          </Stack>
          <ChatBox />
        </Stack>
      }
    </Container>
  )
}

export default Chat;