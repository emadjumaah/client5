import React from 'react';
import Alert from '@material-ui/lab/Alert';

export default function AlertLocal({ type, msg, isRTL, top }: any) {
  return (
    <Alert
      style={{
        direction: isRTL ? 'rtl' : 'ltr',
        position: 'absolute',
        zIndex: 111,
        bottom: top ? undefined : 60,
        top: top ? 55 : undefined,
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
