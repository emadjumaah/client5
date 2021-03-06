import { gql } from '@apollo/client';

export default gql`
  query getReportServices(
    $types: [Int]
    $serviceIds: [String]
    $categoryIds: [String]
    $departmentIds: [String]
    $employeeIds: [String]
    $projectIds: [String]
    $resourseIds: [String]
    $customerIds: [String]
    $supplierIds: [String]
    $contractIds: [String]
    $start: Date
    $end: Date
    $itemType: Int
    $itemtypes: [Int]
  ) {
    getReportServices(
      types: $types
      serviceIds: $serviceIds
      categoryIds: $categoryIds
      departmentIds: $departmentIds
      employeeIds: $employeeIds
      projectIds: $projectIds
      resourseIds: $resourseIds
      customerIds: $customerIds
      supplierIds: $supplierIds
      contractIds: $contractIds
      start: $start
      end: $end
      itemType: $itemType
      itemtypes: $itemtypes
    ) {
      ok
      error
      message
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
        opTime
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
        customerId
        customerName
        customerNameAr

        supplierId
        supplierName
        supplierNameAr

        createdAt
        updatedAt
      }
    }
  }
`;
