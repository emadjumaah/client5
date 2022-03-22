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

// const roles = {
//   view: 'view',
//   add: 'add',
//   edit: 'edit',
//   delete: 'delete',
//   report: 'report',
// };

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
export const isAdmin = (user: any) => {
  return user?.isSuperAdmin || user?.isBranchAdmin || user?.isAdmin;
};
export const isEditor = (user: any) => {
  return (
    user?.isSuperAdmin || user?.isBranchAdmin || user?.isAdmin || user?.isEditor
  );
};
export const isWriter = (user: any) => {
  return (
    user?.isSuperAdmin ||
    user?.isBranchAdmin ||
    user?.isAdmin ||
    user?.isEditor ||
    user?.isWriter
  );
};
export const isViewer = (user: any) => {
  return (
    user?.isSuperAdmin ||
    user?.isBranchAdmin ||
    user?.isAdmin ||
    user?.isEditor ||
    user?.isWriter ||
    user?.isViewer
  );
};
export const isOperateViewer = (user: any) => {
  return (
    user?.isSuperAdmin ||
    user?.isBranchAdmin ||
    (user?.isOperate &&
      (user?.isAdmin || user?.isEditor || user?.isWriter || user?.isViewer))
  );
};
export const isOperateWriter = (user: any) => {
  return (
    user?.isSuperAdmin ||
    user?.isBranchAdmin ||
    (user?.isOperate && (user?.isAdmin || user?.isEditor || user?.isWriter))
  );
};
export const isOperateEditor = (user: any) => {
  return (
    user?.isSuperAdmin ||
    user?.isBranchAdmin ||
    (user?.isOperate && (user?.isAdmin || user?.isEditor))
  );
};
export const isOperateAdmin = (user: any) => {
  return (
    user?.isSuperAdmin ||
    user?.isBranchAdmin ||
    (user?.isOperate && user?.isAdmin)
  );
};
export const isFinanceViewer = (user: any) => {
  return (
    user?.isSuperAdmin ||
    user?.isBranchAdmin ||
    (user?.isFinance &&
      (user?.isAdmin || user?.isEditor || user?.isWriter || user?.isViewer))
  );
};
export const isFinanceWriter = (user: any) => {
  return (
    user?.isSuperAdmin ||
    user?.isBranchAdmin ||
    (user?.isFinance && (user?.isAdmin || user?.isEditor || user?.isWriter))
  );
};
export const isFinanceEditor = (user: any) => {
  return (
    user?.isSuperAdmin ||
    user?.isBranchAdmin ||
    (user?.isFinance && (user?.isAdmin || user?.isEditor))
  );
};
export const isFinanceAdmin = (user: any) => {
  return (
    user?.isSuperAdmin ||
    user?.isBranchAdmin ||
    (user?.isFinance && user?.isAdmin)
  );
};
export const isFinanceOperateViewer = (user: any) => {
  return (
    user?.isSuperAdmin ||
    user?.isBranchAdmin ||
    (user?.isFinance &&
      user?.isOperate &&
      (user?.isAdmin || user?.isEditor || user?.isWriter || user?.isViewer))
  );
};
export const isFinanceOperateWriter = (user: any) => {
  return (
    user?.isSuperAdmin ||
    user?.isBranchAdmin ||
    (user?.isFinance &&
      user?.isOperate &&
      (user?.isAdmin || user?.isEditor || user?.isWriter))
  );
};
export const isFinanceOperateEditor = (user: any) => {
  return (
    user?.isSuperAdmin ||
    user?.isBranchAdmin ||
    (user?.isFinance && user?.isOperate && (user?.isAdmin || user?.isEditor))
  );
};
export const isFinanceOperateAdmin = (user: any) => {
  return (
    user?.isSuperAdmin ||
    user?.isBranchAdmin ||
    (user?.isFinance && user?.isOperate && user?.isAdmin)
  );
};

export const menuRoles = {
  superAdmin: 'superAdmin',
  branchAdmin: 'branchAdmin',
  employee: 'employee',
  finance: 'finance',
  financeAdmin: 'financeAdmin',
  financeEditor: 'financeEditor',
  financeOperateAdmin: 'financeOperateAdmin',
  financeOperateEditor: 'financeOperateEditor',
  financeOperateWriter: 'financeOperateWriter',
  financeWriter: 'financeWriter',
  operate: 'operate',
  operateAdmin: 'operateAdmin',
  operateEditor: 'operateEditor',
  operateWriter: 'operateWriter',
  admin: 'admin',
  editor: 'editor',
  writer: 'writer',
  viewer: 'viewer',
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
    case menuRoles.financeAdmin:
      return isFinanceAdmin(user);
    case menuRoles.financeEditor:
      return isFinanceEditor(user);
    case menuRoles.financeWriter:
      return isFinanceWriter(user);
    case menuRoles.operate:
      return isOperate(user);
    case menuRoles.operateAdmin:
      return isOperateAdmin(user);
    case menuRoles.operateEditor:
      return isOperateEditor(user);
    case menuRoles.operateWriter:
      return isOperateWriter(user);
    case menuRoles.financeOperateAdmin:
      return isFinanceOperateAdmin(user);
    case menuRoles.financeOperateEditor:
      return isFinanceOperateEditor(user);
    case menuRoles.financeOperateWriter:
      return isFinanceOperateWriter(user);
    case menuRoles.editor:
      return isEditor(user);
    case menuRoles.admin:
      return isAdmin(user);
    case menuRoles.writer:
      return isWriter(user);
    case menuRoles.viewer:
      return isViewer(user);

    default:
      return () => null;
  }
};
