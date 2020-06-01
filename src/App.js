import React from 'react'
import {AuthProvider} from "./services/firebase/Auth";
import Routes from "./services/router/Routes";
import CustomMuiThemeProvider from "./services/mui/CustomMuiThemeProvider";
import CustomApolloProvider from "./services/apollo/CustomApolloProvider";

export default function App() {
  return (
      <AuthProvider>
          <CustomApolloProvider>
              <CustomMuiThemeProvider>
                  <Routes/>
              </CustomMuiThemeProvider>
          </CustomApolloProvider>
      </AuthProvider>
  )
}