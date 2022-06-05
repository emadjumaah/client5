import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Box, Button, Divider, TextField, Typography } from '@material-ui/core';

export default function CardListBar({
  query,
  handleSearch,
  onOpenCreate,
  isRTL,
}: any) {
  return (
    <>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 50,
          backgroundColor: '#fff',
        }}
      >
        <Button
          style={{ margin: 5, minWidth: 80 }}
          variant="contained"
          size="small"
          color="primary"
          onClick={onOpenCreate}
        >
          <Typography style={{ fontSize: 14 }}>
            {isRTL ? 'اضافة عميل' : 'New Customer'}
          </Typography>
        </Button>
        <TextField
          id="filled-name"
          value={query}
          onChange={handleSearch}
          style={{
            width: 250,
          }}
          InputProps={{
            startAdornment: <SearchIcon style={{ marginLeft: 10 }} />,
            style: {
              height: 30,
              paddingLeft: 20,
              marginLeft: 20,
            },
          }}
        />
      </Box>
      <Divider></Divider>
    </>
  );
}
