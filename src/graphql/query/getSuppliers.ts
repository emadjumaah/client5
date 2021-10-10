import { gql } from "@apollo/client";

export default gql`
  query getSuppliers($isRTL: Boolean) {
    getSuppliers(isRTL: $isRTL) {
      ok
      error
      data {
        _id
        branch
        autoNo
        docNo
        name
        nameAr
        phone

        email

        employeeId
        employeeName
        employeeNameAr
        employeeColor
        employeePhone

        userId

        createdAt
        updatedAt
      }
    }
  }
`;
