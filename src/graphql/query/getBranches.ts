import { gql } from '@apollo/client';

export default gql`
  query getBranches {
    getBranches {
      ok
      error
      data {
        _id

        basename
        systems
        users

        pack
        packType
        packName
        packStart
        packEnd
        packCost
        packQty
        packDocsQty

        usedEvents
        usedDocs
        usedUsers
        smss
        tempId
        template

        name
        nameAr
        logo
        tel1
        tel2
        fax
        mob
        email
        website
        address
        poBox
        CR
        city
        country
        location {
          lat
          lng
        }
        userId
        note

        createdAt
        updatedAt
      }
    }
  }
`;
