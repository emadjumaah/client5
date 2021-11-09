import { gql } from '@apollo/client';

export default gql`
  mutation updateGroup(
    $_id: String
    $name: String
    $nameAr: String
    $conttype: Int
  ) {
    updateGroup(_id: $_id, name: $name, nameAr: $nameAr, conttype: $conttype) {
      ok
      message
      data
      error
    }
  }
`;
