import { gql } from "@apollo/client";

export default gql`
  mutation blockUser($_id: String, $block: Boolean) {
    blockUser(_id: $_id, block: $block) {
      ok
      message
      data
      error
    }
  }
`;
