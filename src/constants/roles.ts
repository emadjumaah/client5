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

export const packages = [
  {
    name: "basic",
    title: "Basic",
    eventsQty: 1500,
    durationQty: 1,
    durationType: "y",
    cost: 1000,
  },
  {
    name: "standard",
    title: "Standard",
    eventsQty: 4500,
    durationQty: 1,
    durationType: "y",
    cost: 1400,
  },
  {
    name: "premium",
    title: "Premium",
    eventsQty: 9000,
    durationQty: 1,
    durationType: "y",
    cost: 1800,
  },
];
