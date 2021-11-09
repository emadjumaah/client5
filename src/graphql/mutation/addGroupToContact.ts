import { gql } from '@apollo/client';

export default gql`
  mutation addGroupToContact($contactId: String, $groupId: String) {
    addGroupToContact(contactId: $contactId, groupId: $groupId) {
      ok
      message
      data
      error
    }
  }
`;
