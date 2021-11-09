/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Popper } from '@material-ui/core';
import React from 'react';

const styles: any = () => ({
  popper: {
    width: 400,
    // width: 'fit-content',
  },
});

const AutoPopper = (props) => {
  return <Popper {...props} style={styles.popper} placement="bottom-start" />;
};

export default AutoPopper;
