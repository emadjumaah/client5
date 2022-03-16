import { gql } from '@apollo/client';

export default gql`
  mutation updateResourse(
    $_id: String
    $branch: String
    $name: String
    $nameAr: String
    $color: String
    $resType: Int
    $department: DepartmentInput
    $info: String
    $documentNo: String
    $startDate: Date
    $endDate: Date
    $brand: String
    $plate: String
    $cost: Float
    $model: String
    $purtime: String
    $type: String
  ) {
    updateResourse(
      _id: $_id
      branch: $branch
      name: $name
      nameAr: $nameAr
      color: $color
      resType: $resType
      department: $department
      info: $info
      documentNo: $documentNo
      startDate: $startDate
      endDate: $endDate
      brand: $brand
      plate: $plate
      cost: $cost
      model: $model
      purtime: $purtime
      type: $type
    ) {
      ok
      message
      data
      error
    }
  }
`;
