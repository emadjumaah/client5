/* eslint-disable jsx-a11y/alt-text */
import { Box, Grid, Typography } from '@material-ui/core';
import React from 'react';
import {
  currencyFormatter,
  simpleDateFormatter,
  opTypeFormatter,
} from '../Shared/colorFormat';
import './index.css';

export class CustomerReportPrint extends React.PureComponent<any, any> {
  renderItemTable = (item: any) => {
    return (
      <tr style={{ fontSize: 12 }}>
        <td style={{ textAlign: 'center' }}>
          {simpleDateFormatter(item?.opTime)}
        </td>
        <td style={{ textAlign: 'center' }}>
          {opTypeFormatter({ value: item?.opType })}
        </td>
        <td style={{ textAlign: 'center' }}>{item?.opDocNo}</td>
        <td>{currencyFormatter({ value: item?.debit })}</td>
        <td>{currencyFormatter({ value: item?.credit })}</td>
        <td>{currencyFormatter({ value: item?.rased })}</td>
      </tr>
    );
  };
  renderItemHeaderTable = (isRTL: boolean) => {
    return (
      <tr style={{ fontSize: 12 }}>
        <th>{isRTL ? 'التاريخ' : 'Date'}</th>
        <th>{isRTL ? 'الوثيقة' : 'Document'}</th>
        <th>{isRTL ? 'رقم الوثيقة' : 'Doc No'}</th>
        <th>{isRTL ? 'مدين' : 'Debit'}</th>
        <th>{isRTL ? 'دائن' : 'Credit'}</th>
        <th>{isRTL ? 'الرصيد' : 'Balance'}</th>
      </tr>
    );
  };
  renderHeader = (company: any) => (
    <img
      src={company?.header}
      alt={company?.name}
      height="auto"
      width="100%"
      style={{
        objectFit: 'contain',
      }}
    />
  );

  renderFooter = (company: any) => (
    <img
      src={company?.footer}
      alt={company?.name}
      height="100%"
      width="100%"
      style={{
        objectFit: 'contain',
      }}
    />
  );

  renderFrontTop = ({ customer, start, end, rased, isRTL }: any) => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <Typography>التاريخ:</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{simpleDateFormatter(new Date())}</Typography>
        </Grid>
        <Grid item xs={8}></Grid>
        <Grid item xs={2}>
          <Typography style={{ fontSize: 16 }}>العميل:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>
            {isRTL ? customer?.nameAr : customer?.name}
          </Typography>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={2}>
          <Typography style={{ fontSize: 16 }}>مدة التقرير:</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>
            {simpleDateFormatter(start)}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>
            {simpleDateFormatter(end)}
          </Typography>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={2}>
          <Typography style={{ fontSize: 16 }}>رصيد المدة:</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>
            {currencyFormatter({ value: rased })}
          </Typography>
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>
    );
  };

  render() {
    const { company, items, isRTL, customer, start, end } = this.props;
    const rased = items?.[items?.length - 1]?.rased;
    return (
      <Box>
        <div className="header">{this.renderHeader(company)}</div>
        <Box
          style={{
            height: 200,
          }}
        ></Box>
        <div style={{ paddingLeft: 60, paddingRight: 40, direction: 'rtl' }}>
          <Box
            style={{
              height: 200,
              position: 'absolute',
              top: 170,
              width: '100%',
            }}
          >
            {this.renderFrontTop({ customer, start, end, rased, isRTL })}
          </Box>
          <table id="report" className="report-container">
            <thead className="report-header">
              <div className="header-space"></div>
              {this.renderItemHeaderTable(isRTL)}
            </thead>
            <tbody className="report-content">
              {items?.map((item: any) => this.renderItemTable(item))}
            </tbody>
            <tfoot className="report-footer">
              <tr style={{ padding: 0, borderColor: '#fff', borderWidth: 0 }}>
                <td style={{ padding: 0, borderColor: '#fff', borderWidth: 0 }}>
                  <div className="footer-info">
                    <div
                      className="page-footer"
                      style={{ fontSize: 14, padding: 5 }}
                    >
                      {company?.name}
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
            {/* <div style={{ marginTop: 100 }}>After Footer</div> */}
          </table>
        </div>
        <img alt={company?.name} src={company?.logo} className={'watermark'} />
      </Box>
    );
  }
}

// return (
//   <div style={{ direction: 'rtl' }}>
//     <div className="header">{this.renderHeader(company)}</div>
//     <div style={{ paddingLeft: 60, paddingRight: 40 }}>
//       <table id="report" className="report-container">
//         <thead className="report-header">
//           <div className="header-space"></div>
//           {this.renderItemHeaderTable(isRTL)}
//         </thead>
//         <tbody className="report-content">
//           {items?.map((item: any) => this.renderItemTable(item))}
//         </tbody>
//         <tfoot className="report-footer"></tfoot>
//       </table>
//     </div>
//     <img alt={company?.name} src={company?.logo} className={'watermark'} />
//   </div>
// );

// return (
//   <div style={{ direction: 'rtl' }}>
//     <div className="header">{this.renderHeader(company)}</div>
//     <div style={{ paddingLeft: 60, paddingRight: 40 }}>
//       <table id="report" className="report-container">
//         <thead className="report-header">
//           <div className="header-space"></div>
//           {this.renderItemHeaderTable()}
//         </thead>
//         <tbody className="report-content">
//           {items?.map((item: any) => this.renderItemTable(item))}
//         </tbody>
//       </table>
//       <tfoot id="reporttfoot" className="report-footer">
//         <tr>
//           <td>
//             <div className="footer-info">
//               <div className="page-footer">
//                 {/* {this.renderFooter(company)} */}
//                 {company?.name}
//               </div>
//             </div>
//           </td>
//         </tr>
//       </tfoot>
//     </div>
//     <img alt={company?.name} src={company?.logo} className={'watermark'} />
//   </div>
// );
