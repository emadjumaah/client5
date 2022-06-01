import { gql } from '@apollo/client';

export default gql`
  mutation updateUserTheme($themeId: Int) {
    updateUserTheme(themeId: $themeId) {
      ok
      message
      data
      error
    }
  }
`;
