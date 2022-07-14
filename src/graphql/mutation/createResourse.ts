import { gql } from '@apollo/client';

export default gql`
  mutation createResourse(
    $branch: String
    $name: String
    $nameAr: String
    $color: String
    $resType: Int
    $department: DepartmentInput
    $retype: RetypeInput
    $info: String
    $documentNo: String
    $startDate: Date
    $endDate: Date
    $workId: String
    $licenseDate: String
    $photos: String
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
    createResourse(
      branch: $branch
      name: $name
      nameAr: $nameAr
      color: $color
      resType: $resType
      department: $department
      retype: $retype
      info: $info
      documentNo: $documentNo
      startDate: $startDate
      endDate: $endDate
      workId: $workId
      licenseDate: $licenseDate
      photos: $photos
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
