import React from "react";
import firebaseApp from "./firebaseApp";

export const AuthContext = React.createContext()

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = React.useState(null)

    React.useEffect(() => {
        firebaseApp.auth().onAuthStateChanged(setCurrentUser)
    }, [])

    return (
        <AuthContext.Provider value={{currentUser}}>
            {children}
        </AuthContext.Provider>
    )
}