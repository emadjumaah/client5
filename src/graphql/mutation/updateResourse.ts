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
    $cost: Float
    $model: String
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
      cost: $cost
      model: $model
      type: $type
    ) {
      ok
      message
      data
      error
    }
  }
`;
