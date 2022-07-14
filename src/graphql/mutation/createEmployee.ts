import { gql } from '@apollo/client';

export default gql`
  mutation createEmployee(
    $branch: String
    $name: String
    $nameAr: String
    $color: String
    $resKind: Int
    $resType: Int
    $department: DepartmentInput
    $retype: RetypeInput
    $comPercent: Float
    $phone: String
    $email: String
    $daysoff: String
    $pId: String
    $pIdDate: String
    $workId: String
    $telHome: String
    $licenseNo: String
    $licenseDate: String
    $national: String
    $nationalNo: String
    $nationalDate: String
    $photos: String
    $info: String
    $documentNo: String
    $startDate: Date
    $endDate: Date
    $cost: Float
    $model: String
    $type: String
  ) {
    createEmployee(
      branch: $branch
      name: $name
      nameAr: $nameAr
      color: $color
      resKind: $resKind
      resType: $resType
      department: $department
      retype: $retype
      comPercent: $comPercent
      phone: $phone
      email: $email
      daysoff: $daysoff
      pId: $pId
      pIdDate: $pIdDate
      workId: $workId
      telHome: $telHome
      licenseNo: $licenseNo
      licenseDate: $licenseDate
      national: $national
      nationalNo: $nationalNo
      nationalDate: $nationalDate
      photos: $photos
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
