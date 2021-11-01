/* eslint-disable jsx-a11y/alt-text */
import { Grid, Box, Typography } from '@material-ui/core';
import React from 'react';
import { moneyFormat } from '../Shared/colorFormat';

const contHeader: any = { fontSize: 12, fontWeight: 'bold' };

const contItem: any = { fontSize: 12 };

export class ReportPrintComponent extends React.PureComponent<any, any> {
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

  render() {
    const { company } = this.props;
    console.log(this.props);

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
                backgroundColor: '#eee',
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
                  <div style={contItem}>{company?.tel1}</div>
                  <div style={contItem}>{company?.email}</div>
                  <div style={contItem}>{company?.website}</div>
                </Grid>
                <Grid item xs={6}>
                  <div style={contHeader}>Address</div>
                  <div style={contItem}>{company?.address}</div>
                </Grid>
              </Grid>
            </div>
          </Grid>

          <Grid xs={12}>
            {this.props?.items?.map((item: any) => {
              return (
                <Typography style={{ margin: 40 }}>{item?.amount}</Typography>
              );
            })}
          </Grid>
        </Grid>
      </Box>
    );
  }
}
