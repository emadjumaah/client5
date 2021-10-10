/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { errorAlert, PopupTextField } from "../Shared";
import PopupLayout from "../pages/main/PopupLayout";
import { Box, Grid, Typography } from "@material-ui/core";
import { packages } from "../constants/roles";

const branchSchema = yup.object().shape({
  username: yup.string().required().min(3).max(100),
  password: yup.string().required().min(3).max(100),
  name: yup.string().required().min(3).max(100),
  nameAr: yup.string(),
  users: yup.number().required().min(1),
});
export const brandchResolver = { resolver: yupResolver(branchSchema) };

const PopupBranch = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  isRTL,
  theme,
  words,
}: any) => {
  const [alrt, setAlrt] = useState({ show: false, msg: "", type: undefined });
  const [pack, setPack] = useState(null);

  const { register, handleSubmit, errors, reset } = useForm(brandchResolver);

  const onSubmit = async (data: any) => {
    if (!pack) {
      await errorAlert(setAlrt, isRTL);
      return;
    }

    const { name, nameAr, users, username, password } = data;
    const variables: any = {
      username,
      password,
      name,
      nameAr,
      users: Number(users),
      pack: JSON.stringify(pack),
    };
    apply(addAction, variables);
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
    if (error.message.includes("duplicate")) {
    } else {
      reset();
      console.log(error);
    }
  };

  const resetAll = () => {
    setPack(null);
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
      ? "اضافة شركة"
      : "تعديل الشركة"
    : isNew
    ? "New Company"
    : "Edit Company";

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onClose}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
    >
      <div style={{ padding: 10 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <PopupTextField
              required
              name="name"
              label={words.name}
              register={register}
              errors={errors}
              row={row}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <PopupTextField
              name="nameAr"
              label={words.nameAr}
              register={register}
              errors={errors}
              row={row}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <PopupTextField
              required
              name="users"
              label={isRTL ? "عدد المستخدمين" : "Users"}
              register={register}
              errors={errors}
              row={row}
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <PopupTextField
              name="username"
              label={words.username}
              register={register}
              errors={errors}
              row={row}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <PopupTextField
              name="password"
              label={words.password}
              register={register}
              errors={errors}
              row={row}
              type="password"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {packages.map((pk: any) => {
                const selected = pk?.name === pack?.name;
                return (
                  <Box
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 10,
                      margin: 10,
                      backgroundColor: selected ? "#66cccc" : "#eee",
                      borderRadius: 10,
                      cursor: "pointer",
                    }}
                    onClick={() => setPack(pk)}
                  >
                    <Typography variant="h5">{pk.name}</Typography>
                    <Typography variant="subtitle1">
                      {pk.eventsQty} Events
                    </Typography>
                    <Typography variant="subtitle1">{pk.cost} QR</Typography>
                  </Box>
                );
              })}
            </Box>
          </Grid>
        </Grid>
      </div>
    </PopupLayout>
  );
};

export default PopupBranch;
