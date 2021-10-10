import { gql } from "@apollo/client";

export default gql`
  query getSimpleChartsData($start: Date, $end: Date) {
    getSimpleChartsData(start: $start, end: $end) {
      ok
      accounts
      events {
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
      sales {
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
      }
      error
      message
    }
  }
`;
