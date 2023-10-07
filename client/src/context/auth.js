import { useState, useEffect, useContext , createContext} from "react";

const AuthContext = createContext()


// making it global
const AuthProvider = ({children})=>{
    const[auth , setAuth]= useState({
        user : null,
        token : ""
    });
    // getting the save data from the local storage
    useEffect(()=>{
        const data = localStorage.getItem('auth')
        if(data){
            const parseData = JSON.parse(data)
            setAuth({
                ...auth,
                user : parseData.user,
                token : parseData.token
            });
        }
    },[auth]);
    return (
        <AuthContext.Provider value={[auth,setAuth]}>
            {children}
        </AuthContext.Provider>
    )

}

// custom hook
const useAuth = ()=> useContext(AuthContext)

export {useAuth, AuthProvider}