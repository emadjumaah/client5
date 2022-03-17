/* eslint-disable jsx-a11y/alt-text */
import { Grid, Box } from '@material-ui/core';
import React from 'react';
import { moneyFormat, simpleSpanDateFormatter } from '../Shared/colorFormat';

const printcolor = '#54B9C4';

export class VoucherPrint extends React.PureComponent<any, any> {
  renderFooter = () => (
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
            <div>________________</div>
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
            <div>________________</div>
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
            <div>________________</div>
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
            <Box border={1} style={{ height: 20, width: 20 }}></Box>
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

  renderHeader = (company: any) => (
    <Grid item xs={12}>
      <img
        src={company?.logo}
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
            <div>سند قبض</div>
            <div>RECEIPT VOUCHER</div>
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
              justifyContent: 'flex-end',
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
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <span style={{ fontSize: 16 }}>
              Date: {simpleSpanDateFormatter(data.time)} :التاريخ
            </span>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );

  renderDivider = (x: number) => (
    <Grid item xs={12}>
      <Box m={x}></Box>
    </Grid>
  );

  renderRows = () => (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <div style={{ fontSize: 14, fontWeight: 'bold' }}>Received From</div>
        </Grid>
        <Grid item xs={8}>
          <Box
            style={{ display: 'flex', height: 20 }}
            border={1}
            borderColor="grey.300"
            borderRight={0}
            borderLeft={0}
            borderTop={0}
          ></Box>
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
            وصلني من
          </div>
        </Grid>
        <Grid item xs={2}>
          <div style={{ fontSize: 14, fontWeight: 'bold' }}>Amounty of</div>
        </Grid>
        <Grid item xs={8}>
          <Box
            style={{ display: 'flex', height: 20 }}
            border={1}
            borderColor="grey.300"
            borderRight={0}
            borderLeft={0}
            borderTop={0}
          ></Box>
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
            style={{ display: 'flex', height: 20 }}
            border={1}
            borderColor="grey.300"
            borderRight={0}
            borderLeft={0}
            borderTop={0}
          ></Box>
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
            style={{ display: 'flex', height: 20 }}
            border={1}
            borderColor="grey.300"
            borderRight={0}
            borderLeft={0}
            borderTop={0}
          ></Box>
        </Grid>
        <Grid item xs={2}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              fontSize: 14,
              height: 20,
            }}
          ></div>
        </Grid>
      </Grid>
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
                <Grid container spacing={2}>
                  {this.renderTitle(data)}
                  {this.renderRows()}
                  {this.renderFooter()}
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
                <Grid container spacing={2}>
                  {this.renderTitle(data)}
                  {this.renderDivider(1)}
                  {this.renderRows()}
                  {this.renderFooter()}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }
}
