import { gql } from '@apollo/client';
export default gql`
  query getReminderItems($opId: String) {
    getReminderItems(opId: $opId) {
      ok
      error
      count
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
        taskId
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
        note
        createdAt
        updatedAt
      }
    }
  }
`;