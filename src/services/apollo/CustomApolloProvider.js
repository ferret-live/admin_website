import {ApolloProvider} from "@apollo/react-hooks";
import {AuthContext} from "../firebase/Auth";
import React from "react";
import ApolloClient from "apollo-client";
import {HttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";

// ApolloClient instance
const createApolloClient = (idToken) => {
    return new ApolloClient({
        link: new HttpLink({
            uri: process.env.REACT_APP_HASURA_URI,
            // headers: {
            //     Authorization: `Bearer ${idToken}`
            // }
        }),
        cache: new InMemoryCache(),
    });
};

export default function CustomApolloProvider({children}) {
    // Get currentUser's id token
    const {currentUser} = React.useContext(AuthContext)
    const idToken = currentUser ? currentUser.getIdToken() : null

    // Create Apollo client and add Firebase token to headers
    const client = createApolloClient(idToken)

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    )
}