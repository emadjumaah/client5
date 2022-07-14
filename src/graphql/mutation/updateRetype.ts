import { gql } from '@apollo/client';

export default gql`
  mutation updateRetype(
    $_id: String
    $branch: String
    $name: String
    $nameAr: String
    $reType: Int
    $desc: String
    $color: String
  ) {
    updateRetype(
      _id: $_id
      branch: $branch
      name: $name
      nameAr: $nameAr
      reType: $reType
      desc: $desc
      color: $color
    ) {
      ok
      message
      data
      error
    }
  }
`;
