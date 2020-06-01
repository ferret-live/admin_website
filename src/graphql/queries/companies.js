import gql from "graphql-tag"

const COMPANIES = gql`
    query COMPANIES{
        Company {
            id
            name
        }
    }
`


export default COMPANIES