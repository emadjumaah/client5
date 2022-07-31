import { gql } from '@apollo/client';

export default gql`
  mutation createNewEmployeeAccount($employeeId: String) {
    createNewEmployeeAccount(employeeId: $employeeId) {
      ok
      message
      data
      error
    }
  }
`;
