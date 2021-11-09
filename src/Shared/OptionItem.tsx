/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Box, Typography } from '@material-ui/core';
import React from 'react';

export default function OptionItem({
  item,
  col,
  isRTL,
  day,
  basename,
  showphone,
}: any) {
  const textstyle = {
    marginLeft: 10,
    marginRight: 10,
  };

  const { color, daysoff } = item;
  const days = daysoff ? JSON.parse(daysoff) : null;
  const isred = days && day ? days[day] : false;

  const phone = item?.phone ? item?.phone : null;
  let name;
  if (basename) {
    name = isRTL ? item?.[`${basename}Ar`] : item?.[basename];
  } else {
    name = isRTL ? item?.nameAr : item?.name;
  }
  return (
    <Box
      display="flex"
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        direction: isRTL ? 'rtl' : 'ltr',
        backgroundColor: isred ? '#ffc0cb' : undefined,
        justifyContent: 'space-between',
        position: 'relative',
        //  dth: 300,
      }}
    >
      <Box style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        {item.color && !col && (
          <Box display="flex">
            <Box
              display="flex"
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: color ? color : '#fff',
                marginTop: 5,
              }}
            ></Box>
            <Typography
              style={color ? textstyle : {}}
              variant={isRTL ? 'subtitle1' : 'subtitle2'}
            >
              {name}
            </Typography>
          </Box>
        )}
        {!color && (
          <Typography variant={isRTL ? 'subtitle1' : 'subtitle2'}>
            {name}
          </Typography>
        )}
      </Box>
      {showphone && (
        <Typography
          style={{
            fontSize: 11,
            color: '#999',
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          {phone}
        </Typography>
      )}
    </Box>
  );
}
