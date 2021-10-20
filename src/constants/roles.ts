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
      name: 'branch1',
      isAdmin: true,
      systems: [
        {
          name: 'system1',
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
    name: 'free',
    title: 'Free',
    eventsQty: 100,
    durationQty: -1,
    docsQty: 500,
    cost: 0,
    users: 1,
  },
  {
    name: 'basic',
    title: 'Basic',
    eventsQty: 1500,
    docsQty: 5000,
    durationQty: 1,
    durationType: 'y',
    cost: 1000,
    users: 3,
  },
  {
    name: 'standard',
    title: 'Standard',
    eventsQty: 4500,
    docsQty: 15000,
    durationQty: 1,
    durationType: 'y',
    cost: 1400,
    users: 10,
  },
  {
    name: 'premium',
    title: 'Premium',
    eventsQty: 9000,
    docsQty: -1,
    durationQty: 1,
    durationType: 'y',
    cost: 1800,
    users: 20,
  },
];
