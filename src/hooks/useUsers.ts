/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";
import {
  getUsers,
  signup,
  updateUser,
  deleteUser,
  changePassword,
  blockUser,
} from "../graphql";

export default () => {
  const [getUsrs, usrData]: any = useLazyQuery(getUsers);

  const [addUser] = useMutation(signup, {
    refetchQueries: [{ query: getUsers }],
  });
  const [editUser] = useMutation(updateUser, {
    refetchQueries: [{ query: getUsers }],
  });
  const [editPassword] = useMutation(changePassword, {
    refetchQueries: [{ query: getUsers }],
  });
  const [block] = useMutation(blockUser, {
    refetchQueries: [{ query: getUsers }],
  });
  const [removeUser] = useMutation(deleteUser, {
    refetchQueries: [{ query: getUsers }],
  });

  useEffect(() => {
    getUsrs();
  }, [getUsrs]);

  const users = usrData?.data?.["getUsers"]?.data || [];
  const refreshuser = () => usrData?.refetch();

  return {
    users,
    refreshuser,
    addUser,
    editUser,
    removeUser,
    editPassword,
    block,
  };
};
