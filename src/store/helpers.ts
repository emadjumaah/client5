/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const setStoreItem = (name: string, value: any) => {
  if (!name) {
    return false;
  }
  if (value === null) {
    localStorage.removeItem(name);
    return true;
  }
  localStorage.setItem(name, JSON.stringify(value));
  return true;
};

export const getStoreItem = (name: string, defaultValue?: any) => {
  if (!name) {
    return null;
  }
  const value = localStorage.getItem(name);
  if (value) {
    return JSON.parse(value);
  } else {
    if (defaultValue) {
      const setdefaultValue = setStoreItem(name, defaultValue);
      if (setdefaultValue === true) {
        return defaultValue;
      }
    }
  }
  return null;
};
