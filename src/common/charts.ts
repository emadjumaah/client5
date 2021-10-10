/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable array-callback-return */
export const objectFromList = (data: any) => {
  if (data) {
    const obj = {};
    data.map((item: any) => {
      const id = item._id ? item._id : item.id;
      obj[id] = item;
    });
    return obj;
  } else {
    return null;
  }
};
