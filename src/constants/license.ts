export const systems = {
  calendar: "calendar",
  pos: "pos",
  purchase: "purchase",
  expenses: "expenses",
  inventory: "inventory",
  hr: "hr",
  assets: "assets",
  gaccountant: "gaccountant",
};

export const licens = {
  licensId: { type: String },
  isValid: { type: Boolean },
  branches: { type: Number },
  users: { type: Number },
  branchs: [
    {
      branchId: { type: String },
      systems: [{ type: String }],
    },
  ],
};

export const licensExample = {
  licensId: "dsfasdfadfasdfad",
  isValid: true,
  branches: 2,
  users: 12,
  branchsSystems: [
    {
      licensBId: "asdfgasdfgasdfgasd",
      systems: [
        systems.calendar,
        systems.pos,
        systems.purchase,
        systems.expenses,
      ],
    },
    {
      licensBId: "sdsdewsdafweasadd",
      systems: [systems.calendar, systems.pos],
    },
  ],
};
