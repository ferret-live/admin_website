import gql from "graphql-tag"

const OPEN_JOB_POSTS = gql`
    query OPEN_JOB_POSTS(
        $employerPk: String!,
    ){
        OpenJobPost: JobPost(where: {employerPk: {_eq: $employerPk}, active: {_eq: true}}) {
            id
            title
            ShortlistedCount: Matches_aggregate(where: {employerActionPk: {_eq: 3}}) {
                aggregate {
                    count
                }
            }
            ApplicantCount: Matches_aggregate(where: {candidateActionPk: {_eq: 3}}) {
                aggregate {
                    count
                }
            }
            SavedCount: Matches_aggregate(where: {employerActionPk: {_eq: 2}}) {
                aggregate {
                    count
                }
            }
        }
    }
`


export default OPEN_JOB_POSTS