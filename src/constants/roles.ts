export const roles = [
  {
    branchName: { type: String },
    isBranchAdmin: { type: Boolean },
    systems: [
      {
        systemName: { type: String },
        isSystemAdmin: { type: Boolean },
        levels: {
          view: { type: Boolean },
          add: { type: Boolean },
          edit: { type: Boolean },
          delete: { type: Boolean },
          report: { type: Boolean },
        },
      },
    ],
  },
];

export const rolesExample = {
  branchs: [
    {
      name: "branch1",
      isAdmin: true,
      systems: [
        {
          name: "system1",
          isAdmin: true,
          levels: {
            view: true,
            add: true,
            edit: true,
            delete: true,
            report: true,
          },
        },
      ],
    },
  ],
};
