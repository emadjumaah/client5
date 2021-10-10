import { gql } from "@apollo/client";

export default gql`
  query getDaysSales($qty: Int) {
    getDaysSales(qty: $qty) {
      ok
      error
      message
      data {
        _id
        amount
        count
        date
        day
        month
        year
      }
    }
  }
`;
