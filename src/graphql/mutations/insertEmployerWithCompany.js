import gql from "graphql-tag"

const INSERT_EMPLOYER_WITH_COMPANY = gql`
    mutation INSERT_EMPLOYER_WITH_COMPANY(
        $email: String!
        $firstName: String!,
        $lastName: String!,
        $phoneNumber: String!,
        $companyName: String!,
        $companyUrl: String!,
        $companyIndustryPk: Int!
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
                Company: {
                    data: {
                        name: $companyName,
                        url: $companyUrl,
                        industryPk: $companyIndustryPk
                    }
                }
            }
        ) {
            affected_rows
        }
    }
`

export default INSERT_EMPLOYER_WITH_COMPANY