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
        backgroundColor: '#eaefee',
        height: 200,
        borderRadius: 5,
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
            style={{ alignItems: 'center', justifyContent: 'flex-end' }}
          >
            <Typography>{covertToDate(company?.packEnd)}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={4}>
          <Typography>
            {isRTL ? 'مستخدمين' : 'Users'} :{' '}
            {quantityFormat(company.usedUsers, isRTL)} /{' '}
            {quantityFormat(company.users, isRTL)}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Box
            display="flex"
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <Typography>
              {tempwords.appointments} :{' '}
              {quantityFormat(company.usedEvents, isRTL)} /{' '}
              {quantityFormat(company.packQty, isRTL)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            display="flex"
            style={{ alignItems: 'center', justifyContent: 'flex-end' }}
          >
            <Typography>
              {isRTL ? 'وثائق' : 'Doocuments'} :{' '}
              {quantityFormat(company.usedDocs, isRTL)} /{' '}
              {quantityFormat(company.packDocsQty, isRTL)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
