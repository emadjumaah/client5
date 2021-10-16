/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
//TODO: not used
import { useEffect, useReducer } from 'react';
import { getStoreItem, setStoreItem, storeReducer, initStore } from '../store';
// @ts-ignore
const useStore = () => {
  const storeState = getStoreItem('store', initStore);
  const [store, dispatch] = useReducer(storeReducer, storeState);

  useEffect(() => {
    setStoreItem('store', store);
  }, [store]);
  return { store, dispatch };
};
export default useStore;
