import { gql } from '@apollo/client';

export default gql`
  mutation createRetype(
    $branch: String
    $name: String
    $nameAr: String
    $reType: Int
    $desc: String
    $color: String
  ) {
    createRetype(
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
