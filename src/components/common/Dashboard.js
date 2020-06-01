import React from 'react';
import {makeStyles, useTheme} from "@material-ui/styles";
import {
    ExitToApp, PostAdd,
} from "@material-ui/icons";
import Toolbar from "@material-ui/core/Toolbar";
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import firebaseApp from "../../services/firebase/firebaseApp";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    appBar: {
        background: theme.palette.background.paper,
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4)
    },
}))

export default function Dashboard({ children }) {
    const theme = useTheme()
    const classes = useStyles(theme);

    // Logout using Firebase
    const logOut = () => firebaseApp.auth().signOut()

    return (
        <div className={classes.root}>
            <AppBar className={classes.appBar} variant={'outlined'}>
                <Toolbar>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Typography
                            variant="h4"
                            color={'textPrimary'}
                            style={{marginRight: theme.spacing(4)}}
                            noWrap
                        >
                            Ferret
                        </Typography>
                    </Link>
                    <div style={{flexGrow: 1}}/>
                    <Button
                        component={Link}
                        to={'/post-job'}
                        variant={'outlined'}
                        color={'secondary'}
                        endIcon={<PostAdd/>}
                        style={{marginRight: theme.spacing(2)}}
                    >
                        <Typography noWrap>
                            Post Job
                        </Typography>
                    </Button>
                    <Button
                        onClick={logOut}
                        variant={'outlined'}
                        color={'primary'}
                        endIcon={<ExitToApp/>}
                    >
                        <Typography noWrap>
                            logout
                        </Typography>
                    </Button>
                </Toolbar>
            </AppBar>
            <div style={{
                marginTop: 64 + theme.spacing(2),
                marginRight: theme.spacing(7),
                marginLeft: theme.spacing(7)
            }}>
                {children}
            </div>
        </div>
    )
}
