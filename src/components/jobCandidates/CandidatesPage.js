import React, {Fragment, useContext, useEffect} from 'react'
import { makeStyles, useTheme } from "@material-ui/styles";
import Dashboard from "../common/Dashboard";
import Paper from "@material-ui/core/Paper";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import CircularPercentageIndicator from "./common/CircularPercentageIndicator";
import CandidateDetails from "./common/CandidateDetails";
import LoadingOverlay from 'react-loading-overlay';
import {useQuery} from "@apollo/react-hooks";
import JOB_MATCHES from "../../graphql/queries/jobMatches";
import CircularProgress from "@material-ui/core/CircularProgress";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles(theme => ({
    rootPaper: {
        display: 'flex',
        flexGrow: '1',
        height: 'calc(100vh - 160px)',
        elevation: 4,
        padding: theme.spacing(1.5)
    },
    internalPaper: {
        overflow: 'auto',
        flexGrow: '1',
        height: '100%',
    },
}))

function CandidatesTable() {
    // Redux
    const selectedJob = useSelector(state => state.jobs.selectedJob)

    // State
    const [selectedCandidateInfo, setSelectedCandidateInfo] = React.useState()

    // Styling
    const theme = useTheme()
    const classes = useStyles(theme)

    // Filter correct objects and get candidate info object
    const getCandidateInfoObject = ({id, candidatePk, matchPercentage, employerActionPk, candidateActionPk}) => ({
        id: candidatePk,
        matchPercentage,
        employerActionPk,
        candidateActionPk,
        matchPk: id,
    })

    // Apollo: job matches
    const {loading, error, data, refetch} = useQuery(JOB_MATCHES, {
        fetchPolicy: 'network-only',
        pollInterval: 500,
        variables: {
            jobPostPk: selectedJob.id
        },
    })
    useEffect(() => {
        if (data) {
            setSelectedCandidateInfo(data.Match.length > 0
                ? getCandidateInfoObject(data.Match[0])
                : null
            )
        }
    }, [loading, error, data])

    // If loading, return spinner
    if (loading) {
        return (
            <Grid item xs={12} container justify="center" alignItems="center">
                <CircularProgress/>
            </Grid>
        )
    }

    // If error, display it
    if (error) {
        return (
            <Grid item xs={12} container justify="center" alignItems="center">
                <Typography>
                    Error: {error.message}
                </Typography>
            </Grid>
        )
    }

    return (
        <Fragment>
            <Grid item xs={4} style={{paddingRight: theme.spacing(2)}}>
                <Paper elevation={0} className={classes.internalPaper}>
                    {data && data.Match.length > 0 && selectedCandidateInfo
                        ? (
                            <List>
                                {data.Match.map(match => (
                                    <ListItem
                                        button
                                        key={match.candidatePk}
                                        selected={match.candidatePk === selectedCandidateInfo.id}
                                        onClick={() => setSelectedCandidateInfo(getCandidateInfoObject(match))}
                                        alignItems={'flex-start'}
                                    >
                                        <ListItemText
                                            primary={
                                                match.Candidate.User.firstName + ' ' + match.Candidate.User.lastName
                                            }
                                            secondary={match.candidateActionPk === 3 ? (
                                                <Chip
                                                    color="secondary"
                                                    label="Applied"
                                                    style={{marginTop: theme.spacing(0.5)}}
                                                />
                                            ) : null}
                                        />
                                        <ListItemSecondaryAction>
                                            <div style={{maxWidth: 48}}>
                                                <CircularPercentageIndicator percentage={match.matchPercentage}/>
                                            </div>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography
                                align="center"
                                variant="h4"
                                style={{marginTop: theme.spacing(4)}}
                            >
                                No one here yet!
                            </Typography>
                        )
                    }
                </Paper>
            </Grid>
            <Grid item xs={8}>
                <Paper className={classes.internalPaper} elevation={0}>
                    {selectedCandidateInfo
                        ? <CandidateDetails candidateInfo={selectedCandidateInfo} refetch={refetch}/>
                        : (
                            <Typography
                                align="center"
                                variant="h4"
                                style={{marginTop: theme.spacing(4)}}
                            >
                                Please wait to get matches!
                            </Typography>
                        )
                    }
                </Paper>
            </Grid>
        </Fragment>
    )
}

export default function CandidatesPage() {
    // Redux
    const selectedJob = useSelector(state => state.jobs.selectedJob)

    // Styling
    const theme = useTheme()
    const classes = useStyles(theme)

    return (
        <Dashboard>
            <Breadcrumbs style={{ marginBottom: theme.spacing(2)}}>
                <Link to="/jobs" style={{ textDecoration: 'none' }}>
                    <Typography color="textPrimary">
                        Jobs
                    </Typography>
                </Link>
                <Typography color="textPrimary">
                    {selectedJob.title}
                </Typography>
            </Breadcrumbs>
            <Paper className={classes.rootPaper} elevation={2}>
                <CandidatesTable />
            </Paper>
        </Dashboard>
    )
}