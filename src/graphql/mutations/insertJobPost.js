import gql from "graphql-tag"

const INSERT_JOB_POST = gql`
    mutation INSERT_JOB_POST(
        $currencyPk: Int!,
        $denominatorPk: Int!,
        $lowerBound: numeric!,
        $upperBound: numeric!,
        $certifications: _text!,
        $description: String!,
        $employerPk: String!,
        $experience: Int,
        $jobTypePk: Int!,
        $locationPk: Int!,
        $otherRequirements: _text!,
        $qualificationPk: Int!,
        $fieldOfStudyPk: Int,
        $remoteWorkAllowed: Boolean!
        $responsibilities: _text!,
        $shortlistEmail: String!,
        $title: String!,
        $skillPks: [JobPost_Skill_Junction_insert_input!]!
    ) {
        insert_JobPost(objects: {
            Compensation: {
                data: {
                    currencyPk: $currencyPk, 
                    denominatorPk: $denominatorPk, 
                    lowerBound: $lowerBound, 
                    upperBound: $upperBound
                }
            },             
            certifications: $certifications,
            description: $description, 
            employerPk: $employerPk, 
            experience: $experience, 
            jobTypePk: $jobTypePk, 
            locationPk: $locationPk, 
            otherRequirements: $otherRequirements, 
            qualificationPk: $qualificationPk,
            fieldOfStudyPk: $fieldOfStudyPk,
            remoteWorkAllowed: $remoteWorkAllowed, 
            responsibilities: $responsibilities, 
            shortlistEmail: $shortlistEmail, 
            title: $title,
            JobPost_Skill_Junctions: {
                data: $skillPks
            }
        }) {
            affected_rows
        }

    }
`


export default INSERT_JOB_POST