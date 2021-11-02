/* eslint-disable jsx-a11y/alt-text */
import { Grid, Box } from '@material-ui/core';
import React from 'react';
import { moneyFormat, simpleDateFormatter } from '../Shared/colorFormat';

const contHeader: any = { fontSize: 12, fontWeight: 'bold' };

const contItem: any = { fontSize: 12 };

export class InvoicePrintA5 extends React.PureComponent<any, any> {
  renderTableHeader = () => {
    return (
      <Grid container spacing={0}>
        <Grid item xs={1}>
          <div
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 13,
              fontWeight: 'bold',
              borderWidth: 1,
              borderColor: '#777',
              backgroundColor: '#f5f5f5',
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            No
          </div>
        </Grid>
        <Grid item xs={6}>
          <div
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 13,
              fontWeight: 'bold',
              borderTopWidth: 1,
              borderTopColor: '#777',
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              backgroundColor: '#f5f5f5',
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ITEM DESCRIPTION
          </div>
        </Grid>
        <Grid item xs={2}>
          <div
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 13,
              fontWeight: 'bold',
              borderWidth: 1,
              borderColor: '#777',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 34,
            }}
          >
            PRICE
          </div>
        </Grid>
        <Grid item xs={1}>
          <div
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 13,
              fontWeight: 'bold',
              borderTopWidth: 1,
              borderTopColor: '#777',
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 34,
            }}
          >
            QTY
          </div>
        </Grid>
        <Grid item xs={2}>
          <div
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 13,
              fontWeight: 'bold',
              borderWidth: 1,
              borderColor: '#777',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 34,
            }}
          >
            TOTAL
          </div>
        </Grid>
      </Grid>
    );
  };
  renderGrandTotal = () => {
    return (
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <div style={{ height: 15 }}></div>
        </Grid>
        <Grid item xs={7}></Grid>
        <Grid item xs={3}>
          <div
            style={{
              padding: 6,
              fontSize: 13,
              fontWeight: 'bold',
              borderWidth: 1,
              borderColor: '#777',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            GRAND TOTAL
          </div>
        </Grid>
        <Grid item xs={2}>
          <div
            style={{
              padding: 6,
              fontSize: 13,
              fontWeight: 'bold',
              borderTopWidth: 1,
              borderTopColor: '#777',
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              borderRightWidth: 1,
              borderRightColor: '#777',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {moneyFormat(this.props.printData?.total)}
          </div>
        </Grid>
      </Grid>
    );
  };

  renderItem = (item: any) => {
    var trimmed = item.name.substring(0, 42);
    return (
      <Grid container spacing={0}>
        <Grid item xs={1}>
          <div
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 12,
              borderLeftWidth: 1,
              borderLeftColor: '#777',
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              borderRightWidth: 1,
              borderRightColor: '#777',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 34,
            }}
          >
            {item.index + 1}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              height: 34,
            }}
          >
            <div>{trimmed}</div>
            {item.sn && <div>SN: {item.sn}</div>}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 12,
              borderLeftWidth: 1,
              borderLeftColor: '#777',
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              borderRightWidth: 1,
              borderRightColor: '#777',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              height: 34,
            }}
          >
            {moneyFormat(item.itemprice)}
          </div>
        </Grid>
        <Grid item xs={1}>
          <div
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 34,
            }}
          >
            {item.itemqty}
          </div>
        </Grid>
        <Grid item xs={2}>
          <div
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 12,
              fontWeight: 'bold',
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              borderLeftWidth: 1,
              borderLeftColor: '#777',
              borderRightWidth: 1,
              borderRightColor: '#777',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              height: 34,
            }}
          >
            {moneyFormat(item.itemtotal)}
          </div>
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
              fontSize: 12,
              borderLeftWidth: 1,
              borderLeftColor: '#777',
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              borderRightWidth: 1,
              borderRightColor: '#777',
              textAlign: 'center',
              height: 34,
            }}
          ></div>
        </Grid>
        <Grid item xs={6}>
          <div
            style={{
              padding: 14,
              fontSize: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              height: 34,
            }}
          ></div>
        </Grid>
        <Grid item xs={2}>
          <div
            style={{
              padding: 14,
              fontSize: 12,
              borderLeftWidth: 1,
              borderLeftColor: '#777',
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              borderRightWidth: 1,
              borderRightColor: '#777',
              textAlign: 'right',
              height: 34,
            }}
          ></div>
        </Grid>
        <Grid item xs={1}>
          <div
            style={{
              padding: 14,
              fontSize: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              textAlign: 'center',
              height: 34,
            }}
          ></div>
        </Grid>
        <Grid item xs={2}>
          <div
            style={{
              padding: 14,
              fontSize: 12,
              fontWeight: 'bold',
              borderBottomWidth: 1,
              borderBottomColor: '#777',
              borderLeftWidth: 1,
              borderLeftColor: '#777',
              borderRightWidth: 1,
              borderRightColor: '#777',
              textAlign: 'right',
              height: 34,
            }}
          ></div>
        </Grid>
      </Grid>
    );
  };

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

  render() {
    const invoice = this.props.printData;
    const { company } = this.props;

    return (
      <Box style={{ fontFamily: 'inherit' }} m={5}>
        <Grid container spacing={0}>
          <Grid item xs={5}>
            <div
              style={{
                padding: 10,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderTopColor: '#ccc',
                borderBottomColor: '#ccc',
                borderLeftColor: '#ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderTopLeftRadius: 15,
                height: 90,
              }}
            >
              <img
                src={company?.logo}
                alt={company?.name}
                height={100}
                style={{
                  objectFit: 'contain',
                  borderRadius: 10,
                  marginTop: 5,
                }}
              />
            </div>
          </Grid>
          <Grid item xs={7}>
            <div
              style={{
                padding: 10,
                backgroundColor: '#f5f5f5',
                borderTopRightRadius: 15,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderRightWidth: 1,
                borderBottomColor: '#ccc',
                borderTopColor: '#ccc',
                borderRightColor: '#ccc',
                height: 90,
              }}
            >
              <Grid container spacing={0}>
                <Grid item xs={6}>
                  <div style={contHeader}>Contact</div>
                  <div style={contItem}>{company.tel1}</div>
                  <div style={contItem}>{company?.email}</div>
                  <div style={contItem}>{company?.website}</div>
                </Grid>
                <Grid item xs={6}>
                  <div style={contHeader}>Address</div>
                  <div style={contItem}>{company?.address}</div>
                  {/* <div style={contItem}>Doha, Qatar</div> */}
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div style={{ height: 15 }}></div>
          </Grid>

          <Grid item xs={6}>
            <div style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>
              To:
            </div>
            <div
              style={{
                fontSize: 12,
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
          <Grid item xs={12}>
            <div style={{ height: 15 }}></div>
          </Grid>
          {this.renderTableHeader()}
          {this.renderTableItems()}
          {this.renderGrandTotal()}
        </Grid>
        <Box style={{ position: 'absolute', bottom: 80, right: 100 }}>
          <div style={{ fontWeight: 'bold' }}>Name</div>
          <div>Sales Executive</div>
        </Box>
        <Box style={{ position: 'absolute', bottom: 40, left: 50 }}>
          <div style={{ fontWeight: 'bold', color: '#999', fontSize: 11 }}>
            Thank you for your business.
          </div>
        </Box>
      </Box>
    );
  }
}
