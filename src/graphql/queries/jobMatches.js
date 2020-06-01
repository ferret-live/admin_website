import gql from "graphql-tag"

const JOB_MATCHES = gql`
    query JOB_MATCHES(
        $jobPostPk: Int!,
    ){
        Match(
            where: {
                approved: {_eq: true}, 
                jobPostPk: {_eq: $jobPostPk}, 
                candidateActionPk: {_in: [1, 2, 3]}, 
                employerActionPk: {_in: [1, 2]}
            }
        ) {
            id
            candidatePk
            candidateActionPk
            employerActionPk
            matchPercentage
            Candidate {
                User {
                    firstName
                    lastName
                }
            }
        }
    }
`


export default JOB_MATCHES