/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Box, fade, Paper, Typography } from '@material-ui/core';
import XLSX from 'xlsx';

import PopupLayout from '../pages/main/PopupLayout';
import DataInput from '../common/DataInput';
import {
  Grid,
  TableHeaderRow,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui';
import { TableComponent } from '../Shared/ItemsTable';

export const getRowId = (row: any) => row.index;

const PopupContactImport = ({
  open,
  onClose,
  theme,
  isRTL,
  words,
  addMultiItems,
}: any) => {
  const [columns] = useState([
    { name: 'index', title: words.no },
    { name: 'name', title: words.name },
    { name: 'phone', title: words.mobile },
    { name: 'email', title: words.email },
    { name: 'company', title: words.companyName },
    { name: 'address', title: words.address },
    { name: 'notes', title: words.notes },
  ]);
  const [data, setData] = useState([]);

  const handleFile = (file: any) => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (e) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const header = data[0];
      const jsondata = data.map((d: any, index: any) => {
        return {
          index,
          [header[0]]: d[0],
          [header[1]]: d[1],
          [header[2]]: d[2],
          [header[3]]: d[3],
          [header[4]]: d[4],
          [header[5]]: d[5],
        };
      });
      jsondata.shift();
      setData(jsondata);
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  const onSubmit = () => {
    const stringdata = JSON.stringify(data);
    addMultiItems({ variables: { data: stringdata } });
    onFormClose();
  };

  const onFormClose = () => {
    setData([]);
    onClose();
  };

  const title = isRTL ? 'استيراد ملف بيانات' : 'Import from Excel';
  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onFormClose}
      title={title}
      onSubmit={onSubmit}
      theme={theme}
      alrt={{}}
      maxWidth="lg"
    >
      <Box>
        <Box
          display="flex"
          style={{
            flex: 1,
            backgroundColor: '#fff',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: 10,
          }}
        >
          <DataInput theme={theme} handleFile={handleFile} isRTL={isRTL} />
          {data?.length > 0 && <div>{data.length}</div>}
          <a
            href="https://github.com/emadjumaah/jadwal-releases/blob/main/contacts.xlsx?raw=true"
            download
            style={{
              borderRadius: 10,
              width: 150,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: fade(theme.palette.secondary.light, 0.3),
              textDecorationLine: 'none',
              fontSize: 14,
              color: theme.palette.primary.main,
              fontWeight: 'bold',
            }}
          >
            {isRTL ? 'تنزيل نموذج فارغ' : 'Download Template'}
          </a>
        </Box>

        <Paper style={{ height: 400, overflow: 'auto' }}>
          <Grid rows={data} columns={columns} getRowId={getRowId}>
            <VirtualTable
              tableComponent={TableComponent}
              height={400}
              messages={{
                noData: isRTL ? 'لا يوجد بيانات' : 'no data',
              }}
              estimatedRowHeight={40}
            />
            <TableHeaderRow
              titleComponent={({ children }) => {
                return (
                  <Typography style={{ fontSize: 14, fontWeight: 'bold' }}>
                    {children}
                  </Typography>
                );
              }}
            />
          </Grid>
        </Paper>
      </Box>
    </PopupLayout>
  );
};
export default PopupContactImport;
