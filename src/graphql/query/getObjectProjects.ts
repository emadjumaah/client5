import { gql } from '@apollo/client';

export default gql`
  query getObjectProjects(
    $departmentId: String
    $employeeId: String
    $projectId: String
    $resourseId: String
    $customerId: String
    $status: Int
  ) {
    getObjectProjects(
      departmentId: $departmentId
      employeeId: $employeeId
      projectId: $projectId
      resourseId: $resourseId
      customerId: $customerId
      status: $status
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

        type
        start
        end
        location {
          lat
          lng
        }
        priority
        status

        desc
        amount
        totalinvoiced
        totalDiscount
        totalpaid
        toatlExpenses

        progress
        evQty
        evDone

        customerId
        customerName
        customerNameAr
        customerPhone

        departmentId
        departmentName
        departmentNameAr
        departmentColor

        employeeId
        employeeName
        employeeNameAr
        employeeColor
        employeePhone

        resourseId
        resourseName
        resourseNameAr
        resourseColor

        userId

        createdAt
        updatedAt
      }
    }
  }
`;
