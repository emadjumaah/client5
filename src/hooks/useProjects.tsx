/* eslint-disable import/no-anonymous-default-export */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from '../graphql';

export default () => {
  const [getDeparts, depData]: any = useLazyQuery(getProjects);

  const [addProject] = useMutation(createProject, {
    refetchQueries: [{ query: getProjects }],
  });
  const [editProject] = useMutation(updateProject, {
    refetchQueries: [{ query: getProjects }],
  });
  const [removeProject] = useMutation(deleteProject, {
    refetchQueries: [{ query: getProjects }],
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
