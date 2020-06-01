import {useTheme} from "@material-ui/styles";
import React, {Fragment} from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import {Bookmark, BookmarkBorder, Close, Done, LocationOn, School} from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import CircularPercentageIndicator from "./CircularPercentageIndicator";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Chip from "@material-ui/core/Chip";
import {useMutation, useQuery} from "@apollo/react-hooks";
import CANDIDATE_DETAILS from "../../../graphql/queries/candidateDetails";
import SAVE_CANDIDATE from "../../../graphql/mutations/saveCandidate";
import CircularProgress from "@material-ui/core/CircularProgress";
import SHORTLIST_CANDIDATE from "../../../graphql/mutations/shortlistCandidate";
import REJECT_CANDIDATE from "../../../graphql/mutations/rejectCandidate";
import gql from "graphql-tag"


const link_s3 = "https://getagig-customer-files.s3-ap-southeast-1.amazonaws.com/job-seekers/resumes/"
const link_extension = '.pdf'

function ShortlistDialog({open, handleClose, name, matchPk}) {
    // Apollo: shortlist candidate
    const [executeShortlistCandidate, {loading}] = useMutation(SHORTLIST_CANDIDATE)

    return(
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>
                Shortlist {name}?
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Once confirmed, {name} will be notified via email.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Back
                </Button>
                <Button
                    onClick={async () => {
                        await executeShortlistCandidate({variables: {matchPk}})
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

function RejectDialog({open, handleClose, name, matchPk}) {
    // Apollo: shortlist candidate
    const [executeRejectCandidate] = useMutation(REJECT_CANDIDATE)

    return(
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>
                Reject {name}?
            </DialogTitle>
            <DialogActions>
                <Button onClick={handleClose}>
                    Back
                </Button>
                <Button
                    onClick={async () => {
                        await executeRejectCandidate({variables: {matchPk}})
                        handleClose()
                    }}
                >
                    confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default function CandidateDetails({candidateInfo}) {
    // State
    const [shortlistDialogOpen, setShortlistDialogOpen] = React.useState(false)
    const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false)

    // Apollo: Save candidate
    const [executeSaveCandidate] = useMutation(SAVE_CANDIDATE)

    // Styling
    const theme = useTheme()

    const Header = () => {
        const lastName = data.Candidate.User.lastName
        const age = data.Candidate.age
        const gender = data.Candidate.gender
        const singaporeResidentialStatus = data.Candidate.singaporeResidentialStatus
        const saved = candidateInfo.employerActionPk === 2
        const applied = candidateInfo.candidateActionPk === 3
        const matchPercentage = candidateInfo.matchPercentage
        return (
            <React.Fragment>
                <Grid item xs={10} container>
                    <Grid item xs={12} container>
                        <Typography variant={'h4'}>
                            {firstName + ' ' + lastName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'subtitle1'}>
                            {applied ? (
                                <Chip color="secondary" label="Applied" style={{marginRight: theme.spacing(2)}}/>
                            ) : null}
                            {age + ', ' + gender + ', ' + singaporeResidentialStatus}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={{marginTop: theme.spacing(1.5)}}>
                        <Button
                            color={'primary'}
                            variant={'contained'}
                            style={{marginRight: theme.spacing(0.5)}}
                            href={link_s3 + candidateInfo.id + link_extension}
                            target="_blank"
                        >
                            Resume
                        </Button>
                    </Grid>
                    <Grid item xs={12} style={{marginTop: theme.spacing(1.5)}}>
                        <IconButton
                            style={{marginRight: theme.spacing(0.5)}}
                            onClick={() => setShortlistDialogOpen(true)}
                        >
                            <Done style={{color: 'green'}}/>
                        </IconButton>
                        <IconButton
                            style={{marginRight: theme.spacing(0.5)}}
                            onClick={() => setRejectDialogOpen(true)}
                        >
                            <Close style={{color: 'red'}}/>
                        </IconButton>
                        <IconButton
                            onClick={() => executeSaveCandidate({
                                variables: {matchPk: candidateInfo.matchPk}
                            })}
                        >
                            {saved ? <Bookmark/> : <BookmarkBorder/>}
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid item xs={2} container justify={'center'} alignItems="flex-start">
                    {matchPercentage ? (
                        <div style={{maxWidth: 72}}>
                            <CircularPercentageIndicator percentage={matchPercentage}/>
                        </div>
                    ) : null}
                </Grid>
                <Grid item xs={12} style={{marginTop: theme.spacing(4), marginBottom: theme.spacing(4)}}>
                    <Divider/>
                </Grid>
            </React.Fragment>
        )
    }

    const Body = () => {
        const LocComp = () => {
            const country = data.Candidate.Location.country
            const city = data.Candidate.Location.city
            const qualification = data.Candidate.Qualification.name
            const fieldOfStudy = data.Candidate.FieldOfStudy.name
            return (
                <React.Fragment>
                    <Grid item xs={1}>
                        <LocationOn color={'primary'} fontSize={'large'}/>
                    </Grid>
                    <Grid item xs={11} container alignItems={'center'}>
                        <Typography variant={'subtitle1'} style={{marginLeft: theme.spacing(0.5)}}>
                            {country + ', ' + city}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} container style={{marginTop: theme.spacing(1)}}>
                        <Grid item xs={1}>
                            <School color={'primary'} fontSize={'large'}/>
                        </Grid>
                        <Grid item xs={11} container alignItems={'center'}>
                            <Typography variant={'subtitle1'} style={{marginLeft: theme.spacing(0.5)}}>
                                {qualification + ', ' + fieldOfStudy}
                            </Typography>
                        </Grid>
                    </Grid>
                </React.Fragment>
            )
        }

        const Skills = () => {
            const skills = data.Candidate.Candidate_Skill_Junctions.map(skillObj => skillObj.Skill.name)
            return (
                <React.Fragment>
                    <Grid item xs={12} style={{marginTop: theme.spacing(6)}}>
                        <Typography variant={'h6'}>
                            Skills
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={{marginTop: theme.spacing(2)}}>
                        {skills.map(skill => (
                            <Chip
                                label={skill}
                                style={{marginLeft: theme.spacing(0.5), marginBottom: theme.spacing(0.5)}}
                            />
                        ))}
                    </Grid>
                </React.Fragment>
            )
        }

        const Certification = () => {
            const certifications = data.Candidate.certifications
            return (
                <React.Fragment>
                    <Grid item xs={12} container style={{marginTop: theme.spacing(4)}}>
                        <Typography variant={'h6'}>
                            Certifications
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <ul>
                            {certifications.map(cert => (
                                <li>{cert}</li>
                            ))}
                        </ul>
                    </Grid>
                </React.Fragment>
            )
        }

        const Experiences = () => {
            const experiences = data.Candidate.Experiences
            return (
                (
                    <React.Fragment>
                        <Grid item xs={12} container style={{marginTop: theme.spacing(3)}}>
                            <Typography variant={'h6'}>
                                Experiences
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <ul>
                                {experiences.map(exp => (
                                    <Fragment>
                                        <li key={exp.title}>{exp.title}</li>
                                        <ul>
                                            <li>
                                                <strong>Company: </strong> {exp.Company.name}
                                            </li>
                                            <li>
                                                <strong>From: </strong> {exp.from}
                                            </li>
                                            <li>
                                                <strong>To: </strong> {exp.to}
                                            </li>
                                            <li>
                                                <strong>Description: </strong> {exp.description}
                                            </li>
                                        </ul>
                                    </Fragment>
                                ))}
                            </ul>
                        </Grid>
                    </React.Fragment>
                )
            )
        }

        return (
            <React.Fragment>
                <LocComp/>
                <Skills/>
                {data.Candidate.certifications.length > 0 ? <Certification/> : null}
                <Experiences/>
            </React.Fragment>
        )
    }

    // Apollo: candidate details
    const {loading, error, data} = useQuery(CANDIDATE_DETAILS, {
        variables: {
            userPk: candidateInfo.id
        }
    })

    // If loading, return spinner
    if (loading) {
        return (
            <Grid item xs={12} container justify="center" alignItems="center" style={{marginTop: theme.spacing(4)}}>
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

    const firstName = data.Candidate.User.firstName
    return (
        <React.Fragment>
            <Grid container style={{padding: theme.spacing(2)}}>
                <Header/>
                <Body/>
            </Grid>
            <ShortlistDialog
                open={shortlistDialogOpen}
                handleClose={() => setShortlistDialogOpen(false)}
                name={firstName}
                matchPk={candidateInfo.matchPk}
            />
            <RejectDialog
                open={rejectDialogOpen}
                handleClose={() => setRejectDialogOpen(false)}
                name={firstName}
                matchPk={candidateInfo.matchPk}
            />
        </React.Fragment>
    )
}