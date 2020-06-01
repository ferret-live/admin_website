import gql from "graphql-tag"

const CANDIDATE_DETAILS = gql`
    query CANDIDATE_DETAILS(
        $userPk: String!,
    )  {
        Candidate: Candidate_by_pk(userPk: $userPk) {
            age
            gender
            singaporeResidentialStatus
            certifications
            Candidate_Skill_Junctions {
                Skill {
                    name
                }
            }
            Experiences {
                Company {
                    name
                    Industry {
                        name
                    }
                }
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
        }
    }
`


export default CANDIDATE_DETAILS