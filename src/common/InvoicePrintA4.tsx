/* eslint-disable jsx-a11y/alt-text */
import { Grid, Box } from '@material-ui/core';
import React from 'react';
import { moneyFormat, simpleDateFormatter } from '../Shared/colorFormat';

export class InvoicePrintA4 extends React.PureComponent<any, any> {
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
              height: 30,
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
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ITEM DESCRIPTION
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
              alignItems: 'center',
              justifyContent: 'center',
              height: 30,
            }}
          >
            PRICE
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
              alignItems: 'center',
              justifyContent: 'center',
              height: 30,
            }}
          >
            QTY
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
              alignItems: 'center',
              justifyContent: 'center',
              height: 30,
            }}
          >
            TOTAL
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

              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            GRAND TOTAL
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            border={1}
            borderColor="grey.300"
            style={{
              padding: 6,
              fontSize: 14,
              fontWeight: 'bold',

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
          <div
            style={{
              padding: 14,
              fontSize: 14,
              borderLeftWidth: 1,
              borderLeftColor: '#777',
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              borderRightWidth: 1,
              borderRightColor: '#777',
              textAlign: 'center',
              height: 30,
            }}
          ></div>
        </Grid>
        <Grid item xs={6}>
          <div
            style={{
              padding: 14,
              fontSize: 14,
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              height: 30,
            }}
          ></div>
        </Grid>
        <Grid item xs={2}>
          <div
            style={{
              padding: 14,
              fontSize: 14,
              borderLeftWidth: 1,
              borderLeftColor: '#777',
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              borderRightWidth: 1,
              borderRightColor: '#777',
              textAlign: 'right',
              height: 30,
            }}
          ></div>
        </Grid>
        <Grid item xs={1}>
          <div
            style={{
              padding: 14,
              fontSize: 14,
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              textAlign: 'center',
              height: 30,
            }}
          ></div>
        </Grid>
        <Grid item xs={2}>
          <div
            style={{
              padding: 14,
              fontSize: 14,
              fontWeight: 'bold',
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              borderLeftWidth: 1,
              borderLeftColor: '#777',
              borderRightWidth: 1,
              borderRightColor: '#777',
              textAlign: 'right',
              height: 30,
            }}
          ></div>
        </Grid>
      </Grid>
    );
  };

  renderFooter = () => (
    <Grid item xs={12}>
      <Grid container spacing={2}></Grid>

      <Grid item xs={6}>
        <Box>
          <div
            style={{
              fontWeight: 'bold',
              color: '#999',
              fontSize: 11,
              alignContent: 'flex-end',
            }}
          >
            Thank you for your business.
          </div>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <div style={{ fontWeight: 'bold', alignContent: 'center' }}>Name</div>
          <div style={{ alignContent: 'center' }}>Sales Executive</div>
        </Box>
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
              fontSize: 14,
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            {invoice.customerName}
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>Phone: </span>
            {invoice.customerPhone}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div style={{ fontSize: 24, letterSpacing: 2 }}>INVOICE</div>
          <Grid container spacing={0}>
            <Grid item xs={4}>
              <div style={{ fontWeight: 'bold' }}>Invoice No:</div>
            </Grid>
            <Grid item xs={4}>
              <div>{invoice.invoiceNo}</div>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <div style={{ fontWeight: 'bold' }}>Date:</div>
            </Grid>
            <Grid item xs={4}>
              <div>{simpleDateFormatter(invoice?.time)}</div>
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  renderTableItems = () => {
    const len = this.props.printData?.items?.length;
    const empt = Array.from(Array(5 - len).fill({}));
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
    const invoice = this.props.printData;
    const { company } = this.props;

    return (
      <Box>
        <Box>
          <Grid container spacing={0}>
            {this.renderHeader(company)}
            <Grid item xs={12}>
              <Box ml={6} mr={6}>
                <Grid container spacing={2}>
                  {this.renderTitle(invoice)}
                  {this.renderDivider(1)}
                  {this.renderTableHeader()}
                  {this.renderTableItems()}
                  {this.renderGrandTotal()}
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
                  {this.renderTitle(invoice)}
                  {this.renderDivider(1)}
                  {this.renderTableHeader()}
                  {this.renderTableItems()}
                  {this.renderGrandTotal()}
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
