import React, {useContext, useState} from 'react'
import { makeStyles, useTheme } from "@material-ui/styles";
import Dashboard from "../common/Dashboard";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
import {useDispatch} from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {Link} from "react-router-dom";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import {setSelectedJob} from "../../actions/jobsActions";
import {AuthContext} from "../../services/firebase/Auth";
import {useQuery} from "@apollo/react-hooks";
import OPEN_JOB_POSTS from "../../graphql/queries/openJobPosts";
import CLOSED_JOB_POSTS from "../../graphql/queries/closedJobPosts";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(theme => ({
    rootPaper: {
        display: 'flex',
        flexGrow: '1',
        height: 'calc(100vh - 160px)',
        elevation: 4,
        padding: theme.spacing(1.5),
        overflow: 'auto'
    },
}))

export default function JobsPage() {
    // Authentication
    const {currentUser} = useContext(AuthContext)

    // Redux
    const dispatch = useDispatch()

    // State
    const [selectedTab, setSelectedTab] = React.useState('open')

    // Styling
    const theme = useTheme()
    const classes = useStyles(theme)

    // Create list of open jobs
    const OpenJobsList = () => {
        // Load list of open jobs
        const {loading, error, data} = useQuery(OPEN_JOB_POSTS, {
            fetchPolicy: 'network-only',
            variables: {
                employerPk: currentUser.email,
            }
        })

        if (loading) {
            return (
                <Grid item xs={12} container justify="center" style={{marginTop: theme.spacing(4)}}>
                    <CircularProgress/>
                </Grid>
            )
        }
        return (
            <List>
                {data.OpenJobPost.map(job => (
                    <ListItem
                        button
                        onClick={() => dispatch(setSelectedJob(job.id, job.title))}
                        component={Link}
                        to={'/candidates'}
                        key={job.id}
                    >
                        <ListItemText
                            primary={job.title}
                            secondary={
                                job.ShortlistedCount.aggregate.count + ' shortlisted, ' +
                                job.ApplicantCount.aggregate.count + ' applicants, ' +
                                job.SavedCount.aggregate.count + ' saved'
                            }
                        />
                    </ListItem>
                ))}
            </List>
        )
    }

    // Create list of closed jobs
    const ClosedJobsList = () => {
        // Load list of open jobs
        const {loading, error, data} = useQuery(CLOSED_JOB_POSTS, {
            variables: {
                employerPk: currentUser.email,
            }
        })

        if (loading) {
            return (
                <Grid item xs={12} container justify="center" style={{marginTop: theme.spacing(4)}}>
                    <CircularProgress />
                </Grid>
            )
        }
        return (
            <List>
                {data.ClosedJobPost.map(job => (
                    <ListItem
                        button
                        onClick={() => dispatch(setSelectedJob(job.id, job.title))}
                        component={Link}
                        to={'/closed-job-details'}
                    >
                        <ListItemText primary={job.title}/>
                    </ListItem>
                ))}
            </List>
        )
    }

    return (
        <Dashboard>
            <Breadcrumbs style={{ marginBottom: theme.spacing(2)}}>
                <Typography color="textPrimary">
                    Jobs
                </Typography>
            </Breadcrumbs>
            <Grid container justify={'center'}>
                <Grid item xs={6}>
                    <Paper className={classes.rootPaper} elevation={2}>
                        <Grid container alignContent="flex-start">
                            <Grid item xs={12} container justify={'center'}>
                                <Tabs
                                    value={selectedTab}
                                    onChange={(_, newVal) => setSelectedTab(newVal)}
                                    indicatorColor={'secondary'}
                                >
                                    <Tab label={'open'} value={'open'}/>
                                    <Tab label={'closed'} value={'closed'}/>
                                </Tabs>
                            </Grid>
                            <Grid item xs={12} container justify="center" alignItems="stretch" style={{marginTop: theme.spacing(1)}}>
                                {selectedTab === 'open'
                                    ? <OpenJobsList/>
                                    : <ClosedJobsList/>
                                }
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Dashboard>
    )
}