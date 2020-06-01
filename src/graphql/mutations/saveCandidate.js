import gql from "graphql-tag"

const SAVE_CANDIDATE = gql`
    mutation SAVE_CANDIDATE(
        $matchPk: Int!
    ){
        update_Match_by_pk(
            pk_columns: {id: $matchPk}, 
            _set: {employerActionPk: 2}
        ) {
            employerActionPk
        }
    }
`


export default SAVE_CANDIDATE