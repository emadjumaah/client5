/* eslint-disable import/no-anonymous-default-export */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../graphql';

export default () => {
  const [getDeparts, catpData]: any = useLazyQuery(getCategories);

  const [addCategory] = useMutation(createCategory, {
    refetchQueries: [{ query: getCategories }],
  });
  const [editCategory] = useMutation(updateCategory, {
    refetchQueries: [{ query: getCategories }],
  });
  const [removeCategory] = useMutation(deleteCategory, {
    refetchQueries: [{ query: getCategories }],
  });

  useEffect(() => {
    getDeparts();
  }, [getDeparts]);

  const categories = catpData?.data?.['getCategories']?.data || [];
  const refreshcategory = () => catpData?.refetch();

  return {
    categories,
    refreshcategory,
    addCategory,
    editCategory,
    removeCategory,
  };
};
