import gql from "graphql-tag"

const UPDATE_MATCH_PERCENTAGE = gql`
    mutation UPDATE_MATCH_PERCENTAGE(
        $id: Int!,
        $matchPercentage: float8!
    ) {
        update_Match_by_pk(
            pk_columns: {id: $id},
            _set: {matchPercentage: $matchPercentage}
        ) {
            matchPercentage
        }
    }
`


export default UPDATE_MATCH_PERCENTAGE