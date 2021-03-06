import { gql } from '@apollo/client';

export default gql`
  query getServices($isRTL: Boolean) {
    getServices(isRTL: $isRTL) {
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
