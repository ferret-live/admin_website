import gql from "graphql-tag"

const POST_JOB_OPTIONS = gql`
    query POST_JOB_OPTIONS {
        JobType {
            id
            name
        }
        Skill {
            id
            name
        }
        Denominator {
            id
            name
        }
        Qualification {
            id
            name
        }
        FieldOfStudy {
            id
            name
        }
    }
`


export default POST_JOB_OPTIONS