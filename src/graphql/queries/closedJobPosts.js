import gql from "graphql-tag"

const CLOSED_JOB_POSTS = gql`
    query CLOSED_JOB_POSTS(
        $employerPk: String!,
    ){
        ClosedJobPost: JobPost(where: {employerPk: {_eq: $employerPk}, active: {_eq: false}}) {
            id
            title
        }
    }
`


export default CLOSED_JOB_POSTS