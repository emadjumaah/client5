import { gql } from '@apollo/client';

export default gql`
  query getSalaryCalculation($employeeId: String, $start: Date, $end: Date) {
    getSalaryCalculation(employeeId: $employeeId, start: $start, end: $end) {
      ok
      error
      data
      message
    }
  }
`;
