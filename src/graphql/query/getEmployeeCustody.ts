import { gql } from '@apollo/client';

export default gql`
  query getEmployeeCustody($employeeId: String, $start: Date, $end: Date) {
    getEmployeeCustody(employeeId: $employeeId, start: $start, end: $end) {
      ok
      error
      count
      data {
        _id

        opId
        opType
        opTime
        opDocNo

        refNo
        refType

        supplierId
        supplierName
        supplierNameAr

        customerId
        customerName
        customerNameAr

        departmentId
        departmentName
        departmentNameAr

        employeeId
        employeeName
        employeeNameAr

        projectId
        projectName
        projectNameAr

        resourseId
        resourseName
        resourseNameAr

        contractId
        contractName
        contractNameAr

        categoryId
        categoryName
        categoryNameAr

        itemId
        itemName
        itemNameAr

        qty
        itemPrice

        eventId

        amount
        debit
        credit

        accName
        accNameAr
        accType
        kaidType

        opaccName
        opaccNameAr

        userId
        desc

        createdAt
        updatedAt
      }
    }
  }
`;
