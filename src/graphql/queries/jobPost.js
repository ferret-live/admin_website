import gql from 'graphql-tag'

const JOB_POST = gql`
    query JOB_POST(
        $jobPostPk: Int!
    ) {
        JobPost(
            where: {
                id: {_eq: $jobPostPk}, 
                active: {_eq: true}
            }
        ) {
            Compensation {
                Currency {
                    name
                }
                Denominator {
                    name
                }
                lowerBound
                upperBound
            }
            Employer {
                Company {
                    name
                    url
                }
            }
            FieldOfStudy {
                name
            }
            Location {
                city
                country
                state
            }
            Qualification {
                name
            }
            JobPost_Skill_Junctions {
                Skill {
                    name
                }
            }
            JobType {
                name
            }
            certifications
            description
            duration
            experience
            otherRequirements
            remoteWorkAllowed
            responsibilities
            startDate
            title
        }
    }
`

export default JOB_POST