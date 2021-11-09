import { gql } from '@apollo/client';

export default gql`
  mutation createGroup($name: String, $nameAr: String, $conttype: Int) {
    createGroup(name: $name, nameAr: $nameAr, conttype: $conttype) {
      ok
      message
      data
      error
    }
  }
`;
