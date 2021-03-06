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
  const isbusy = item?.busy || item?.carstatus > 1;

  const { color, daysoff, retypeName, retypeNameAr } = item;
  const type = isRTL ? retypeNameAr : retypeName;
  const days = daysoff ? JSON.parse(daysoff) : null;
  const isred = days && day ? days[day] : isbusy ? isbusy : false;

  const phone = item?.phone ? item?.phone : null;
  const code = item?.code;
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
      }}
    >
      {item.color && !col && (
        <Box display="flex">
          <Box
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: color ? color : '#fff',
              marginTop: 5,
            }}
          ></Box>
          <Typography
            style={{
              textAlign: isRTL ? 'right' : 'left',
              marginLeft: color ? 10 : undefined,
              marginRight: color ? 10 : undefined,
            }}
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
      {code && (
        <Typography
          style={{
            fontSize: 11,
            color: '#999',
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          {code}
        </Typography>
      )}
      {type && (
        <Typography
          style={{
            fontSize: 11,
            color: '#999',
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          {type}
        </Typography>
      )}
    </Box>
  );
}
