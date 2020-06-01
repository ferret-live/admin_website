import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import SignInPage from "../../components/auth/SignInPage";
import PrivateRoute from "./PrivateRoute";
import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MainPage from "../../main/MainPage";

function FourOhFourPage() {
    return (
        <Grid container>
            <Grid
                item
                container
                justify={'center'}
                alignItems={'center'}
                xs={12}
                style={{display: 'flex', height: '100vh'}}
            >
                <Grid item container justify={'center'} alignItems={'center'} xs={12}>
                    <Typography variant={'h1'}>
                        404
                    </Typography>
                </Grid>
                <Grid item container justify={'center'} alignItems={'center'} xs={12}>
                    <Button variant={'outlined'} component={Link} to={'/'}>
                        Back to home page
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                {/*Authentication*/}
                <Route exact path={'/'} component={SignInPage}/>
                {/*Dashboard*/}
                <PrivateRoute exact path={'/main-page'} component={MainPage}/>
                {/*Error*/}
                <Route component={FourOhFourPage}/>
            </Switch>
        </BrowserRouter>
    )
}