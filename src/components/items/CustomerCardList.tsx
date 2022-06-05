import React from 'react';
import { Box, Grid } from '@material-ui/core';
import CustomerCard from './CustomerCard';
import CardListBar from './CardListBar';

export default function CustomerCardList({
  query,
  handleSearch,
  rows,
  isRTL,
  onOpenView,
  onOpenEdit,
  onOpenCreate,
  onDeleteItem,
}: any) {
  return (
    <>
      <CardListBar
        query={query}
        handleSearch={handleSearch}
        onOpenCreate={onOpenCreate}
        isRTL={isRTL}
      ></CardListBar>
      <Box mt={3} m={2}>
        <Grid container spacing={3}>
          {rows.map((item: any) => (
            <Grid item xs={12} md={6} lg={3}>
              <CustomerCard
                isRTL={isRTL}
                onOpenView={onOpenView}
                onOpenEdit={onOpenEdit}
                onDeleteCust={onDeleteItem}
                item={item}
              ></CustomerCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
