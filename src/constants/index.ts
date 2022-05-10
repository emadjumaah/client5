import { templates } from './templates';
import { mainmenu, emplmenu, addButtonsList } from './menu';
import { colors, colorsList, colorsList2 } from './colors';
import { drawerWidth } from './sizes';
import * as yup from './yupSchemas';
import {
  statusTypes,
  eventStatusEn,
  eventStatus,
  paymentTypes,
  carstatuss,
} from './datatypes';
import { operationTypes, catTypes } from './datatypes';
import { packages } from './roles';

// Dev
// export const graphqlURI = 'http://jadwal-server/graphql';
// dev online
// export const graphqlURI = 'https://jadwal-prod.herokuapp.com/graphql';

// Local
// export const graphqlURI = 'http://jadwal-main/graphql';

// Online
export const graphqlURI = process.env.REACT_APP_GRAPHQL_URI;

export {
  mainmenu,
  emplmenu,
  addButtonsList,
  catTypes,
  colors,
  colorsList,
  colorsList2,
  yup,
  drawerWidth,
  statusTypes,
  eventStatusEn,
  eventStatus,
  operationTypes,
  paymentTypes,
  templates,
  packages,
  carstatuss,
};
