import Dashboard from "../components/common/Dashboard";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import React from "react";
import {makeStyles, useTheme} from "@material-ui/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import {useQuery} from "@apollo/react-hooks";
import MATCHES from "../graphql/queries/matches";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import Switch from "@material-ui/core/Switch";

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

export default function MainPage() {
    // Styling
    const theme = useTheme()
    const classes = useStyles(theme)



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
                                        <Link onClick={() => {}}>
                                            {match.candidatePk}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link>
                                            {match.jobPostPk}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
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
                                            onChange={(_, checked) => {}}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        </Dashboard>
    )
}