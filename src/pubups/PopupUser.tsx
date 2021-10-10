/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useBranches } from "../hooks";
import {
  dublicateAlert,
  errorAlert,
  yup,
  PopupTextField,
  UserRoles,
} from "../Shared";
import { GContextTypes } from "../types";
import { GlobalContext } from "../contexts";
import { branchesToEmptyWithKeep, isBranchAdmin } from "../common/roles";
import { Box, Button, Typography } from "@material-ui/core";
import PopupLayout from "../pages/main/PopupLayout";
import { Grid } from "@material-ui/core";
import PopupPassword from "./PopupPassword";
import { errorAlertMsg } from "../Shared/helpers";

const PopupUser = ({
  open,
  onClose,
  row,
  isNew,
  applyChanges,
  addAction,
  editAction,
  theme,
  editPassword,
  block,
  brch,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: "", type: undefined });
  const [roles, setRoles] = useState({});
  const [blockUser, setBlockUser] = useState(false);

  const [openPass, setOpenPass] = useState(false);

  const { register, handleSubmit, errors, reset } = useForm(
    isNew ? yup.addUserResolver : yup.editUserResolver
  );
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);
  const isBA = isBranchAdmin(user);
  const { branches } = useBranches();
  const handleChangeRoles = ({ branch, system, role }: any) => {
    if (!branch) return;
    const rolesObj = { ...roles };

    if (branch && !system) {
      if (rolesObj[branch][role] === true) {
        delete rolesObj[branch][role];
      } else {
        rolesObj[branch][role] = true;
      }
    } else {
      if (rolesObj[branch][system][role] === true) {
        delete rolesObj[branch][system][role];
      } else {
        rolesObj[branch][system][role] = true;
      }
    }
    setRoles(rolesObj);
  };

  useEffect(() => {
    const rols = branchesToEmptyWithKeep(branches, brch);
    setRoles(rols);
  }, [open, brch]);

  useEffect(() => {
    if (row && row._id) {
      const rols = JSON.parse(row.roles);
      setRoles(rols);
      setBlockUser(row.block);
    }
  }, [open]);

  const onClosePass = () => setOpenPass(false);

  const onSubmit = async (data: any) => {
    if (user.isSuperAdmin !== true) {
      if (row.isSuperAdmin === true || row.isSuperAdmin === "true") {
        await errorAlertMsg(setAlrt, "You can't change this account");
        return;
      }
    }
    setSaving(true);
    applyChanges();
    const username = isNew ? data.username : row.username;
    const name = data.name.trim();
    const phone = data.phone;
    const password = data.password;
    const email = data.email;
    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      username,
      name,
      phone,
      email,
      password: isNew ? password : undefined,
      roles: JSON.stringify(roles),
      branch: brch,
      userId: user._id,
    };
    const mutate = isNew ? addAction : editAction;
    apply(mutate, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      mutate({ variables });
      setSaving(false);
      onFormClose();
    } catch (error) {
      onError(error);
    }
  };

  const onError = async (error: any) => {
    if (error.message.includes("duplicate")) {
      await dublicateAlert(setAlrt, isRTL);
    } else {
      await errorAlert(setAlrt, isRTL);
      reset();
      console.log(error);
    }
  };

  const onBlockUser = () => {
    const variables = {
      _id: row._id,
      block: !blockUser,
    };
    block({ variables });
  };

  const onFormClose = () => {
    reset();
    setRoles({});
    onClose();
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const title = isRTL
    ? isNew
      ? "اضافة مستخدم"
      : "تعديل بيانات مستخدم"
    : isNew
    ? "New User"
    : "Edit User";
  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onClose}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      mb={50}
      saving={saving}
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={9}>
          <PopupTextField
            autoFocus
            required
            name="username"
            label={words.username}
            register={register}
            errors={errors}
            row={row}
            disabled={!isNew}
          />
          {isNew && (
            <PopupTextField
              required
              name="password"
              label={words.password}
              register={register}
              errors={errors}
              row={row}
              type="password"
            />
          )}
          <PopupTextField
            required
            name="name"
            label={words.name}
            register={register}
            errors={errors}
            row={row}
          />
          <PopupTextField
            name="phone"
            label={words.phoneNumber}
            register={register}
            errors={errors}
            row={row}
          />
          <PopupTextField
            name="email"
            label={words.email}
            register={register}
            errors={errors}
            row={row}
          />
          <Box>
            <Typography variant="h6" style={{ marginTop: 10 }}>
              {isRTL ? "الصلاحيات" : "Roles"}
            </Typography>
          </Box>
          {branches && roles && (
            <UserRoles
              roles={roles}
              isRTL={isRTL}
              branches={branches}
              brch={brch}
              handleChangeRoles={handleChangeRoles}
            ></UserRoles>
          )}
          <Box
            display="flex"
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
            }}
          ></Box>
          <Box
            display="flex"
            style={{ alignItems: "center", justifyContent: "flex-end" }}
          >
            {!isNew && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpenPass(true)}
                style={{ marginLeft: 10, marginRight: 10 }}
              >
                {isRTL ? "تغيير كلمة المرور" : "Change Password"}
              </Button>
            )}
            {isBA && !row.isSuperAdmin && !isNew && (
              <Button
                color={blockUser ? "secondary" : "primary"}
                onClick={onBlockUser}
                variant="outlined"
              >
                {blockUser
                  ? isRTL
                    ? "تفعيل الحساب"
                    : "Unblock user"
                  : isRTL
                  ? "تعطيل الحساب"
                  : "Block user"}
              </Button>
            )}
          </Box>
        </Grid>
        <Grid item xs={2}></Grid>
        <PopupPassword
          open={openPass}
          onClose={onClosePass}
          row={row}
          editPassword={editPassword}
          theme={theme}
        ></PopupPassword>
      </Grid>
    </PopupLayout>
  );
};

export default PopupUser;
