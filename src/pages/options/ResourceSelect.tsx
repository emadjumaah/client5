/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Box } from '@material-ui/core';
import React from 'react';

const ResourceSelect = ({ value, setValue, words }) => {
  const onchange = (e: any) => {
    setValue(Number(e.target.value));
  };
  return (
    <RadioGroup
      aria-label="Views"
      name="views"
      row
      value={value}
      onChange={onchange}
    >
      <Box display="flex" style={{ flexDirection: 'row' }}>
        <FormControlLabel
          value={1}
          control={<Radio color="primary" />}
          label={words.hresource}
        />
      </Box>
      <Box display="flex" style={{ flexDirection: 'row' }}>
        <FormControlLabel
          value={2}
          control={<Radio color="primary" />}
          label={words.oresource}
        />
      </Box>
    </RadioGroup>
  );
};

export default ResourceSelect;
