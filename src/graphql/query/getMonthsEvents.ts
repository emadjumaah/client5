import { gql } from "@apollo/client";

export default gql`
  query getMonthsEvents($qty: Int) {
    getMonthsEvents(qty: $qty) {
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
