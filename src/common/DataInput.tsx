import { Box, fade, Typography } from '@material-ui/core';
import React, { useRef } from 'react';
const SheetJSFT = [
  'xlsx',
  'xlsb',
  'xlsm',
  'xls',
  'xml',
  'csv',
  'txt',
  'ods',
  'fods',
  'uos',
  'sylk',
  'dif',
  'dbf',
  'prn',
  'qpw',
  '123',
  'wb*',
  'wq*',
  'html',
  'htm',
]
  .map(function (x) {
    return '.' + x;
  })
  .join(',');

export default function DataInput({ handleFile, theme, isRTL }: any) {
  const fileInput = useRef(null);

  const handleChange = (e: any) => {
    const files = e.target.files;
    if (files && files[0]) handleFile(files[0]);
  };
  return (
    <div className="form-group">
      <input
        type="file"
        id="file"
        accept={SheetJSFT}
        onChange={handleChange}
        ref={fileInput}
        style={{
          width: 0.1,
          height: 0.1,
          opacity: 0,
          position: 'absolute',
          zIndex: -1,
        }}
      />
      <Box
        display="flex"
        style={{
          borderRadius: 10,
          width: 150,
          height: 30,
          cursor: 'pointer',
          backgroundColor: fade(theme.palette.secondary.light, 0.7),
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => fileInput.current.click()}
      >
        <Typography
          style={{
            color: theme.palette.primary.dark,
            fontSize: 14,
            fontWeight: 'bold',
          }}
        >
          {isRTL ? 'ملف اكسل' : 'Excel File'}
        </Typography>
      </Box>
    </div>
  );
}
