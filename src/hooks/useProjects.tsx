/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from '../graphql';
import { getStoreItem } from '../store';

export default () => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const isRTL = lang === 'ar' ? true : false;
  const [getDeparts, depData]: any = useLazyQuery(getProjects, {
    variables: { isRTL, depType: 2 },
  });

  const [addProject] = useMutation(createProject, {
    refetchQueries: [{ query: getProjects, variables: { isRTL } }],
  });
  const [editProject] = useMutation(updateProject, {
    refetchQueries: [{ query: getProjects, variables: { isRTL } }],
  });
  const [removeProject] = useMutation(deleteProject, {
    refetchQueries: [{ query: getProjects, variables: { isRTL } }],
  });

  useEffect(() => {
    getDeparts();
  }, [getDeparts]);

  const projects = depData?.data?.['getProjects']?.data || [];
  const refreshproject = () => depData?.refetch();
  return {
    projects,
    refreshproject,
    addProject,
    editProject,
    removeProject,
  };
};
