import { gql } from '@apollo/client';

export default gql`
  query getGroupContacts($groupId: String, $isRTL: Boolean) {
    getGroupContacts(groupId: $groupId, isRTL: $isRTL) {
      ok
      error
      data {
        _id
        name
        nameAr
        phone
        email
        groupIds
        customerId

        userId

        createdAt
        updatedAt
      }
    }
  }
`;
