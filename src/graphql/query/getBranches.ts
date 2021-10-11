import { gql } from "@apollo/client";

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

        packType
        packName
        packStart
        packEnd
        packCost
        packQty

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
          lon
        }
        userId
        note

        createdAt
        updatedAt
      }
    }
  }
`;
