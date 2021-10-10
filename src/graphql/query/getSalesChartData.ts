import { gql } from "@apollo/client";

export default gql`
  query getSalesChartData(
    $itemId: String
    $categoryId: String
    $departmentId: String
    $employeeId: String
    $customerId: String
    $start: Date
    $end: Date
  ) {
    getSalesChartData(
      itemId: $itemId
      categoryId: $categoryId
      departmentId: $departmentId
      employeeId: $employeeId
      customerId: $customerId
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
