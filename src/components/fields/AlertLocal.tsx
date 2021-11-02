/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import Alert from '@material-ui/lab/Alert';
import useWindowDimensions from '../../hooks/useWindowDimensions';

export default function AlertLocal({ type, msg, isRTL, top }: any) {
  const { width } = useWindowDimensions();

  return (
    <Alert
      style={{
        direction: isRTL ? 'rtl' : 'ltr',
        position: 'absolute',
        bottom: top ? undefined : 60,
        top: top ? 55 : undefined,
        width: top ? width - 275 : '100%',
        height: top ? 60 : undefined,
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
      }}
      severity={type}
    >
      {msg}
    </Alert>
  );
}
