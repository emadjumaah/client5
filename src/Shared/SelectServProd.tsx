import { Box, Button, FormControl, MenuItem, Select } from '@material-ui/core';
import React from 'react';

export default function SelectServProd({ value, onChange, isRTL, words }) {
  return (
    <div>
      <FormControl>
        <Box style={{ flexDirection: 'revert' }}>
          <span>{words.type}</span>
          <Select
            id="simple-menu"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            variant="outlined"
            style={{
              height: 38,
              fontSize: 14,
              fontWeight: 'bold',
              color: '#555',
              minWidth: 120,
              marginInlineStart: 10,
            }}
          >
            <MenuItem
              style={{ justifyContent: isRTL ? 'flex-end' : 'flex-start' }}
              value={3}
            >
              {words.products}
            </MenuItem>
            <MenuItem
              style={{ justifyContent: isRTL ? 'flex-end' : 'flex-start' }}
              value={2}
            >
              {words.services}
            </MenuItem>
          </Select>
          <Button style={{}} onClick={() => onChange(null)}>
            X
          </Button>
        </Box>
      </FormControl>
    </div>
  );
}
