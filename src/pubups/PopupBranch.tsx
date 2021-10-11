/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { errorAlert } from "../Shared";
import PopupLayout from "../pages/main/PopupLayout";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@material-ui/core";
import { packages } from "../constants/roles";
import { TextFieldLocal } from "../components";
import checkUsername from "../graphql/query/checkUsername";
import { useLazyQuery } from "@apollo/client";

const branchSchema = yup.object().shape({
  password: yup.string().required().min(3).max(100),
  name: yup.string().required().min(3).max(100),
  nameAr: yup.string().required().min(3).max(100),
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
  const [username, setUsername] = useState(null);
  const [valid, setValid] = useState(null);

  const { register, handleSubmit, errors, reset } = useForm(brandchResolver);
  const [checkUser, userData] = useLazyQuery(checkUsername);

  const onUsernameChange = async (e: any) => {
    setUsername(e.target.value);
    checkUser({ variables: { username: e.target.value } });
  };

  useEffect(() => {
    if (userData?.data?.checkUsername?.ok && username.length > 6) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [userData]);

  const onSubmit = async (data: any) => {
    if (!valid) {
      await errorAlert(setAlrt, isRTL);
      return;
    }
    if (!pack) {
      await errorAlert(setAlrt, isRTL);
      return;
    }

    const { name, nameAr, password, tel1, email } = data;
    const variables: any = {
      username,
      password,
      name,
      nameAr,
      tel1,
      email,
      users: 25,
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
    setUsername(null);
    setValid(null);
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
      onClose={closeForm}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      preventclose
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
          <Grid item xs={6}>
            <TextFieldLocal
              name="email"
              label={words.email}
              register={register}
              errors={errors}
              row={row}
              fullWidth
              margin={20}
              mb={0}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldLocal
              required
              name="username"
              label={words.username}
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
                backgroundColor: valid ? "#b6fcd5" : "#ffc0cb",
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
          <Grid item xs={12}>
            <Typography
              style={{ marginTop: 10, marginBottom: 20 }}
              variant="h5"
            >
              الاشتراكات
            </Typography>

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
                  <Card
                    style={{
                      minWidth: 150,
                      backgroundColor: selected ? "#b6fcd5" : "#eee",
                      cursor: "pointer",
                    }}
                    onClick={() => setPack(pk)}
                  >
                    <CardContent>
                      <Typography
                        style={{ marginBottom: 20 }}
                        variant="h5"
                        component="div"
                      >
                        {pk.title}
                      </Typography>
                      <Divider></Divider>

                      <Typography style={{ marginTop: 20 }} variant="subtitle1">
                        {pk.eventsQty} موعد
                      </Typography>
                      <Typography variant="subtitle1">
                        {pk.cost} ريال قطري
                      </Typography>
                    </CardContent>
                  </Card>
                  // <Box
                  //   style={{
                  //     alignItems: "center",
                  //     justifyContent: "center",
                  //     padding: 10,
                  //     margin: 10,
                  //     backgroundColor: selected ? "#66cccc" : "#eee",
                  //     borderRadius: 10,
                  //     cursor: "pointer",
                  //   }}
                  //   onClick={() => setPack(pk)}
                  // >
                  //   <Typography variant="h5">{pk.name}</Typography>
                  //   <Typography variant="subtitle1">
                  //     {pk.eventsQty} Events
                  //   </Typography>
                  //   <Typography variant="subtitle1">{pk.cost} QR</Typography>
                  // </Box>
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
