/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { createBrand, deleteBrand, getBrands, updateBrand } from '../graphql';
import { getStoreItem } from '../store';

export default () => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const isRTL = lang === 'ar' ? true : false;
  const [getDeparts, catpData]: any = useLazyQuery(getBrands, {
    variables: { isRTL },
  });

  const [addBrand] = useMutation(createBrand, {
    refetchQueries: [{ query: getBrands, variables: { isRTL } }],
  });
  const [editBrand] = useMutation(updateBrand, {
    refetchQueries: [{ query: getBrands, variables: { isRTL } }],
  });
  const [removeBrand] = useMutation(deleteBrand, {
    refetchQueries: [{ query: getBrands, variables: { isRTL } }],
  });

  useEffect(() => {
    getDeparts();
  }, [getDeparts]);

  const brands = catpData?.data?.['getBrands']?.data || [];
  const refreshbrands = () => catpData?.refetch();
  return { brands, addBrand, editBrand, removeBrand, refreshbrands };
};
