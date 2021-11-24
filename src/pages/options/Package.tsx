import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { covertToDate, quantityFormat } from '../../Shared/colorFormat';
import { packages } from '../../constants/roles';
export default function Package({ company, tempwords, isRTL }: any) {
  const pack = packages.filter((pa: any) => pa.name === company.packName)?.[0];
  return (
    <Box
      p={1}
      style={{
        flex: 1,
        backgroundColor: '#f5f5f5',
        height: 200,
        borderRadius: 10,
        padding: 20,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">
            {isRTL ? 'الإشتراك' : 'Subscription'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            style={{ color: '#8a2be2', fontWeight: 'bold' }}
            variant="subtitle1"
          >
            {isRTL ? pack?.titleAr : pack?.title}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Box
            display="flex"
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Typography>{covertToDate(company?.packEnd)}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={2}>
          <Box
            display="flex"
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="button">
              {isRTL ? 'مستخدمين' : 'Users'}
            </Typography>
            <Typography variant="button">
              {quantityFormat(company.usedUsers, isRTL)} /{' '}
              {quantityFormat(company.users, isRTL)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box
            display="flex"
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="button">{tempwords.appointments}</Typography>
            <Typography variant="button">
              {quantityFormat(company.usedEvents, isRTL)} /{' '}
              {quantityFormat(company.packQty, isRTL)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box
            display="flex"
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Typography variant="button">
              {isRTL ? 'وثائق' : 'Doocuments'}
            </Typography>
            <Typography variant="button">
              {quantityFormat(company.usedDocs, isRTL)} /{' '}
              {quantityFormat(company.packDocsQty, isRTL)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            display="flex"
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Typography variant="button">
              {isRTL ? 'رسائل SMS' : 'SMS'}
            </Typography>
            <Typography variant="button">
              {quantityFormat(company.smss, isRTL)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            display="flex"
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Typography variant="button">
              {isRTL ? 'رسائل Email' : 'Email'}
            </Typography>
            <Typography variant="button">
              {quantityFormat(company.emails, isRTL)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
