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
    $insurance: String
    $type: String
    $carstatus: Int
    $garage: String
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
      insurance: $insurance
      type: $type
      carstatus: $carstatus
      garage: $garage
    ) {
      ok
      message
      data
      error
    }
  }
`;
