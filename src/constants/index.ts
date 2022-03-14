import { mainmenu, emplmenu, addButtonsList } from './menu';
import { colors, colorsList, colorsList2 } from './colors';
import { drawerWidth } from './sizes';
import * as yup from './yupSchemas';
import {
  statusTypes,
  eventStatusEn,
  eventStatus,
  paymentTypes,
} from './datatypes';
import { operationTypes, catTypes } from './datatypes';

export const graphqlURI = 'http://jadwal-main/graphql';
// export const graphqlURI = 'http://jadwal-server/graphql';

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
};
