import gql from "graphql-tag"

const CANDIDATE = gql`
    query CANDIDATE(
        $userPk: String!,
    )  {
        Candidate: Candidate_by_pk(userPk: $userPk) {
            age
            gender
            certifications
            Candidate_Skill_Junctions {
                Skill {
                    name
                }
            }
            Experiences {
                companyName
                description
                from
                to
                title
            }
            FieldOfStudy {
                name
            }
            Qualification {
                name
            }
            User {
                firstName
                lastName
            }
            Location {
                country
                city
                state
            }
            SingaporeResidentialStatus {
                name
            }
        }
    }
`


export default CANDIDATE