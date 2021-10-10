import { gql } from "@apollo/client";

export default gql`
  query getEventsInfo {
    getEventsInfo {
      ok
      error
      data
    }
  }
`;
