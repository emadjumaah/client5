import { gql } from '@apollo/client';

export default gql`
  query getLandingChartSales {
    getLandingChartSales {
      ok
      error
      message
      data
    }
  }
`;
