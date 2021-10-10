/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export const systems = {
  cal: "cal",
  pos: "pos",
  pur: "pur",
  exp: "exp",
  inv: "inv",
  hr: "hr",
  ass: "ass",
  acc: "acc",
};

export const roles = {
  view: "view",
  add: "add",
  edit: "edit",
  delete: "delete",
  report: "report",
};

// export const user: any = {
//   branch: 'brnach1',
//   isSuperAdmin: false,
//   roles: {
//     brnach1: {
//       admin: false,
//       pos: {
//         admin: false,
//         view: true,
//       },
//       cal: {
//         view: false,
//       },
//       exp: {
//         view: false,
//       },
//     },
//   },
// };

export const branchesToInitRoles = (branches: any) => {
  const rol = {};
  if (branches.length === 0) return rol;
  branches.map((branch: any) => {
    rol[branch.basename] = {};
    rol[branch.basename].admin = false;
    branch.systems.map((sys: any) => {
      rol[branch.basename][sys] = {};
      rol[branch.basename][sys].admin = false;
      rol[branch.basename][sys].delete = false;
      rol[branch.basename][sys].view = false;
    });
  });
  return rol;
};
export const branchesToEmptyRoles = (branches: any) => {
  const rol = {};
  if (branches.length === 0) return rol;
  branches.map((branch: any) => {
    rol[branch.basename] = {};
    branch.systems.map((sys: any) => {
      rol[branch.basename][sys] = {};
    });
  });
  return rol;
};
export const branchesToEmptyWithKeep = (branches: any, keep: any) => {
  const rol = {};
  if (branches.length === 0) return rol;
  branches.map((branch: any) => {
    if (branch.basename === keep) {
      rol[branch.basename] = {};
      branch.systems.map((sys: any) => {
        rol[branch.basename][sys] = {};
      });
    }
  });
  return rol;
};
export const branchesToEmptyBranchRoles = (branch: any) => {
  const rol = {};
  rol[branch.basename] = {};
  branch.systems.map((sys: any) => {
    rol[branch.basename][sys] = {};
  });

  return rol;
};

export const RolesToBrSy = (rols: any) => {
  let syss: any = [];
  const branches = Object.keys(rols);
  branches.map((branch: any) => {
    const asyss = Object.keys(rols[branch]);
    syss = asyss.filter((it: any) => it !== "admin");
  });
  return { branches, systems: syss };
};

export const removeFalsy = (obj: any) => {
  const newObj = {};
  Object.keys(obj).forEach((prop) => {
    if (obj[prop]) {
      newObj[prop] = obj[prop];
    }
  });
  return newObj;
};

// ==========================================

export const isSuperAdmin = (user: any) => {
  return user?.isSuperAdmin;
};

export const isBranchAdmin = (user: any) => {
  return user?.isSuperAdmin || user?.roles?.[user?.branch]?.admin;
};

export const isSystemAdmin = (user: any, system: string) => {
  return (
    user?.isSuperAdmin ||
    user?.roles?.[user?.branch]?.admin ||
    user?.roles?.[user.branch]?.[system]?.admin
  );
};

export const isReproter = (user: any, system: string) => {
  return (
    user?.isSuperAdmin ||
    user?.roles?.[user?.branch]?.admin ||
    user?.roles?.[user?.branch]?.[system]?.admin ||
    user?.roles?.[user?.branch]?.[system]?.[roles.report]
  );
};

export const isEditor = (user: any, system: string) => {
  return (
    user?.isSuperAdmin ||
    user?.roles?.[user?.branch]?.admin ||
    user?.roles?.[user?.branch]?.[system]?.admin ||
    user?.roles?.[user?.branch]?.[system]?.[roles.report] ||
    user?.roles?.[user?.branch]?.[system]?.[roles.edit]
  );
};
export const isSystemEditor = (user: any, system: string) => {
  return (
    user?.isSuperAdmin ||
    user?.roles?.[user?.branch]?.admin ||
    user?.roles?.[user?.branch]?.[system]?.admin ||
    user?.roles?.[user?.branch]?.[system]?.[roles.report] ||
    user?.roles?.[user?.branch]?.[system]?.[roles.edit]
  );
};

export const isAdder = (user: any, system: string) => {
  return (
    user?.isSuperAdmin ||
    user?.roles?.[user?.branch]?.admin ||
    user?.roles?.[user?.branch]?.[system]?.admin ||
    user?.roles?.[user?.branch]?.[system]?.[roles.report] ||
    user?.roles?.[user?.branch]?.[system]?.[roles.edit] ||
    user?.roles?.[user?.branch]?.[system]?.[roles.add]
  );
};

export const isViewer = (user: any, system: string) => {
  return (
    user?.isSuperAdmin ||
    user?.roles?.[user?.branch]?.admin ||
    user?.roles?.[user?.branch]?.[system]?.admin ||
    user?.roles?.[user?.branch]?.[system]?.[roles.report] ||
    user?.roles?.[user?.branch]?.[system]?.[roles.edit] ||
    user?.roles?.[user?.branch]?.[system]?.[roles.add] ||
    user?.roles?.[user?.branch]?.[system]?.[roles.view]
  );
};
export const isSystemViewer = (user: any, system: string) => {
  return (
    user?.isSuperAdmin ||
    user?.roles?.[user?.branch]?.admin ||
    user?.roles?.[user?.branch]?.[system]?.admin ||
    user?.roles?.[user?.branch]?.[system]?.[roles.report] ||
    user?.roles?.[user?.branch]?.[system]?.[roles.edit] ||
    user?.roles?.[user?.branch]?.[system]?.[roles.add] ||
    user?.roles?.[user?.branch]?.[system]?.[roles.view]
  );
};

// special
export const isSpesificBranchAdmin = (user: any, branch: string) => {
  return user?.isSuperAdmin || user?.roles?.[branch]?.admin;
};

// special
export const hasRole = (user: any, role: string, system: string) => {
  return (
    user?.isSuperAdmin ||
    user?.roles?.[user?.branch]?.admin ||
    user?.roles?.[user?.branch]?.[system]?.admin ||
    user?.roles?.[user?.branch]?.[system]?.[role]
  );
};

export const menuRoles = {
  superAdmin: "superAdmin",
  branchAdmin: "branchAdmin",
  calAdmin: "calAdmin",
  posAdmin: "posAdmin",
};

export const applyRole = (role: string, user: any) => {
  switch (role) {
    case menuRoles.superAdmin:
      return isSuperAdmin(user);
    case menuRoles.branchAdmin:
      return isBranchAdmin(user);
    case menuRoles.calAdmin:
      return isSystemAdmin(user, systems.cal);
    case menuRoles.posAdmin:
      return isSystemAdmin(user, systems.pos);

    default:
      return () => null;
  }
};
