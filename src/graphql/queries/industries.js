import gql from "graphql-tag"

const INDUSTRIES = gql`
    query INDUSTRIES{
        Industry {
            id
            name
        }
    }
`


export default INDUSTRIES