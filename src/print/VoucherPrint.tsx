/* eslint-disable jsx-a11y/alt-text */
import { Grid, Box, Typography } from '@material-ui/core';
import React from 'react';
import { tafkeet } from '../common/helpers';
import { moneyFormat, simpleSpanDateFormatter } from '../Shared/colorFormat';

const printcolor = '#777';

export class VoucherPrint extends React.PureComponent<any, any> {
  renderHeader = (company: any) => (
    <Grid item xs={12}>
      <img
        src={company?.header}
        alt={company?.name}
        height="auto"
        width="100%"
        style={{
          objectFit: 'contain',
        }}
      />
    </Grid>
  );

  renderTitle = (data: any) => (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Box
            border={2}
            borderColor={printcolor}
            borderRight={0}
            style={{
              fontWeight: 'bold',
              marginBottom: 10,
              fontSize: 20,
              display: 'flex',
              padding: 5,
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <div>سند صرف</div>
            <div>PAYMENT VOUCHER</div>
          </Box>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                border={1}
                borderColor={printcolor}
                style={{
                  width: 25,
                  height: 25,
                  marginLeft: 10,
                  marginRight: 10,
                  backgroundColor: data?.chequeNo ? '#999' : '#fff',
                }}
              ></Box>
              <span>CHEQUE</span>
            </Box>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                border={1}
                borderColor={printcolor}
                style={{
                  width: 25,
                  height: 25,
                  marginLeft: 10,
                  marginRight: 10,
                  backgroundColor: data?.chequeNo ? '#fff' : '#999',
                }}
              ></Box>
              <span>CASH</span>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: 16, color: printcolor }}>Amount المبلغ</div>
          </Box>
          <Box
            border={1}
            borderColor="grey.500"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 25,
              marginRight: 25,
              paddingLeft: 10,
              paddingRight: 10,
              height: 40,
              borderRadius: 5,
            }}
          >
            <div
              style={{
                fontSize: 18,
              }}
            >
              {moneyFormat(data.amount)} QR
            </div>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            mt={10}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              flexDirection: 'column',
            }}
          >
            <div style={{ marginTop: -40 }}>{data.no} :No / رقم</div>
            <div style={{ fontSize: 16 }}>
              {simpleSpanDateFormatter(data.time)} :Date / التاريخ
            </div>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );

  renderRows = (data: any) => {
    const { task, items, supplier, resourse, isRTL, employee } = data;
    return (
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <div style={{ fontSize: 14, fontWeight: 'bold' }}>
              Paid to Mr/Mrs
            </div>
          </Grid>
          <Grid item xs={8}>
            <Box
              style={{
                display: 'flex',
                height: 20,
                alignItems: 'center',
                justifyContent: data.isRTL ? 'flex-end' : undefined,
              }}
              border={1}
              borderColor="grey.300"
              borderRight={0}
              borderLeft={0}
              borderTop={0}
            >
              {supplier && (
                <Typography>
                  {isRTL ? supplier?.nameAr : supplier?.name}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={2}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                fontSize: 14,
                fontWeight: 'bold',
              }}
            >
              نصرف الى
            </div>
          </Grid>
          <Grid item xs={2}>
            <div style={{ fontSize: 14, fontWeight: 'bold' }}>Amounty of</div>
          </Grid>
          <Grid item xs={8}>
            <Box
              style={{
                display: 'flex',
                height: 20,
                alignItems: 'center',
                justifyContent: data.isRTL ? 'flex-end' : undefined,
              }}
              border={1}
              borderColor="grey.300"
              borderRight={0}
              borderLeft={0}
              borderTop={0}
            >
              <Typography>{tafkeet(data?.amount, data.isRTL)}</Typography>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                fontSize: 14,
                fontWeight: 'bold',
              }}
            >
              مبلغ وقدره
            </div>
          </Grid>
          <Grid item xs={2}>
            <div style={{ fontSize: 14, fontWeight: 'bold' }}>For</div>
          </Grid>
          <Grid item xs={8}>
            <Box
              style={{
                display: 'flex',
                height: 16,
                alignItems: 'center',
                justifyContent: data.isRTL ? 'flex-end' : undefined,
              }}
              border={1}
              borderColor="grey.300"
              borderRight={0}
              borderLeft={0}
              borderTop={0}
            >
              {items && items.length > 0 && (
                <Typography>
                  {isRTL ? items[0]?.nameAr : items[0]?.name}
                </Typography>
              )}{' '}
            </Box>
          </Grid>
          <Grid item xs={2}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                fontSize: 14,
                fontWeight: 'bold',
              }}
            >
              وذلك عن
            </div>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <Box
              style={{
                display: 'flex',
                height: 16,
                alignItems: 'center',
                justifyContent: 'space-between',
                // justifyContent: data.isRTL ? 'flex-end' : undefined,
              }}
              border={1}
              borderColor="grey.300"
              borderRight={0}
              borderLeft={0}
              borderTop={0}
            >
              {task && <Typography>{task?.title}</Typography>}
              {task && <Typography>{task?.docNo}</Typography>}
            </Box>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 14,
                height: 16,
              }}
              border={1}
              borderColor="grey.300"
              borderRight={0}
              borderLeft={0}
              borderTop={0}
            >
              {resourse && (
                <Typography>
                  {isRTL ? resourse?.nameAr : resourse?.name}
                </Typography>
              )}
              {employee && (
                <Typography>
                  {isRTL ? employee?.nameAr : employee?.name}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
      </Grid>
    );
  };
  renderFooter = (data: any) => (
    <Grid item xs={12} style={{ marginTop: 15 }}>
      <Grid container spacing={0}>
        <Grid container spacing={2}></Grid>

        <Grid item xs={1}></Grid>
        <Grid item xs={3}>
          <Box
            border={1}
            borderColor={printcolor}
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: 45,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>Cheque Date تاريخ الشيك</div>
            <div>
              {data?.chequeDate ? data?.chequeDate : '________________'}
            </div>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box
            border={1}
            borderColor={printcolor}
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: 45,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>Cheque No رقم الشيك</div>
            {data?.chequeNo ? data?.chequeNo : '________________'}
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            border={1}
            borderColor={printcolor}
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: 45,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>Bank البنك</div>
            {data?.chequeBank ? data?.chequeBank : '________________'}
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            border={1}
            borderColor={printcolor}
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: 45,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>Cheque شيك</div>
            <Box
              border={1}
              style={{
                height: 20,
                width: 20,
                backgroundColor: data?.chequeNo ? '#999' : '#fff',
              }}
            ></Box>
          </Box>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={12}>
          <Box height={10}></Box>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={2}>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: 45,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>Manager المدير</div>
            <div>________________</div>
          </Box>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={2}>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: 45,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>Receiver المستلم</div>
            <div>________________</div>
          </Box>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </Grid>
  );

  renderDivider = (x: number) => (
    <Grid item xs={12}>
      <Box m={x}></Box>
    </Grid>
  );

  render() {
    const data = this.props.printData;
    const { company } = this.props;
    return (
      <Box>
        <Box>
          <Grid container spacing={0}>
            {this.renderHeader(company)}
            <Grid item xs={12}>
              <Box ml={6} mr={6}>
                <Grid container spacing={1}>
                  {this.renderTitle(data)}
                  {this.renderRows(data)}
                  {this.renderFooter(data)}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box mt={2}>
          <Grid container spacing={0}>
            {this.renderHeader(company)}
            <Grid item xs={12}>
              <Box ml={6} mr={6}>
                <Grid container spacing={1}>
                  {this.renderTitle(data)}
                  {this.renderRows(data)}
                  {this.renderFooter(data)}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }
}
