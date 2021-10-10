/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../graphql";
import { getStoreItem } from "../store";

export default () => {
  const store = getStoreItem("store");
  const { lang } = store;
  const isRTL = lang === "ar" ? true : false;
  const [getDeparts, catpData]: any = useLazyQuery(getCategories, {
    variables: { isRTL },
  });

  const [addCategory] = useMutation(createCategory, {
    refetchQueries: [{ query: getCategories, variables: { isRTL } }],
  });
  const [editCategory] = useMutation(updateCategory, {
    refetchQueries: [{ query: getCategories, variables: { isRTL } }],
  });
  const [removeCategory] = useMutation(deleteCategory, {
    refetchQueries: [{ query: getCategories, variables: { isRTL } }],
  });

  useEffect(() => {
    getDeparts();
  }, [getDeparts]);

  const categories = catpData?.data?.["getCategories"]?.data || [];
  const refreshcategory = () => catpData?.refetch();

  return {
    categories,
    refreshcategory,
    addCategory,
    editCategory,
    removeCategory,
  };
};
