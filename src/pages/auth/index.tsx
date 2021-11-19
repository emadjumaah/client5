import { Box, Tooltip } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts';
import MyIcon from '../../Shared/MyIcon';
import { GContextTypes } from '../../types';
import { SelectTheme } from '../calendar/common/SelectTheme';
import Login from './Login';
import Register from './Register';

export default function Auth() {
  const [reg, setReg] = useState(false);
  const {
    dispatch,
    store: { wrongTimes, startBlock, lang, themeId },
    translate: { isRTL, words },
  }: GContextTypes = useContext(GlobalContext);

  const onThemeSelect = (themeId: any) => {
    dispatch({ type: 'setThemeId', payload: themeId });
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          style={{
            width: 34,
            height: 34,
            cursor: 'pointer',
            padding: 5,
          }}
          onClick={async () => {
            dispatch({
              type: 'setLang',
              payload: lang === 'ar' ? 'en' : 'ar',
            });
          }}
        >
          <Tooltip
            title={
              lang === 'ar' ? 'Change to English' : 'تغيير الى اللغة العربية'
            }
          >
            <Box style={{ padding: 5 }}>
              <MyIcon size={24} icon={'lang'}></MyIcon>
            </Box>
          </Tooltip>
        </Box>
        <SelectTheme themeId={themeId} onChange={onThemeSelect}></SelectTheme>
      </div>
      {!reg && (
        <Login
          setReg={setReg}
          isRTL={isRTL}
          dispatch={dispatch}
          wrongTimes={wrongTimes}
          startBlock={startBlock}
          words={words}
        ></Login>
      )}
      {reg && (
        <Register
          setReg={setReg}
          isRTL={isRTL}
          dispatch={dispatch}
          wrongTimes={wrongTimes}
          startBlock={startBlock}
          words={words}
        ></Register>
      )}
    </div>
  );
}
