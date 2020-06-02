import Dashboard from "../common/Dashboard";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import React, {useState} from "react";
import {makeStyles, useTheme} from "@material-ui/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import {useMutation, useQuery} from "@apollo/react-hooks";
import MATCHES from "../../graphql/queries/matches";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import Switch from "@material-ui/core/Switch";
import TOGGLE_MATCH_APPROVAL from "../../graphql/mutations/toggleMatchApproval";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import CANDIDATE from "../../graphql/queries/candidate";
import Candidate from "./Candidate";
import JobPost from "./JobPost";
import TextField from "@material-ui/core/TextField";
import UPDATE_MATCH_PERCENTAGE from "../../graphql/mutations/updateMatchPercentage";

const useStyles = makeStyles((theme) => ({
    rootPaper: {
        display: 'flex',
        flexGrow: '1',
        height: 'calc(100vh - 100px)',
        elevation: 4,
        padding: theme.spacing(1.5),
        overflow: 'auto'
    },
}))

function CandidateDialog({handleClose, open, candidatePk}) {
    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>
                Candidate {candidatePk}
            </DialogTitle>
            <DialogContent>
                <Candidate candidatePk={candidatePk}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Back
                </Button>
            </DialogActions>
        </Dialog>
    )
}

function JobPostDialog({open, handleClose, jobPostPk}) {
    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>
                Job Post {jobPostPk}
            </DialogTitle>
            <DialogContent>
                <JobPost jobPostPk={jobPostPk}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Back
                </Button>
            </DialogActions>
        </Dialog>
    )
}

function MatchPercentageDialog({open, handleClose, matchPk}) {
    // State
    const [newMatchPercentage, setNewMatchPercentage] = useState()

    // Apollo: Update match percentage
    const [executeUpdateMatchPercentage, {loading}] = useMutation(UPDATE_MATCH_PERCENTAGE)

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>
                New match % for Match #{matchPk}
            </DialogTitle>
            <DialogContent>
                <TextField
                    label="New Match %"
                    onChange={(event) =>
                        setNewMatchPercentage(event.target.value)
                    }
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Back
                </Button>
                <Button
                    onClick={async () => {
                        await executeUpdateMatchPercentage({
                            variables: {
                                id: matchPk,
                                matchPercentage: newMatchPercentage
                            }
                        })
                        handleClose()
                    }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24}/> : "confirm"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default function MainPage() {
    // State
    const [selectedCandidatePk, setSelectedCandidatePk] = useState()
    const [selectedJobPostPk, setSelectedJobPostPk] = useState()
    const [selectedMatchPk, setSelectedMatchPk] = useState()

    // Styling
    const theme = useTheme()
    const classes = useStyles(theme)

    // Apollo: toggle match approval
    const [executeToggleMatchApproval] = useMutation(TOGGLE_MATCH_APPROVAL)

    // Apollo: Get all matches
    const {loading, error, data} = useQuery(MATCHES, {
        fetchPolicy: 'network-only',
        pollInterval: 500
    })

    if (loading) {
        return (
            <Grid item xs={12} container justify="center" style={{marginTop: theme.spacing(4)}}>
                <CircularProgress />
            </Grid>
        )
    }

    if (error) {
        return (
            <Grid item xs={12} container justify="center" style={{marginTop: theme.spacing(4)}}>
                <Typography>
                    <strong>Error -> </strong>{error.message}
                </Typography>
            </Grid>
        )
    }

    return (
        <Dashboard>
            <Grid container justify={'center'}>
                <Grid item xs={12}>
                    <Paper className={classes.rootPaper} elevation={2}>
                        <Table>
                            <TableHead>
                                <TableCell>
                                    <Typography variant="h6">
                                        Match ID
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h6">
                                        Candidate
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h6">
                                        Job Post
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h6">
                                        Match %
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h6">
                                        Candidate Action
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h6">
                                        Employer Action
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h6">
                                        Approved
                                    </Typography>
                                </TableCell>
                            </TableHead>
                            {data.Match.map(match => (
                                <TableRow>
                                    <TableCell>
                                        {match.id}
                                    </TableCell>
                                    <TableCell>
                                        <Link onClick={() => setSelectedCandidatePk(match.candidatePk)}>
                                            {match.candidatePk}
                                        </Link>
                                    </TableCell>
                                    <TableCell onClick={() => setSelectedJobPostPk(match.jobPostPk)}>
                                        <Link>
                                            {match.jobPostPk}
                                        </Link>
                                    </TableCell>
                                    <TableCell onClick={() => setSelectedMatchPk(match.id)}>
                                        <Link>
                                            {match.matchPercentage.toFixed(2)}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {match.CandidateMatchAction.name}
                                    </TableCell>
                                    <TableCell>
                                        {match.EmployerMatchAction.name}
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={match.approved}
                                            onChange={(_, checked) =>
                                                executeToggleMatchApproval({
                                                    variables: {
                                                        id: match.id,
                                                        approved: checked
                                                    }
                                                })
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </Table>
                    </Paper>
                </Grid>
            </Grid>

            <CandidateDialog
                open={selectedCandidatePk}
                handleClose={() => setSelectedCandidatePk(undefined)}
                candidatePk={selectedCandidatePk}
            />
            <JobPostDialog
                open={selectedJobPostPk}
                handleClose={() => setSelectedJobPostPk(undefined)}
                jobPostPk={selectedJobPostPk}
            />
            <MatchPercentageDialog
                open={selectedMatchPk}
                handleClose={() => setSelectedMatchPk(undefined)}
                matchPk={selectedMatchPk}
            />
        </Dashboard>
    )
}