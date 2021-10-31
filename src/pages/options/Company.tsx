/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { PopupTextField } from '../../Shared';
import { yupResolver } from '@hookform/resolvers/yup';
import { ImageOnlineUpload, uploadPhotoOnline } from '../../common/upload';
import Package from './Package';
import { useTemplate } from '../../hooks';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const calSchema = yup.object().shape({
  name: yup.string().required().min(3).max(100),
  nameAr: yup.string().required(),
  tel1: yup
    .string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required(),
});

const Company = ({ words, editCompany, company, isRTL }) => {
  const [logo, setLogo] = useState(undefined);
  const [active, setActive] = useState(false);

  const [iconimage, setIconimage] = useState(null);
  const [iconurl, setIconurl] = useState(null);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(calSchema),
    defaultValues: {
      name: company?.name,
      nameAr: company?.nameAr,
      tel1: company?.tel1,
      tel2: company?.tel2,
      fax: company?.fax,
      mob: company?.mob,
      email: company?.email,
      website: company?.website,
      address: company?.address,
    },
  });

  const { tempwords } = useTemplate();

  useEffect(() => {
    if (company?.logo) {
      setLogo(company?.logo);
      setIconurl(company?.logo);
    }
  }, [company]);

  const onSubmit = async (data: any) => {
    const name = data.name.trim();
    const nameAr = data.nameAr.trim();
    const { tel1, tel2, fax, mob, email, website, address } = data;
    let icon: any;
    if (iconimage) {
      icon = await uploadPhotoOnline(iconimage);
      icon = icon.replace('http://', 'https://');
    }
    const variables: any = {
      name,
      nameAr,
      tel1,
      tel2,
      fax,
      mob,
      email,
      website,
      address,
      logo: icon ? icon : logo,
    };

    await editCompany({ variables });
  };

  return (
    <Paper>
      <Box padding={2}>
        <Typography variant="h6">
          {isRTL ? 'معلوات الشركة' : 'Company Information'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            {isRTL && (
              <React.Fragment>
                <PopupTextField
                  required
                  name="nameAr"
                  label={words.name}
                  register={register}
                  errors={errors}
                  disabled={!active}
                />
                <PopupTextField
                  autoFocus
                  required
                  name="name"
                  ltr
                  label={words.nameEn}
                  register={register}
                  errors={errors}
                  disabled={!active}
                />
              </React.Fragment>
            )}
            {!isRTL && (
              <React.Fragment>
                <PopupTextField
                  autoFocus
                  required
                  name="name"
                  ltr
                  label={words.name}
                  register={register}
                  errors={errors}
                  disabled={!active}
                />
                <PopupTextField
                  required
                  name="nameAr"
                  label={words.nameAr}
                  register={register}
                  errors={errors}
                  disabled={!active}
                />
              </React.Fragment>
            )}
            <PopupTextField
              required
              name="tel1"
              label={words.phoneNumber}
              register={register}
              errors={errors}
              disabled={!active}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopupTextField
              name="fax"
              label={words.fax}
              register={register}
              errors={errors}
              disabled={!active}
            />
            <PopupTextField
              name="mob"
              label={words.mobile}
              register={register}
              errors={errors}
              disabled={!active}
            />
            <PopupTextField
              name="tel2"
              label={words.phone2}
              register={register}
              errors={errors}
              disabled={!active}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopupTextField
              name="email"
              label={words.email}
              register={register}
              errors={errors}
              disabled={!active}
            />
            <PopupTextField
              name="address"
              label={words.address}
              register={register}
              errors={errors}
              multiline
              rowsMax={4}
              rows={4}
              disabled={!active}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopupTextField
              name="website"
              label={words.website}
              register={register}
              errors={errors}
              disabled={!active}
            />

            <ImageOnlineUpload
              url={iconurl}
              setUrl={setIconurl}
              image={iconimage}
              setImage={setIconimage}
              width={300}
              height={150}
              size="400x200"
            ></ImageOnlineUpload>
          </Grid>
          <Grid item xs={8}>
            {company && (
              <Package
                tempwords={tempwords}
                company={company}
                isRTL={isRTL}
              ></Package>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 50,
              }}
            >
              <Button
                onClick={handleSubmit(onSubmit)}
                color="primary"
                variant="contained"
                disabled={!active}
                style={{
                  width: 90,
                  height: 34,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography>{words.save}</Typography>
              </Button>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={active}
                    onChange={(e: any) => setActive(e.target.checked)}
                    name="checkedB"
                    color="primary"
                  />
                }
                label={isRTL ? 'تفعيل التعديل' : 'Activate'}
              />
            </Box>
          </Grid>
          <Box
            display="flex"
            style={{
              flexDirection: 'row',
              direction: 'ltr',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              display="flex"
              style={{ flexDirection: 'row', direction: 'ltr' }}
            >
              <Box
                style={{
                  fontWeight: 'bold',
                  fontSize: 11,
                  color: '#ccc',
                  marginLeft: 10,
                  marginRight: 10,
                }}
              >
                App ID:
              </Box>
              <Box
                display="flex"
                style={{
                  fontWeight: 'bold',
                  fontSize: 11,
                  color: '#ccc',
                }}
              >
                {company?.appid}
              </Box>
            </Box>
            <Box
              display="flex"
              style={{
                fontWeight: 'bold',
                fontSize: 11,
                color: '#ccc',
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              {company?.appversion}
            </Box>
          </Box>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Company;
