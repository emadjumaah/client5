import { gql } from "@apollo/client";

export default gql`
  query getDaysEvents($qty: Int) {
    getDaysEvents(qty: $qty) {
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
        statusAr
        statusEn
        status
      }
    }
  }
`;
