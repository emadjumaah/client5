import { gql } from '@apollo/client';

export default gql`
  query getFileDatas {
    getFileDatas {
      ok
      error
      data {
        _id
        filename
        filetype
        onlinename
        url
        size
        opId
        itemId
        customerId
        supplierId
        departmentId
        employeeId
        projectId
        resourseId
        contractId
        reminderId
        userId

        createdAt
        updatedAt
      }
    }
  }
`;
