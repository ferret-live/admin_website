import React, {useContext, useRef, useState} from 'react'
import { makeStyles, useTheme } from "@material-ui/styles";
import Dashboard from "../common/Dashboard";
import {Link, withRouter} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import {useMutation, useQuery} from "@apollo/react-hooks";
import POST_JOB_OPTIONS from "../../graphql/queries/postJobOptions";
import ListboxComponent from "../common/ListboxComponent";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import {AuthContext} from "../../services/firebase/Auth";
import Tooltip from "@material-ui/core/Tooltip";
import {Help} from "@material-ui/icons";
import INSERT_JOB_POST from "../../graphql/mutations/insertJobPost";
import OPEN_JOB_POSTS from "../../graphql/queries/openJobPosts";
import LoadingOverlay from "react-loading-overlay";

const useStyles = makeStyles(theme => ({
    rootPaper: {
        display: 'flex',
        flexGrow: '1',
        height: 'calc(100vh - 160px)',
        elevation: 4,
        padding: theme.spacing(1.5),
        overflow: 'auto'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    listbox: {
        boxSizing: 'border-box',
        '& ul': {
            padding: 0,
            margin: 0,
        },
    },
}))

function PostJobPage({history}) {
    // Authentication
    const {currentUser} = useContext(AuthContext)

    // State
    const [error, setError] = useState({message: '', open: false})

    // Ref
    const selectedJobTypePk = useRef()
    const selectedDenominatorPk = useRef()
    const selectedQualificationPk = useRef()
    const selectedFieldOfStudyPk = useRef()
    const selectedSkillPks = useRef([])
    const selectedRemoteWorkAllowed = useRef(false)

    // Styling
    const theme = useTheme()
    const classes = useStyles(theme)

    // Apollo: insertJobPost
    const [executeInsertJobPost, {loading: submitLoading}] = useMutation(INSERT_JOB_POST)

    // Close error dialog
    const closeErrorDialog = () => setError({message: error.message, open: false})

    // Create Firebase User and store details in DB
    const handleSubmit = React.useCallback(async event => {
        // Prevent page reload
        event.preventDefault()

        // Get form values
        const {
            title,
            description,
            responsibilities,
            compensationLowerBound,
            compensationUpperBound,
            experience,
            certifications,
            otherRequirements,
            shortlistEmail
        } = event.target.elements
        try {
            // TODO: Change to TextField validation
            // Validate that numbers are numbers
            if (isNaN(compensationLowerBound.value)) {
                throw Error('Compensation (Lower Bound) should be a number')
            }
            if (isNaN(compensationUpperBound.value)) {
                throw Error('Compensation (Upper Bound) should be a number')
            }
            if (isNaN(experience.value)) {
                throw Error('Experience should be a number')
            }

            // Save JobPost to DB
            await executeInsertJobPost({
                variables: {
                    // Using Refs
                    jobTypePk: selectedJobTypePk.current,
                    denominatorPk: selectedDenominatorPk.current,
                    qualificationPk: selectedQualificationPk.current,
                    fieldOfStudyPk: selectedFieldOfStudyPk.current,
                    skillPks: selectedSkillPks.current.map(e => ({skillPk: e.id})),
                    remoteWorkAllowed: selectedRemoteWorkAllowed.current,

                    // Using other
                    currencyPk: 1,
                    locationPk: 1,
                    employerPk: currentUser.email,

                    // Using form
                    title: title.value,
                    description: description.value,
                    responsibilities: '{' + responsibilities.value.split(',').map(str => str.trim()) + '}',
                    lowerBound: parseFloat(compensationLowerBound.value),
                    upperBound: parseFloat(compensationUpperBound.value),
                    experience: parseInt(experience.value),
                    certifications: '{' + certifications.value.split(',').map(str => str.trim()) + '}',
                    otherRequirements: '{' + otherRequirements.value.split(',').map(str => str.trim()) + '}',
                    shortlistEmail: shortlistEmail.value
                },
            })

            // Redirect user to jobs (home page)
            history.push('/jobs')
        } catch (e) {
            setError({message: e.message, open: true})
        }
    }, [history])

    const DetailsStep = () => {
        const {loading, error, data} = useQuery(POST_JOB_OPTIONS)

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {/*Details*/}
                    <Typography component="h1" variant="h5" align="left">
                        Details
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="title"
                        label="Title"
                        variant="outlined"
                        fullWidth
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        multiline
                        id="description"
                        label="Description"
                        variant="outlined"
                        fullWidth
                        rows={5}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        multiline
                        id="responsibilities"
                        label="Responsibilities (comma separated)"
                        variant="outlined"
                        placeholder="Separate each responsibility with a comma"
                        fullWidth
                        rows={5}
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        id="compensationLowerBound"
                        label="Compensation (Lower Bound)"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">S$</InputAdornment>,
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        id="compensationUpperBound"
                        label="Compensation (Upper Bound)"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">S$</InputAdornment>,
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        id="denominator"
                        options={data ? data.Denominator : []}
                        loading={loading}
                        getOptionLabel={(option) => option.name}
                        onChange={(_, value) => selectedDenominatorPk.current = value
                            ? value.id
                            : null
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                                id="denominatorT"
                                variant="outlined"
                                label="Per"
                                placeholder="hour, month, etc."
                                required
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        id="type"
                        options={data ? data.JobType : []}
                        loading={loading}
                        getOptionLabel={(option) => option.name}
                        onChange={(_, value) => selectedJobTypePk.current = value
                            ? value.id
                            : null
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                                variant="outlined"
                                label="Type"
                                required
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                id="remoteWorkAllowed"
                                color="secondary"
                                onChange={(e) => {
                                    selectedRemoteWorkAllowed.current = e.target.checked
                                }}
                            />
                        }
                        label="Is remote working allowed?"
                        labelPlacement="end"
                    />
                </Grid>

                {/*Requirements*/}
                <Grid item xs={12} style={{marginTop: theme.spacing(2)}}>
                    <Typography component="h1" variant="h5" align="left">
                        Requirements
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        multiple
                        disableCloseOnSelect
                        id="skills"
                        loading={loading}
                        options={data ? data.Skill : []}
                        getOptionLabel={(option) => option.name}
                        classes={{listbox: classes.listbox}}
                        ListboxComponent={ListboxComponent}
                        onChange={(_, value) => selectedSkillPks.current = value
                            ? value
                            : []
                        }
                        filterSelectedOptions
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip variant="outlined" label={option.name} {...getTagProps({ index })} />
                            )
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                                variant="outlined"
                                label="Skills"
                                placeholder="Python, Accounting, etc."
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="experience"
                        label="Minimum years of experience in related field"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        id="qualification"
                        options={data ? data.Qualification : []}
                        loading={loading}
                        getOptionLabel={(option) => option.name}
                        onChange={(_, value) => selectedQualificationPk.current = value
                            ? value.id
                            : null
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                                variant="outlined"
                                label="Minimum Qualification"
                                required
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        id="fieldOfStudy"
                        options={data ? data.FieldOfStudy : []}
                        loading={loading}
                        getOptionLabel={(option) => option.name}
                        onChange={(_, value) => selectedFieldOfStudyPk.current = value
                            ? value.id
                            : null
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                                variant="outlined"
                                label="Field Of Study"
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="certifications"
                        label="Certifications (comma separated)"
                        variant="outlined"
                        placeholder="Separate each certification with a comma"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="otherRequirements"
                        label="Other Requirements (comma separated)"
                        variant="outlined"
                        placeholder="Separate each requirement with a comma"
                        fullWidth
                    />
                </Grid>

                {/*Shortlist Message*/}
                <Grid item xs={12} style={{marginTop: theme.spacing(2)}}>
                    <Typography component="h1" variant="h5" align="left">
                        Shortlist Message
                    </Typography>
                    <Tooltip
                        title={'When you shortlist a candidate or they accept your offer, they receive an email from' +
                            ' us with this message. Use this space to outline next steps for the candidate (for e.g.' +
                            ' the procedure they should follow to schedule an interview)'}
                        placement="right"
                    >
                        <Help/>
                    </Tooltip>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        multiline
                        id="shortlistEmail"
                        label="Shortlist Message"
                        variant="outlined"
                        fullWidth
                        rows={5}
                        required
                    />
                </Grid>
            </Grid>
        )
    }

    return (
        <Dashboard>
            <Breadcrumbs style={{ marginBottom: theme.spacing(2)}}>
                <Link to="/jobs" style={{ textDecoration: 'none' }}>
                    <Typography color="textPrimary">
                        Jobs
                    </Typography>
                </Link>
                <Typography color="textPrimary">
                    Post Job
                </Typography>
            </Breadcrumbs>
            <LoadingOverlay active={submitLoading}>
                <div>
                    <Paper className={classes.rootPaper} elevation={2}>
                        <Container component="main" maxWidth="xs">
                            <CssBaseline />
                            <div className={classes.paper}>
                                <form
                                    className={classes.form}
                                    onSubmit={handleSubmit}
                                    style={{marginTop: theme.spacing(4)}}
                                >
                                    <DetailsStep/>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                        disabled={submitLoading}
                                    >
                                        submit
                                    </Button>
                                </form>
                            </div>
                        </Container>
                    </Paper>
                </div>
            </LoadingOverlay>

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
        </Dashboard>
    )
}

export default withRouter(PostJobPage)