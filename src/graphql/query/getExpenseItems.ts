import { gql } from '@apollo/client';

export default gql`
  query getExpenseItems($isRTL: Boolean) {
    getExpenseItems(isRTL: $isRTL) {
      ok
      error
      data {
        _id
        branch
        autoNo
        docNo
        itemType
        barcode

        name
        nameAr
        desc
        cost
        price
        unit
        photo
        isSalary

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

        resourseId
        resourseName
        resourseNameAr
        resourseColor

        userId
        createdAt
        updatedAt
      }
    }
  }
`;
