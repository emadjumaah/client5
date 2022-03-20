/* eslint-disable jsx-a11y/alt-text */
import { Grid, Box } from '@material-ui/core';
import React from 'react';
import { moneyFormat, simpleDateFormatter } from '../Shared/colorFormat';

export class InvoicePrint extends React.PureComponent<any, any> {
  renderTableHeader = () => {
    return (
      <Grid container spacing={0}>
        <Grid item xs={1}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 14,
              fontWeight: 'bold',
              backgroundColor: '#f5f5f5',
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            No
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 14,
              fontWeight: 'bold',
              backgroundColor: '#f5f5f5',
              height: 60,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>Item Dexcription</div>
            <div>التفاصيل</div>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 14,
              fontWeight: 'bold',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 60,
            }}
          >
            <div>Price</div>
            <div>السعر</div>
          </Box>
        </Grid>
        <Grid item xs={1}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 14,
              fontWeight: 'bold',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 60,
            }}
          >
            <div>Qty</div>
            <div>الكمية</div>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 14,
              fontWeight: 'bold',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 60,
            }}
          >
            <div>Total</div>
            <div>المجموع</div>
          </Box>
        </Grid>
      </Grid>
    );
  };
  renderGrandTotal = () => {
    return (
      <Grid container spacing={0}>
        {this.renderDivider(3)}
        <Grid item xs={7}></Grid>
        <Grid item xs={3}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              padding: 6,
              fontSize: 14,
              fontWeight: 'bold',
              height: 60,
              backgroundColor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>Grand Total</div>
            <div>المبلغ الإجمالي</div>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              padding: 6,
              fontSize: 16,
              fontWeight: 'bold',
              height: 60,
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {moneyFormat(this.props.printData?.total)}
          </Box>
        </Grid>
      </Grid>
    );
  };
  renderItem = (item: any) => {
    var trimmed = item.name.substring(0, 42);
    return (
      <Grid container spacing={0}>
        <Grid item xs={1}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 30,
            }}
          >
            {item.index + 1}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              height: 30,
            }}
          >
            <div>{trimmed}</div>
            {item.sn && <div>SN: {item.sn}</div>}
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 14,

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              height: 30,
            }}
          >
            {moneyFormat(item.itemprice)}
          </Box>
        </Grid>
        <Grid item xs={1}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 14,

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 30,
            }}
          >
            {item.itemqty}
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 14,
              fontWeight: 'bold',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              height: 30,
            }}
          >
            {moneyFormat(item.itemtotal)}
          </Box>
        </Grid>
      </Grid>
    );
  };
  renderEmptyItem = () => {
    return (
      <Grid container spacing={0}>
        <Grid item xs={1}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              padding: 14,
              fontSize: 14,

              textAlign: 'center',
              height: 30,
            }}
          ></Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              padding: 14,
              fontSize: 14,

              height: 30,
            }}
          ></Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              padding: 14,
              fontSize: 14,

              textAlign: 'right',
              height: 30,
            }}
          ></Box>
        </Grid>
        <Grid item xs={1}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              padding: 14,
              fontSize: 14,

              textAlign: 'center',
              height: 30,
            }}
          ></Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              padding: 14,
              fontSize: 14,
              fontWeight: 'bold',

              textAlign: 'right',
              height: 30,
            }}
          ></Box>
        </Grid>
      </Grid>
    );
  };
  renderFooter = (user: any) => (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}
          >
            <div style={{ fontWeight: 'bold' }}>
              {user.name ? user.name : user.username}
            </div>
            <div>Sales Department</div>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <div
            style={{
              fontWeight: 'bold',
              color: '#999',
              fontSize: 14,
              alignContent: 'flex-end',
            }}
          >
            Thank you for your business.
          </div>
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>
    </Grid>
  );
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
  renderTitle = (invoice: any) => (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div
            style={{
              fontWeight: 'bold',
              marginBottom: 10,
              fontSize: 16,
            }}
          >
            To:
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            {invoice.customerName}
          </div>
          <div style={{ fontSize: 14 }}>
            <span style={{ fontWeight: 'bold' }}>Phone: </span>
            {invoice.customerPhone}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div style={{ fontSize: 32, letterSpacing: 2 }}>INVOICE</div>
          <Grid container spacing={0}>
            <Grid item xs={4}>
              <div style={{ fontWeight: 'bold', fontSize: 14 }}>
                Invoice No:
              </div>
            </Grid>
            <Grid item xs={4}>
              <div style={{ fontSize: 14 }}>{invoice.invoiceNo}</div>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <div style={{ fontWeight: 'bold', fontSize: 14 }}>Date:</div>
            </Grid>
            <Grid item xs={4}>
              <div style={{ fontSize: 14 }}>
                {simpleDateFormatter(invoice?.time)}
              </div>
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
  renderTableItems = () => {
    const len = this.props.printData?.items?.length;
    const empt = Array.from(Array(10 - len).fill({}));
    const newitems = [...this.props.printData?.items, ...empt];
    return newitems?.map((item: any) => {
      if (item?._id) {
        return this.renderItem(item);
      } else {
        return this.renderEmptyItem();
      }
    });
  };
  renderDivider = (x: number) => (
    <Grid item xs={12}>
      <Box m={x}></Box>
    </Grid>
  );
  render() {
    const { company, user, printData } = this.props;
    return (
      <Box>
        <Box>
          <Grid container spacing={0}>
            {this.renderHeader(company)}
            <Grid item xs={12}>
              <Box ml={6} mr={6}>
                <Grid container spacing={2}>
                  {this.renderDivider(2)}
                  {this.renderTitle(printData)}
                  {this.renderDivider(3)}
                  {this.renderTableHeader()}
                  {this.renderTableItems()}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box style={{ position: 'absolute', bottom: 140, width: '100%' }}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Box ml={6} mr={6}>
                <Grid container spacing={2}>
                  {this.renderGrandTotal()}
                  {this.renderDivider(4)}
                  {this.renderFooter(user)}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }
}
