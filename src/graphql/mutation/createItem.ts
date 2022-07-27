import { gql } from '@apollo/client';

export default gql`
  mutation createItem(
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
    createItem(
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
      category: $category
      brand: $brand
      isSalary: $isSalary
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
