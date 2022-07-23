import { gql } from '@apollo/client';

export default gql`
  query getEmployees(
    $isRTL: Boolean
    $resType: Int
    $resKind: Int
    $departmentId: String
  ) {
    getEmployees(
      isRTL: $isRTL
      resType: $resType
      resKind: $resKind
      departmentId: $departmentId
    ) {
      ok
      error
      data {
        _id
        branch
        autoNo
        docNo
        name
        nameAr
        color
        resKind
        resType
        accountCode

        pId
        pIdDate
        workId
        telHome
        licenseNo
        licenseDate
        national
        nationalNo
        nationalDate
        avatar
        photos

        amount
        totalinvoiced
        totalDiscount
        totalPurchaseInvoiced
        totalPurchasePaid
        totalPurchaseDiscount
        toatlProdExpenses
        totalpaid
        toatlExpenses
        totalkaidsdebit
        totalKaidscredit
        totalPettyPay
        totalPettyRec
        totalAdvanceRec
        totalAdvancePay
        totalPettyExp
        progress
        evQty
        evDone

        phone
        email
        comPercent
        departmentId
        departmentName
        departmentNameAr
        departmentColor
        retypeId
        retypeName
        retypeNameAr
        retypeColor
        daysoff
        info
        userId

        documentNo
        startDate
        endDate
        cost
        model
        type

        createdAt
        updatedAt
      }
    }
  }
`;
