/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Box } from '@material-ui/core';
import React from 'react';
import { palettes } from '../../../themes';

export const SelectTheme = ({ isRTL, themeId, onChange }: any) => {
  return (
    <Box
      display="flex"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {palettes.map((item: any, index: any) => {
        const isActive = Number(themeId) === index;
        return (
          <Box
            key={index}
            display="flex"
            style={{
              flexDirection: 'row',
              justifyContent: isRTL ? 'flex-end' : 'flex-start',
              backgroundColor: isActive ? '#ccc' : '#fff',
              padding: 3,
            }}
            onClick={() => onChange(index)}
          >
            <Box
              display="flex"
              style={{
                flexDirection: 'row',
                height: 22,
                width: 44,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                display="flex"
                style={{
                  height: 22,
                  width: 22,
                  backgroundColor: item?.palette?.primary?.main,
                }}
              ></Box>
              <Box
                style={{
                  height: 22,
                  width: 22,
                  backgroundColor: item?.palette?.secondary?.main,
                }}
              ></Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
