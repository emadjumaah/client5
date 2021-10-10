import { gql } from "@apollo/client";

export default gql`
  mutation updateEmployee(
    $_id: String
    $branch: String
    $name: String
    $nameAr: String
    $color: String
    $resKind: Int
    $resType: Int
    $department: DepartmentInput
    $comPercent: Float
    $phone: String
    $email: String
    $daysoff: String
    $info: String
    $documentNo: String
    $startDate: Date
    $endDate: Date
    $cost: Float
    $model: String
    $type: String
  ) {
    updateEmployee(
      _id: $_id
      branch: $branch
      name: $name
      nameAr: $nameAr
      color: $color
      resKind: $resKind
      resType: $resType
      department: $department
      comPercent: $comPercent
      phone: $phone
      email: $email
      daysoff: $daysoff
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
