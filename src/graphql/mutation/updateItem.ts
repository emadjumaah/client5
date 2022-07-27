import { gql } from '@apollo/client';

export default gql`
  mutation updateItem(
    $_id: String
    $branch: String
    $itemType: Int
    $barcode: String
    $name: String
    $nameAr: String
    $desc: String
    $photo: String
    $cost: Float
    $price: Float
    $unit: String
    $isSalary: Boolean
    $category: CategoryInput
    $brand: BrandInput
    $employee: EmployeeInput
    $resourse: ResourseInput
    $department: DepartmentInput
  ) {
    updateItem(
      _id: $_id
      branch: $branch
      itemType: $itemType
      barcode: $barcode
      name: $name
      nameAr: $nameAr
      desc: $desc
      photo: $photo
      cost: $cost
      price: $price
      unit: $unit
      isSalary: $isSalary
      category: $category
      brand: $brand
      employee: $employee
      resourse: $resourse
      department: $department
    ) {
      ok
      message
      data
      error
    }
  }
`;
