import {useTheme} from "@material-ui/styles";
import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import {Bookmark, BookmarkBorder, Close, Done, HomeWork, LocalAtm, LocationOn, Schedule,} from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useMutation, useQuery} from "@apollo/react-hooks";
import Link from "@material-ui/core/Link";
import {NavLink} from "react-router-dom";
import JOB_POST from "../../graphql/queries/jobPost";

export default function JobPost({jobPostPk}) {
    // Style
    const theme = useTheme()

    const GenericHeader = () => {
        // State
        const [dialogOpen, setDialogOpen] = useState(false)

        const companyUrl = jobPostData.Employer.Company.url
        const title = jobPostData.title
        const companyName = jobPostData.Employer.Company.name

        return (
            <React.Fragment>
                <Grid item xs={12} container>
                    <Grid
                        container
                        direction="column"
                        alignContent={"flex-start"}
                        xs={12}
                        style={{height: "50px"}}
                    >
                        <Grid item xs={12}>
                            <Typography variant={"h4"}>{title}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={"subtitle1"} style={{color: "grey"}}>
                            <Link
                                href={companyUrl}
                                target="_blank"
                            >
                                {companyName}
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={12}
                    style={{marginTop: theme.spacing(4), marginBottom: theme.spacing(4)}}
                >
                    <Divider/>
                </Grid>
            </React.Fragment>
        )
    }

    const Body = () => {
        const LocComp = () => {
            const locationCity = jobPostData.Location.city
            const locationCountry = jobPostData.Location.country
            const compensationCurrency = jobPostData.Compensation.Currency.name
            const compensationDenominator = jobPostData.Compensation.Denominator.name
            const compensationLowerBound = jobPostData.Compensation.lowerBound
            const compensationUpperBound = jobPostData.Compensation.upperBound
            const jobType = jobPostData.JobType.name
            const remoteWorkAllowed = jobPostData.remoteWorkAllowed

            return (
                <React.Fragment>
                    <Grid item xs={1}>
                        <LocationOn color={"primary"} fontSize={"large"}/>
                    </Grid>
                    <Grid item xs={11} container alignItems={"center"}>
                        <Typography
                            variant={"subtitle1"}
                            style={{marginLeft: theme.spacing(0.5)}}
                        >
                            <strong>{locationCountry + ", " + locationCity}</strong>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} container style={{marginTop: theme.spacing(1)}}>
                        <Grid item xs={1}>
                            <LocalAtm color={"primary"} fontSize={"large"}/>
                        </Grid>
                        <Grid item xs={11} container alignItems={"center"}>
                            <Typography
                                variant={"subtitle1"}
                                style={{marginLeft: theme.spacing(0.5)}}
                            >
                                {compensationCurrency + " "}
                                <strong>
                                    {compensationLowerBound + " - " + compensationUpperBound}
                                </strong>
                                {" per "}
                                <strong>{compensationDenominator}</strong>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container style={{marginTop: theme.spacing(1)}}>
                        <Grid item xs={1}>
                            <Schedule color={"primary"} fontSize={"large"}/>
                        </Grid>
                        <Grid item xs={11} container alignItems={"center"}>
                            <Typography
                                variant={"subtitle1"}
                                style={{marginLeft: theme.spacing(0.5)}}
                            >
                                <strong>{jobType}</strong>
                            </Typography>
                        </Grid>
                    </Grid>
                    {remoteWorkAllowed ? (
                        <Grid item xs={12} container style={{marginTop: theme.spacing(1)}}>
                            <Grid item xs={1}>
                                <HomeWork color={"primary"} fontSize={"large"}/>
                            </Grid>
                            <Grid item xs={11} container alignItems={"center"}>
                                <Typography
                                    variant={"subtitle1"}
                                    style={{marginLeft: theme.spacing(0.5)}}
                                >
                                    <strong>Remote work allowed</strong>
                                </Typography>
                            </Grid>
                        </Grid>
                    ): null}
                </React.Fragment>
            )
        }

        const Description = () => {
            const description = jobPostData.description

            return (
                <React.Fragment>
                    <Grid item xs={12} style={{marginTop: theme.spacing(6)}}>
                        <Typography variant={"h6"}>Description</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {description}
                    </Grid>
                </React.Fragment>
            )
        }

        const Responsibilities = () => {
            const responsibilities = jobPostData.responsibilities

            return (
                <React.Fragment>
                    <Grid item xs={12} style={{marginTop: theme.spacing(4)}}>
                        <Typography variant={"h6"}>Responsibilities</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <ul>
                            {responsibilities.map((item) => (
                                <li>{item}</li>
                            ))}
                        </ul>
                    </Grid>
                </React.Fragment>
            );
        }

        const Skills = () => {
            const skills = jobPostData.JobPost_Skill_Junctions.map(obj => obj.Skill.name)

            return (
                <React.Fragment>
                    <Grid item xs={12} style={{marginTop: theme.spacing(4)}}>
                        <Typography variant={"h6"}>Skills</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <ul>
                            {skills.map(skill => (
                                <li>
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </Grid>
                </React.Fragment>
            );
        }

        const Experience = () => {
            const experience = jobPostData.experience

            return experience ? (
                <React.Fragment>
                    <Grid item xs={12} container style={{marginTop: theme.spacing(4)}}>
                        <Typography variant={"h6"}>Experience</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        Minimum <strong>{experience}</strong> years of experience required in relevant field
                    </Grid>
                </React.Fragment>
            ) : null
        }

        const Education = () => {
            const fieldOfStudy = jobPostData.FieldOfStudy
            const qualification = jobPostData.Qualification.name

            return (
                <React.Fragment>
                    <Grid item xs={12} container style={{marginTop: theme.spacing(4)}}>
                        <Typography variant={"h6"}>Education</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        Minimum <strong>{qualification}</strong> {fieldOfStudy
                            ? 'in ' + fieldOfStudy.name
                            : 'in any field'
                        }
                    </Grid>
                </React.Fragment>
            );
        }

        const Certifications = () => {
            const certifications = jobPostData.certifications

            return certifications && certifications.length > 0 ? (
                <React.Fragment>
                    <Grid item xs={12} container style={{marginTop: theme.spacing(4)}}>
                        <Typography variant={"h6"}>Certifications Required</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <ul>
                            {certifications.map(cert => (
                                <li>
                                    {cert} HI HI
                                </li>
                            ))}
                        </ul>
                    </Grid>
                </React.Fragment>
            ) : null
        }

        const Other = () => {
            const otherRequirements = jobPostData.otherRequirements

            return otherRequirements && otherRequirements.length > 0 ? (
                <React.Fragment>
                    <Grid item xs={12} container style={{marginTop: theme.spacing(4)}}>
                        <Typography variant={"h6"}>Other Requirements</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <ul>
                            {otherRequirements.map(req => (
                                <li>
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </Grid>
                </React.Fragment>
            ) : null
        }

        return (
            <React.Fragment>
                <LocComp/>
                <Description/>
                <Responsibilities/>
                <Skills/>
                <Experience/>
                <Education/>
                <Certifications/>
                <Other/>
            </React.Fragment>
        );
    };

    // Apollo: job post details
    const {loading: jobPostLoading, error: jobPostError, data: jobPostDataArray} = useQuery(JOB_POST, {
        variables: {
            jobPostPk
        }
    })

    // If loading, return spinner
    if (jobPostLoading) {
        return (
            <Grid item xs={12} container justify="center" alignItems="center">
                <CircularProgress/>
            </Grid>
        )
    }

    // If error, display it
    if (jobPostError) {
        return (
            <Grid item xs={12} container justify="center" alignItems="center">
                <Typography>
                    Error: {jobPostError.message}
                </Typography>
            </Grid>
        )
    }

    const jobPostData = jobPostDataArray.JobPost[0]
    return (
        <React.Fragment>
            <Grid container style={{padding: theme.spacing(2)}}>
                <GenericHeader/>
                <Body/>
            </Grid>
        </React.Fragment>
    );
}
