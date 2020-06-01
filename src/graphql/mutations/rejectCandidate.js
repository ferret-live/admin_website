import gql from "graphql-tag"

const REJECT_CANDIDATE = gql`
    mutation REJECT_CANDIDATE(
        $matchPk: Int!
    ){
        update_Match_by_pk(
            pk_columns: {id: $matchPk},
            _set: {employerActionPk: 4}
        ) {
            employerActionPk
        }
    }
`


export default REJECT_CANDIDATE