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

const useStyles = makeStyles((theme) => ({
    rootPaper: {
        display: 'flex',
        flexGrow: '1',
        height: 'calc(100vh - 160px)',
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
    const {loading, error, data} = useQuery(MATCHES)

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
                <Grid item xs={6}>
                    <Paper className={classes.rootPaper} elevation={2}>
                        <Table>
                            <TableHead>
                                <TableCell>
                                    Candidate
                                </TableCell>
                                <TableCell>
                                    Job Post
                                </TableCell>
                                <TableCell>
                                    Match %
                                </TableCell>
                                <TableCell>
                                    Candidate Action
                                </TableCell>
                                <TableCell>
                                    Employer Action
                                </TableCell>
                                <TableCell>
                                    Approved
                                </TableCell>
                            </TableHead>
                            {data.Match.map(match => (
                                <TableRow>
                                    <TableCell>
                                        {match.candidatePk}
                                    </TableCell>
                                    <TableCell>
                                        {match.jobPostPk}
                                    </TableCell>
                                    <TableCell>
                                        {match.matchPercentage}
                                    </TableCell>
                                    <TableCell>
                                        {match.CandidateMatchAction}
                                    </TableCell>
                                    <TableCell>
                                        {match.EmployerMatchAction}
                                    </TableCell>
                                    <TableCell>
                                        {match.approved}
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