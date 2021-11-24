import { gql } from '@apollo/client';

export default gql`
  query getOoredooSMSlist {
    getOoredooSMSlist {
      ok
      error
      data
      message
    }
  }
`;
