import gql from "graphql-tag"

const INSERT_EMPLOYER = gql`
    mutation INSERT_EMPLOYER(
        $email: String!
        $firstName: String!,
        $lastName: String!,
        $phoneNumber: String!,
        $companyPk: Int!
    ) {
        insert_Employer(
            objects: {
                User: {
                    data: {
                        email: $email, 
                        firstName: $firstName,
                        lastName: $lastName,
                        phoneNumber: $phoneNumber
                    }
                }, 
                companyPk: $companyPk
            }
        ) {
            affected_rows
        }
    }
`


export default INSERT_EMPLOYER