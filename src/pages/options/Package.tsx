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
        padding: 10,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="h5">
            {isRTL ? 'الإشتراك' : 'Subscriptin'}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography
            style={{ color: '#8a2be2', fontWeight: 'bold' }}
            variant="subtitle1"
          >
            {isRTL ? pack?.titleAr : pack?.title}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>{isRTL ? 'من تاريخ' : 'From'}</Typography>
          <Typography>{covertToDate(company?.packStart)}</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography>{isRTL ? 'الى تاريخ' : 'To'}</Typography>
          <Typography>{covertToDate(company?.packEnd)}</Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography>
            {isRTL ? 'مستخدمين' : 'Users'} :{' '}
            {quantityFormat(company.usedUsers, isRTL)} /{' '}
            {quantityFormat(company.users, isRTL)}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            {tempwords.appointments} :{' '}
            {quantityFormat(company.usedEvents, isRTL)} /{' '}
            {quantityFormat(company.packQty, isRTL)}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            {isRTL ? 'وثائق' : 'Doocuments'} :{' '}
            {quantityFormat(company.usedDocs, isRTL)} /{' '}
            {quantityFormat(company.packDocsQty, isRTL)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
