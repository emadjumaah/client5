/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export const systems = {
  cal: 'cal',
  pos: 'pos',
  pur: 'pur',
  exp: 'exp',
  inv: 'inv',
  hr: 'hr',
  ass: 'ass',
  acc: 'acc',
};

export const roles = {
  view: 'view',
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  report: 'report',
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
    syss = asyss.filter((it: any) => it !== 'admin');
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
  return user?.isSuperAdmin || user?.isBranchAdmin;
};
export const isEmployee = (user: any) => {
  return user?.isEmployee;
};
export const isFinance = (user: any) => {
  return user?.isFinance;
};
export const isOperate = (user: any) => {
  return user?.isOperate;
};

export const isEditor = (user: any) => {
  return user?.isSuperAdmin || user?.isBranchAdmin || user?.isEditor;
};
export const isWriter = (user: any) => {
  return (
    user?.isSuperAdmin ||
    user?.isBranchAdmin ||
    user?.isEditor ||
    user?.isWriter
  );
};
export const isViewer = (user: any) => {
  return (
    user?.isSuperAdmin ||
    user?.isBranchAdmin ||
    user?.isEditor ||
    user?.isWriter ||
    user?.isViewer
  );
};

export const menuRoles = {
  superAdmin: 'superAdmin',
  branchAdmin: 'branchAdmin',
  editor: 'editor',
  writer: 'writer',
  viewer: 'viewer',
  finance: 'finance',
  operate: 'operate',
  employee: 'employee',
};

export const applyRole = (role: string, user: any) => {
  switch (role) {
    case menuRoles.superAdmin:
      return isSuperAdmin(user);
    case menuRoles.branchAdmin:
      return isBranchAdmin(user);
    case menuRoles.employee:
      return isEmployee(user);
    case menuRoles.finance:
      return isFinance(user);
    case menuRoles.operate:
      return isOperate(user);
    case menuRoles.editor:
      return isEditor(user);
    case menuRoles.writer:
      return isWriter(user);
    case menuRoles.viewer:
      return isViewer(user);

    default:
      return () => null;
  }
};
