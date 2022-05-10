import { gql } from '@apollo/client';

export default gql`
  query getTrialBalance($parentcodes: [Int], $start: Date, $end: Date) {
    getTrialBalance(parentcodes: $parentcodes, start: $start, end: $end) {
      ok
      error
      data
    }
  }
`;
