import { createContext, useCallback, useEffect, useState } from "react";
import { postRequest } from "../utils/services";
import { baseUrl } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {

    const [user, setUser] = useState(null);

    const [registerError, setRegisterError ] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegistorInfo ] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [loginInfo, setLogininfo] = useState({
        email: "",
        password: ""
    })
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState(null)

    //console.log(registerInfo);
    //console.log(loginInfo);

    useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem("User"));
        setUser(localUser);
      }, [])

    const updateRegisterInfo = useCallback((info) => {
        setRegistorInfo(info);
    }, [])

    const registerUser = useCallback( async (e) => {
        e.preventDefault()
        setIsRegisterLoading(true);
        setRegisterError(null);

        const response = await postRequest(`${baseUrl}/user/register`, JSON.stringify(registerInfo));

        setIsRegisterLoading(false);

        if(response.error){
            
             return setRegisterError(response);
        }

        localStorage.setItem("User", JSON.stringify(response))
        setUser(response);
    }, [registerInfo])

    const logoutUser = useCallback(() => {
        localStorage.removeItem("User");
        setUser(null);
    }, [])

    const loginUser = useCallback( async (e) => {
        
        e.preventDefault();
        setIsLoginLoading(true);
        setLoginError(null)
        
        const response = await postRequest(`${baseUrl}/user/login`, JSON.stringify(loginInfo));
        setIsLoginLoading(false)
        
        if(response.error){
            return setLoginError(response);
        }

        localStorage.setItem("User", JSON.stringify(response))
        setUser(response)
    }, [loginInfo])

    const updateLoginInfo = useCallback((info) => {
        setLogininfo(info)
    }, [])

    return ( <AuthContext.Provider value={{
        user,
        setUser,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        isLoginLoading,
        logoutUser,
        loginUser,
        loginInfo,
        loginError,
        updateLoginInfo
    }}>
        {props.children}
    </AuthContext.Provider> ) 
}