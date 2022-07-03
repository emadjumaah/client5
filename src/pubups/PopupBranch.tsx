/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import PopupLayout from '../pages/main/PopupLayout';
import { Box, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { templates } from '../constants';
import { TextFieldLocal } from '../components';
import checkUsername from '../graphql/query/checkUsername';
import { useLazyQuery } from '@apollo/client';
import _ from 'lodash';
import { isValidEmail } from '../common/helpers';
import { errorAlertMsg } from '../Shared/helpers';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';

const search = _.debounce(({ checkUser, username }) => {
  checkUser({ variables: { username } });
}, 300);

const branchSchema = yup.object().shape({
  password: yup.string().required().min(3).max(100),
  name: yup.string().required().min(3).max(100),
  nameAr: yup.string().required().min(3).max(100),
});

const PopupBranch = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  editAction,
  isRTL,
  theme,
  words,
}: any) => {
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [temp, setTemp] = useState(null);
  const [username, setUsername] = useState(null);
  const [valid, setValid] = useState(null);

  const brandchResolver = { resolver: yupResolver(branchSchema) };

  const { register, handleSubmit, errors, reset } = useForm(
    isNew ? brandchResolver : undefined
  );
  const [checkUser, userData] = useLazyQuery(checkUsername);

  const { dispatch }: GContextTypes = useContext(GlobalContext);

  useEffect(() => {
    if (row && row._id) {
      if (row?.template) {
        setTemp(JSON.parse(row?.template));
      }
    }
  }, [row]);

  useEffect(() => {
    search({ checkUser, username });
  }, [username]);

  useEffect(() => {
    if (userData?.data?.checkUsername?.ok && isValidEmail(username)) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [userData]);

  const onUsernameChange = async (e: any) => {
    setUsername(e.target.value);
  };

  const onSubmit = async (data: any) => {
    if (isNew && !valid) {
      await errorAlertMsg(setAlrt, 'valid email require');
      return;
    }
    if (!temp) {
      await errorAlertMsg(setAlrt, 'template required');
      return;
    }

    const { name, nameAr, password, tel1 } = data;
    const variables: any = isNew
      ? {
          username,
          password,
          name,
          nameAr,
          tel1,
          temp: JSON.stringify(temp),
        }
      : {
          _id: row._id,
          name,
          nameAr,
          tel1,
          temp: JSON.stringify(temp),
        };
    const mutate = isNew ? addAction : editAction;
    apply(mutate, variables);
    dispatch({
      type: 'setTemplate',
      payload: { template: temp, tempId: temp?.id },
    });

    // window.location.reload();
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      await mutate({ variables });

      closeForm();
    } catch (error) {
      onError(error);
    }
  };

  const onError = async (error: any) => {
    if (error.message.includes('duplicate')) {
    } else {
      reset();
      console.log(error);
    }
  };

  const resetAll = () => {
    setUsername(null);
    setValid(null);
    setTemp(null);
    reset();
  };

  const closeForm = () => {
    resetAll();
    onClose();
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };

  const title = isRTL
    ? isNew
      ? 'اضافة شركة'
      : 'تعديل الشركة'
    : isNew
    ? 'New Company'
    : 'Edit Company';

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={closeForm}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      preventclose
      maxWidth="md"
    >
      <div style={{ padding: 10 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextFieldLocal
              required
              name="nameAr"
              label={words.name}
              register={register}
              errors={errors}
              row={row}
              fullWidth
              mb={0}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldLocal
              required
              name="name"
              ltr
              label={words.nameEn}
              register={register}
              errors={errors}
              row={row}
              fullWidth
              mb={0}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldLocal
              name="tel1"
              label={words.phoneNumber}
              register={register}
              errors={errors}
              row={row}
              fullWidth
              margin={20}
              mb={0}
            />
          </Grid>

          <Grid item xs={6}></Grid>
          {isNew && (
            <>
              <Grid item xs={6}>
                <TextFieldLocal
                  required
                  name="username"
                  label={words.email}
                  value={username}
                  onChange={onUsernameChange}
                  errors={errors}
                  row={row}
                  fullWidth
                  mb={0}
                />
              </Grid>

              <Grid item xs={6}>
                <Box
                  style={{
                    marginTop: 15,
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: valid ? '#b6fcd5' : '#ffc0cb',
                  }}
                ></Box>
              </Grid>
              <Grid item xs={6}>
                <TextFieldLocal
                  required
                  name="password"
                  label={words.password}
                  register={register}
                  errors={errors}
                  row={row}
                  type="password"
                  fullWidth
                  mb={0}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Typography
              style={{ marginTop: 10, marginBottom: 20 }}
              variant="h5"
            >
              {isRTL ? 'النماذج' : 'Templates'}
            </Typography>
          </Grid>

          {templates.map((tm: any) => {
            const selected = tm?.title === temp?.title;
            return (
              <Grid item xs={3}>
                <Card
                  style={{
                    backgroundColor: selected ? '#b6fcd5' : '#f5f5f5',
                    cursor: 'pointer',
                    height: 100,
                  }}
                  onClick={() => setTemp(tm)}
                >
                  <CardContent>
                    <Typography
                      style={{ marginBottom: 20, fontWeight: 'bold' }}
                      variant="subtitle1"
                      component="div"
                    >
                      {isRTL ? tm.nameAr : tm.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </PopupLayout>
  );
};

export default PopupBranch;
