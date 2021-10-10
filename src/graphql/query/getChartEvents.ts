import { gql } from "@apollo/client";

export default gql`
  query getChartEvents(
    $itemId: String
    $categoryId: String
    $departmentId: String
    $employeeId: String
    $customerId: String
    $status: Int
    $start: Date
    $end: Date
  ) {
    getChartEvents(
      itemId: $itemId
      categoryId: $categoryId
      departmentId: $departmentId
      employeeId: $employeeId
      customerId: $customerId
      status: $status
      start: $start
      end: $end
    ) {
      ok
      error
      message
      data
    }
  }
`;
