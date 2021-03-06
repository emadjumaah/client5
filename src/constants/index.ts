import { templates } from './templates';
import { mainmenu, emplmenu } from './menu';
import { colors, colorsList, colorsList2 } from './colors';
import { drawerWidth } from './sizes';
import { BUCKET, REGION, ACCESS_KEY_ID, SECRET_ACCESS_KEY } from './aws';
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

// demo
// export const graphqlURI = 'https://jadwaldemo.herokuapp.com/graphql';

// hilal
// export const graphqlURI = 'https://hilaleng.herokuapp.com/';

// Online
export const graphqlURI = process.env.REACT_APP_GRAPHQL_URI;

export const appversion = '1.4.2';
export {
  mainmenu,
  emplmenu,
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
  BUCKET,
  REGION,
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
};
