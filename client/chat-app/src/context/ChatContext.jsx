import { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { getRequest, baseUrl, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ user, children }) => {

    const [ userChats, setUserChats ] = useState(null);
    const [ isUserChatsLoading, setIsUserChatsLoading ] = useState(false);
    const [ userChatError, setUserChatError ] = useState(null);
    const [ potentialChats, setPotentialChats ] = useState([]);
    const [ currentChat, setCurrentChat ] = useState(null);

    const [ messages, setMessages ] = useState(null);
    const [ isMessagesLoading, setIsMessagesLoading ] = useState(false);
    const [ messagesError, setMessagesError ] = useState(null);

    const [ sendTextMessageError, setSendTextMessageError ] = useState(null);
    const [ newMessage, setNewMessage ] = useState(null);
    
    const [ socket, setSocket ] = useState(null);
    const [ onlineUsers, setOnlineUsers] = useState(null);

   

    //Initialize Socket
    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, [user]);
    // Add online users
    useEffect(() => {
        if(socket === null) return;
        socket.emit("addNewUser", user?.id);
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });

        return () => {
            socket.off("getOnliseUsers")
        }
    }, [socket])

    // Send message to the server

    useEffect(() => {
        if(socket === null) return;

        const recipientId = currentChat?.members?.find((id) => id !== user.id)

        socket.emit("sendMessage", {...newMessage, recipientId});
    }, [newMessage])

    // recieve message

    useEffect(() => {
        if(socket === null) return;
        socket.on("getMessage", (resp) => {
            //if(currentChat?._id !== resp.chatId) return
            console.log("response",resp);
            setMessages((prev) => [...prev, resp]);
            console.log("function ran")
        });

        return () => {
            socket.off("getMessage")
        }
    }, [socket, currentChat])

    useEffect(() => {
        const getUsers = async () => {
            const response = await getRequest(`${baseUrl}/user`);

            if(response.error){
                return console.log("Error fetching users", response)
            }

           const pChats = response.filter((u) => {
                let isChatCreated = false;
                
                // if(user.id === u._id){
                //     return false;
                // }

                if(userChats){
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id;
                    })
                }

                return !isChatCreated;
           })

           setPotentialChats(pChats)
        }

        getUsers()
    }, [userChats])

    useEffect(() => {
        const getUserChats = async () => {
            
            if(user?.id){
                setIsUserChatsLoading(true);
                setUserChatError(null);
                const response = await getRequest(`${baseUrl}/chat/${user?.id}`);
                
                setIsUserChatsLoading(false);

                if(response.error){
                    return setUserChatError(response);
                }

                 
                setUserChats(response);
            }
        }

        getUserChats();
    }, [user])

    useEffect(() => {
        const getMessages = async () => {
            
                
                setIsMessagesLoading(true);
                setMessagesError(null);
                const response = await getRequest(`${baseUrl}/message/${currentChat?._id}`);
                
                setIsMessagesLoading(false);

                if(response.error){
                    return setMessagesError(response);
                }

                 
                setMessages(response);
        }

        getMessages();
    }, [currentChat]);

    const sendTextMessage = useCallback( async (textMessage, sender, currentChatId, setTextMessage) => {
        if(!textMessage){
            return console.log("You must type something..")
        }
        const response = await postRequest(`${baseUrl}/message`, JSON.stringify({
            chatId: currentChatId,
            senderId: sender.id,
            text: textMessage
        }))

        if(response.error){
            return setSendTextMessageError(response)
        }

        setNewMessage(response);
        setMessages((prev => [...prev, response]));
        setTextMessage("");
    }, [])

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    }, []);

    const createChat = useCallback( async (firstId, secondId) => {
        const response = await postRequest(`${baseUrl}/chat`, JSON.stringify({
            firstId,
            secondId
        }));

        if(response.error){
            return console.log("Error creating chats", response);
        }

        setUserChats((prev) => [...prev, response])
    }, [])

    return (
        <ChatContext.Provider value={{
            userChats,
            isUserChatsLoading,
            userChatError,
            potentialChats,
            createChat,
            updateCurrentChat,
            messages,
            isMessagesLoading,
            messagesError,
            currentChat,
            sendTextMessage,
            onlineUsers
        }}>
            {children}
        </ChatContext.Provider>
    )
}
