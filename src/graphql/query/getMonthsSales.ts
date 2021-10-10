import { gql } from "@apollo/client";

export default gql`
  query getMonthsSales($qty: Int) {
    getMonthsSales(qty: $qty) {
      ok
      error
      message
      data {
        _id
        amount
        count
        date
        day
        month
        year
        departmentId
        departmentName
        departmentNameAr
        departmenColor
        employeeId
        employeeName
        employeeNameAr
        employeeColor
        statusAr
        statusEn
        status
      }
    }
  }
`;
