import { gql } from "@apollo/client";

export default gql`
  query getLandingChartData {
    getLandingChartData {
      ok
      error
      message
      data
    }
  }
`;
