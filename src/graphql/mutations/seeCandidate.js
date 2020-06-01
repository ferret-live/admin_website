import gql from "graphql-tag"

const SEE_CANDIDATE = gql`
    mutation SEE_CANDIDATE(
        $matchPk: Int!
    ){
        update_Match_by_pk(
            pk_columns: {id: $matchPk}, 
            _set: {employerActionPk: 5}
        ) {
            employerActionPk
        }
    }
`


export default SEE_CANDIDATE