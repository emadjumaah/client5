/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { covertToTimeDate } from '../Shared/colorFormat';
import './pos.css';
export class PosPrint extends React.PureComponent<any, any> {
  render() {
    const { company, printData } = this.props;
    const {
      items,
      employee,
      time,
      amount,
      payment,
      paymentAr,
      customerName,
      customerPhone,
    } = printData;
    return (
      <div id="invoice-POS">
        <div id="top">
          <img className="logo" src={company?.logo}></img>
          <div className="company">{company?.name}</div>
          <div className="info">
            <p>Phone : {customerName}</p>
            <p>Mobile : {customerPhone}</p>
            <p>Employee : {employee}</p>
            <p>Time : {covertToTimeDate(time)}</p>
          </div>
          <div id="table">
            <table>
              <tr className="tabletitle">
                <td className="item">
                  <p className="headitem">ITEM</p>
                  <p className="headitemAr">البند</p>
                </td>
                <td className="Hours">
                  <p className="headitem">QTY</p>
                  <p className="headitemAr">الكمية</p>
                </td>
                <td className="Rate">
                  <p className="headitem">PRICE</p>
                  <p className="headitemAr">السعر</p>
                </td>
              </tr>

              {items.map((item: any) => (
                <tr className="service">
                  <td className="tableitem">
                    <p className="itemtextAr">{item?.nameAr}</p>
                    <p className="itemtext">{item?.name}</p>
                  </td>
                  <td className="tableitem">
                    <p className="itemtext">{item?.itemqty}</p>
                  </td>
                  <td className="tableitem">
                    <p className="itemamount">{item?.itemtotal}</p>
                  </td>
                </tr>
              ))}

              <tr className="tabletitle">
                <td className="item">
                  <h2 className="totaltitle">Total / مجموع</h2>
                </td>
                <td></td>
                <td className="payment">
                  <h2 className="totaltitle">{amount}</h2>
                </td>
              </tr>
              <tr>
                <td className="item">
                  <p>{payment}</p>
                </td>
                <td></td>
                <td className="paymentAr">
                  <p>{paymentAr}</p>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div id="legalcopy">
          <div className="legalAr">نسعد بخدمتكم دائما</div>
          <div className="legal">Thanks for your business</div>
        </div>
        <div className="end"></div>
      </div>
    );
  }
}
