import { gql } from '@apollo/client';

export default gql`
  query getTaskItems($contractId: String) {
    getTaskItems(contractId: $contractId) {
      ok
      error
      data {
        _id
        branch
        autoNo
        docNo
        indx
        itemId
        itemType
        itemBarcode
        itemName
        itemNameAr
        itemDesc
        itemDescPurchase
        itemSize
        itemWeight
        itemColor
        itemCost
        itemUnit
        itemPrice
        itemPhoto
        opId
        opType
        opDocNo
        eventId
        refNo
        refType
        qty
        doneQty
        totalCost
        total
        amount
        categoryId
        categoryName
        categoryNameAr
        brandId
        brandName
        brandNameAr
        departmentId
        departmentName
        departmentNameAr
        departmentColor
        employeeId
        employeeName
        employeeNameAr
        employeeColor
        employeePhone
        projectId
        projectName
        projectNameAr
        projectColor
        resourseId
        resourseName
        resourseNameAr
        resourseColor

        contractId
        contractName
        contractNameAr
        note
        createdAt
        updatedAt
      }
    }
  }
`;
