import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {ThemeProvider} from "@material-ui/styles";
import React from "react";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#344955',
            light: '#4A6572',
            dark: '#232F34',
            contrastText: '#fff'
        },
        secondary: {
            main: '#F9AA33',
            contrastText: '#212121'
        },
        text: {
            primary: '#212121',
            secondary: '#757575'
        },
    }
})

export default function CustomMuiThemeProvider({children}) {
    return (
        <ThemeProvider theme={theme} >
            {children}
        </ThemeProvider>
    )
}