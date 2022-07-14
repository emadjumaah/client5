/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { createBrand, deleteBrand, getBrands, updateBrand } from '../graphql';

export default () => {
  const [getDeparts, catpData]: any = useLazyQuery(getBrands);

  const [addBrand] = useMutation(createBrand, {
    refetchQueries: [{ query: getBrands }],
  });
  const [editBrand] = useMutation(updateBrand, {
    refetchQueries: [{ query: getBrands }],
  });
  const [removeBrand] = useMutation(deleteBrand, {
    refetchQueries: [{ query: getBrands }],
  });

  useEffect(() => {
    getDeparts();
  }, [getDeparts]);

  const brands = catpData?.data?.['getBrands']?.data || [];
  const refreshbrands = () => catpData?.refetch();
  return { brands, addBrand, editBrand, removeBrand, refreshbrands };
};
