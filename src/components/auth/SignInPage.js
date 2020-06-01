import React, {useContext, useState} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {NavLink, Redirect, withRouter} from 'react-router-dom'
import Box from "@material-ui/core/Box";
import firebaseApp from "../../services/firebase/firebaseApp";
import {AuthContext} from "../../services/firebase/Auth";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://getagig.app">
                Get a Gig
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function SignIn({history}) {
    const classes = useStyles();

    // State
    const [loading, setLoading] = useState(false)
    const [error, setError] = React.useState({message: '', open: false})

    // Close error dialog
    const closeErrorDialog = () => {
        // Remove loading
        setLoading(false)

        // Set error
        setError({message: error.message, open: false})
    }

    // Get Firebase User
    const handleSubmit = React.useCallback(async event => {
        // Prevent page reload
        event.preventDefault()

        // Get form values
        const {
            email,
            password,
        } = event.target.elements
        try {
            // Set loading
            setLoading(true)

            // Get Firebase User
            await firebaseApp.auth().signInWithEmailAndPassword(email.value, password.value)

            // Redirect user to jobs (home page)
            history.push('/jobs')
        } catch (e) {
            setError({message: e.message, open: true})
        }
    }, [history])

    // If user is already signed in, redirect him to home page
    const {currentUser} = useContext(AuthContext)
    if (currentUser) {
        return <Redirect to="/jobs" />
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24}/> : "sign in"}
                    </Button>
                    <Typography align={'center'} style={{marginTop: 16}} >
                        Don't have an account? Sign up.
                    </Typography>
                    <Grid container justify={'center'}  spacing={4}>
                        <Grid item>
                            <Link variant="body2" component={NavLink} to={'/sign-up'}>
                                {"Employers"}
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link variant="body2" href="https://get-a-gig-4af9e.web.app/">
                                {"Job Seekers"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>

            {/*Error Dialog*/}
            <Dialog open={error.open} onClose={closeErrorDialog}>
                <DialogTitle>
                    Error
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {error.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeErrorDialog}>
                        Back
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default withRouter(SignIn)