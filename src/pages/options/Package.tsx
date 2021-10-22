import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { quantityFormat } from '../../Shared/colorFormat';
import { packages } from '../../constants/roles';
export default function Package({ company, isRTL }: any) {
  const pack = packages.filter((pa: any) => pa.name === company.packName)?.[0];
  return (
    <Box
      p={1}
      style={{
        flex: 1,
        backgroundColor: '#eaefee',
        height: 200,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="h5">
            {isRTL ? 'الإشتراك' : 'Subscriptin'}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="subtitle1">
            {isRTL ? pack?.titleAr : pack?.title}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            {isRTL ? 'المستخدمين' : 'Users'} :{' '}
            {quantityFormat(company.users, isRTL)}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            {isRTL ? 'المواعيد/أنشطة' : 'Activities'} :{' '}
            {quantityFormat(company.packQty, isRTL)}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            {isRTL ? 'الوثائق' : 'Doocuments'} :{' '}
            {quantityFormat(company.packDocsQty, isRTL)}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            {isRTL ? 'المستخدمين' : 'Users'} :{' '}
            {quantityFormat(company.usedUsers, isRTL)}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            {isRTL ? 'المواعيد/أنشطة' : 'Activities'} :{' '}
            {quantityFormat(company.usedEvents, isRTL)}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            {isRTL ? 'الوثائق' : 'Doocuments'} :{' '}
            {quantityFormat(company.usedDocs, isRTL)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
