import gql from "graphql-tag"

const TOGGLE_MATCH_APPROVAL = gql`
    mutation TOGGLE_MATCH_APPROVAL(
        $approved: Boolean!, 
        $id: Int!
    ) {
        update_Match_by_pk(
            pk_columns: {id: $id}, 
            _set: {approved: $approved}
        ) {
            approved
        }
    }
`


export default TOGGLE_MATCH_APPROVAL