import { gql } from '@apollo/client';

export default gql`
  subscription OnEventAdded() {
    commentAdded() {
      _id
      branch
      id
      title
      startDate
      endDate
      allDay
      reminder
      rRule
      exDate
      allowDrag

      autoNo
      docNo

      priority
      amount
      status

      customerId
      customerName
      customerNameAr
      customerPhone

      itemId
      itemName
      itemNameAr

      departmentId
      departmentName
      departmentNameAr
      departmentColor


      contractId
      contractName
      contractNameAr

      employeeId
      employeeName
      employeeNameAr
      employeeColor
      employeePhone

      createdAt
      updatedAt
    }
  }
`;
