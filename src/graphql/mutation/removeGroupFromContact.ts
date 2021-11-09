import { gql } from '@apollo/client';

export default gql`
  mutation removeGroupFromContact($contactId: String, $groupId: String) {
    removeGroupFromContact(contactId: $contactId, groupId: $groupId) {
      ok
      message
      data
      error
    }
  }
`;
