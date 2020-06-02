import {useTheme} from "@material-ui/styles";
import React, {Fragment} from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {LocationOn, School} from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import Chip from "@material-ui/core/Chip";
import {useQuery} from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import CANDIDATE from "../../graphql/queries/candidate";

const link_s3 = "https://getagig-customer-files.s3-ap-southeast-1.amazonaws.com/job-seekers/resumes/"
const link_extension = '.pdf'

export default function Candidate({candidatePk}) {
    // Styling
    const theme = useTheme()

    const Header = () => {
        const lastName = data.Candidate.User.lastName
        const age = data.Candidate.age
        const gender = data.Candidate.gender
        const singaporeResidentialStatus = data.Candidate.SingaporeResidentialStatus.name
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
                            {age + ', ' + gender + ', ' + singaporeResidentialStatus}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={{marginTop: theme.spacing(1.5)}}>
                        <Button
                            color={'primary'}
                            variant={'contained'}
                            style={{marginRight: theme.spacing(0.5)}}
                            href={link_s3 + candidatePk + link_extension}
                            target="_blank"
                        >
                            Resume
                        </Button>
                    </Grid>
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
                                                <strong>Company: </strong> {exp.companyName}
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
    const {loading, error, data} = useQuery(CANDIDATE, {
        variables: {
            userPk: candidatePk
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
        </React.Fragment>
    )
}