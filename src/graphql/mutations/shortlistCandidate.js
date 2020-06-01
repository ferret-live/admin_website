import gql from "graphql-tag"

const SHORTLIST_CANDIDATE = gql`
    mutation SHORTLIST_CANDIDATE(
        $matchPk: Int!
    ){
        update_Match_by_pk(
            pk_columns: {id: $matchPk},
            _set: {employerActionPk: 3}
        ) {
            employerActionPk
        }
    }
`


export default SHORTLIST_CANDIDATE