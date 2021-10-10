import { gql } from "@apollo/client";

export default gql`
  query getProducts($isRTL: Boolean) {
    getProducts(isRTL: $isRTL) {
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
        qty
        price
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

        userId

        createdAt
        updatedAt
      }
    }
  }
`;
