import gql from "graphql-tag"

const MATCHES = gql`
    query MATCHES {
        Match(order_by: {approved: asc, id: desc}) {
            EmployerMatchAction: matchActionByEmployeractionpk {
                name
            }
            CandidateMatchAction: MatchAction {
                name
            }
            id
            approved
            matchPercentage
            jobPostPk
            candidatePk
        }
    }
`


export default MATCHES