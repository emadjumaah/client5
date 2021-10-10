/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as check from "./roles";
import { getStoreItem } from "../store";

const {
  systems: { cal, pos, pur, exp },
} = check;
const store = getStoreItem("store");
const user = store?.user;

// const branch = Object.keys(user.roles)[0];
// const systems = Object.keys(user.roles[branch]);

// console.log("branch", branch);
// console.log("systems", systems);

export const roles = {
  isCalAdmin: () => check.isSystemAdmin(user, cal),
  isCalEditor: () => check.isSystemEditor(user, cal),
  isCalViewer: () => check.isSystemViewer(user, cal),

  isPOSAdmin: () => check.isSystemAdmin(user, pos),
  isPOSEditor: () => check.isSystemEditor(user, pos),
  isPOSViewer: () => check.isSystemViewer(user, pos),

  isPOSCalAdmin: () =>
    check.isSystemAdmin(user, pos) && check.isSystemAdmin(user, cal),
  isPOSCalEditor: () =>
    check.isSystemEditor(user, pos) && check.isSystemEditor(user, cal),
  isPOSCalViewer: () =>
    check.isSystemViewer(user, pos) && check.isSystemViewer(user, cal),

  isPurAdmin: () => check.isSystemAdmin(user, pur),
  isPurEditor: () => check.isSystemEditor(user, pur),
  isPurViewer: () => check.isSystemViewer(user, pur),

  isExpAdmin: () => check.isSystemAdmin(user, exp),
  isExpEditor: () => check.isSystemEditor(user, exp),
  isExpViewer: () => check.isSystemViewer(user, exp),

  isSystemAdmin: (sys: any) => check.isSystemAdmin(user, sys),
  isSystemEditor: (sys: any) => check.isSystemEditor(user, sys),
  isSystemViewer: (sys: any) => check.isSystemViewer(user, sys),

  isBranchAdmin: () => check.isBranchAdmin(user),
  isSuperAdmin: () => check.isSuperAdmin(user),
};
