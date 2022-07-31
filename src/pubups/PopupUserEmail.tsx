/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { dublicateAlert, errorAlert, yup, PopupTextField } from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import { Box, Button } from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import PopupPassword from './PopupPassword';
import { errorAlertMsg } from '../Shared/helpers';
import UserRolesEmail from '../Shared/UserRolesEmail';
import { useLazyQuery } from '@apollo/client';
import checkUsername from '../graphql/query/checkUsername';
import { isValidEmail } from '../common/helpers';
import { TextFieldLocal } from '../components';
import _ from 'lodash';

const search = _.debounce(({ checkUser, username }) => {
  checkUser({ variables: { username } });
}, 300);

const PopupUserEmail = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  editAction,
  theme,
  editPassword,
  block,
  brch,
  employees,
  emplnoaccount,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [blockUser, setBlockUser] = useState(false);

  const [openPass, setOpenPass] = useState(false);

  const [isBranchAdmin, setisBranchAdmin] = useState(false);
  const [isEmployee, setisEmployee] = useState(false);
  const [isFinance, setisFinance] = useState(false);
  const [isOperate, setisOperate] = useState(false);
  const [isPurchase, setisPurchase] = useState(false);
  const [isAdmin, setisAdmin] = useState(false);
  const [isEditor, setisEditor] = useState(false);
  const [isWriter, setisWriter] = useState(false);
  const [isViewer, setisViewer] = useState(false);

  const [emplvalue, setEmplvalue] = useState<any>(null);

  const [username, setUsername] = useState(null);
  const [valid, setValid] = useState(null);
  const [checkUser, userData] = useLazyQuery(checkUsername);
  const { register, handleSubmit, errors, reset } = useForm(
    isNew ? yup.addUserResolver : undefined
  );
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const onUsernameChange = async (e: any) => {
    setUsername(e.target.value);
  };

  useEffect(() => {
    search({ checkUser, username });
  }, [username]);

  useEffect(() => {
    if (isNew) {
      if (userData?.data?.checkUsername?.ok && isValidEmail(username)) {
        setValid(true);
      } else {
        setValid(false);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (row && row._id) {
      setBlockUser(row.block);
      setisBranchAdmin(row.isBranchAdmin);
      setisEmployee(row.isEmployee);
      setisFinance(row.isFinance);
      setisOperate(row.isOperate);
      setisPurchase(row.isPurchase);
      setisAdmin(row.isAdmin);
      setisEditor(row.isEditor);
      setisWriter(row.isWriter);
      setisViewer(row.isViewer);
      if (row?.employeeId) {
        const dept = employees.filter(
          (dep: any) => dep._id === row?.employeeId
        )?.[0];
        setEmplvalue(dept);
      }
    }
  }, [open]);

  const onClosePass = () => setOpenPass(false);
  const onSubmit = async (data: any) => {
    if (isNew && !valid) {
      await errorAlertMsg(setAlrt, 'valid email require');
      return;
    }
    if (user.isSuperAdmin !== true) {
      if (row.isSuperAdmin === true || row.isSuperAdmin === 'true') {
        await errorAlertMsg(setAlrt, "You can't change this account");
        return;
      }
    }
    if (isEmployee && !emplvalue) {
      await errorAlertMsg(setAlrt, 'You have to choose an Employee');
      return;
    }
    setSaving(true);
    const name = data?.name;
    const phone = data?.phone;
    const password = data?.password;
    const fname = emplvalue && isEmployee ? emplvalue?.name : name;
    const fphone = emplvalue && isEmployee ? emplvalue?.phone : phone;
    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      username,
      name: fname,
      phone: fphone,
      password: isNew ? password : undefined,
      isBranchAdmin,
      isEmployee,
      isFinance,
      isOperate,
      isPurchase,
      isAdmin,
      isEditor,
      isWriter,
      isViewer,
      employee:
        emplvalue && isEmployee
          ? {
              employeeId: emplvalue._id,
              employeeName: emplvalue.name,
              employeeNameAr: emplvalue.nameAr,
              employeeColor: emplvalue.color,
              employeePhone: emplvalue.phone,
            }
          : {
              employeeId: undefined,
              employeeName: undefined,
              employeeNameAr: undefined,
              employeeColor: undefined,
              employeePhone: undefined,
            },
      branch: brch,
      userId: user._id,
    };
    const mutate = isNew ? addAction : editAction;
    apply(mutate, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      await mutate({ variables });
      onFormClose();
    } catch (error) {
      onError(error);
    }
  };

  const onError = async (error: any) => {
    if (error.message.includes('duplicate')) {
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
    setisBranchAdmin(false);
    setisEmployee(false);
    setisFinance(false);
    setisOperate(false);
    setisPurchase(false);
    setisAdmin(false);
    setisEditor(false);
    setisWriter(false);
    setisViewer(false);
    setEmplvalue(null);
    setUsername(null);
    setValid(null);
    setSaving(false);
    onClose();
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const title = isRTL
    ? isNew
      ? 'اضافة مستخدم'
      : 'تعديل بيانات مستخدم'
    : isNew
    ? 'New User'
    : 'Edit User';
  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onFormClose}
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
          <Box display="flex" style={{ flexDirection: 'row' }}>
            <TextFieldLocal
              autoFocus
              required
              name="username"
              label={words.email}
              value={username}
              onChange={onUsernameChange}
              row={row}
              disabled={!isNew}
              mb={5}
            />
            {isNew && (
              <Box
                style={{
                  marginTop: 15,
                  marginLeft: 10,
                  marginRight: 10,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: valid ? '#b6fcd5' : '#ffc0cb',
                }}
              ></Box>
            )}
          </Box>
          {isNew && (
            <Grid item xs={6}>
              <PopupTextField
                required
                name="password"
                label={words.password}
                register={register}
                errors={errors}
                row={row}
                type="password"
              />
            </Grid>
          )}
          {!isEmployee && (
            <PopupTextField
              required
              name="name"
              label={words.name}
              register={register}
              errors={errors}
              row={row}
            />
          )}
          {!isEmployee && (
            <PopupTextField
              name="phone"
              label={words.phoneNumber}
              register={register}
              errors={errors}
              row={row}
            />
          )}

          {user && (
            <UserRolesEmail
              isRTL={isRTL}
              branch={user?.branch}
              words={words}
              isBranchAdmin={isBranchAdmin}
              isEmployee={isEmployee}
              isFinance={isFinance}
              isOperate={isOperate}
              isPurchase={isPurchase}
              isAdmin={isAdmin}
              isEditor={isEditor}
              isWriter={isWriter}
              isViewer={isViewer}
              emplvalue={emplvalue}
              setisBranchAdmin={setisBranchAdmin}
              setisEmployee={setisEmployee}
              setisFinance={setisFinance}
              setisOperate={setisOperate}
              setisPurchase={setisPurchase}
              setisAdmin={setisAdmin}
              setisEditor={setisEditor}
              setisWriter={setisWriter}
              setisViewer={setisViewer}
              setEmplvalue={setEmplvalue}
              employees={emplnoaccount}
              isNew={isNew}
            ></UserRolesEmail>
          )}
          <Box
            display="flex"
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}
          ></Box>
          <Box
            display="flex"
            style={{ alignItems: 'center', justifyContent: 'flex-end' }}
          >
            {!isNew && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpenPass(true)}
                style={{ marginLeft: 10, marginRight: 10 }}
              >
                {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
              </Button>
            )}
            {!row.isBranchAdmin && !row.isSuperAdmin && !isNew && (
              <Button
                color={blockUser ? 'secondary' : 'primary'}
                onClick={onBlockUser}
                variant="outlined"
              >
                {blockUser
                  ? isRTL
                    ? 'تفعيل الحساب'
                    : 'Unblock user'
                  : isRTL
                  ? 'تعطيل الحساب'
                  : 'Block user'}
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

export default PopupUserEmail;
