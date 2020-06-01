import gql from "graphql-tag"

const MATCHES = gql`
    query MATCHES {
        Match(order_by: {createdAt: desc}) {
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