/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext } from 'react';

import Language from './LanguageSelect';
import { Box, Grid } from '@material-ui/core';
import GenTheme from './ThemeSelect';
import { GContextTypes } from '../../types';
import { GlobalContext } from '../../contexts';
import CalendarOptions from './CalendarOptions';
import Company from './Company';
// import Names from './Names';
import React from 'react';
import useWindowDimensions from '../../hooks/useWindowDimensions';

const initcalendar = {
  duration: 30,
  start: 8.5,
  end: 21.5,
};

const Options = ({ isRTL, words, isEditor, company, editCompany }: any) => {
  const { store, dispatch }: GContextTypes = useContext(GlobalContext);
  const { lang, themeId, calendar } = store;
  const { height } = useWindowDimensions();

  const setLang = (lang: any) => {
    dispatch({ type: 'setLang', payload: lang });
    window.location.reload();
  };
  const setThemeId = (themeId: any) => {
    dispatch({ type: 'setThemeId', payload: themeId });
  };
  const setCalendar = (data: any) => {
    dispatch({ type: 'setCalendar', payload: data });
  };

  if (!calendar) {
    setCalendar(initcalendar);
  }

  return (
    <Box
      style={{
        height: height - 50,
        overflow: 'auto',
        backgroundColor: '#f5f5f5',
        marginLeft: 5,
        marginRight: 5,
      }}
    >
      <Box style={{ margin: 10 }}>
        <Grid container spacing={2}>
          {isEditor && (
            <Grid item xs={12}>
              <Company
                company={company}
                editCompany={editCompany}
                words={words}
                isRTL={isRTL}
              ></Company>
            </Grid>
          )}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <GenTheme
                  isRTL={isRTL}
                  themeId={themeId}
                  setThemeId={setThemeId}
                ></GenTheme>
              </Grid>
              <Grid item xs={12} md={4}>
                <CalendarOptions
                  calendar={calendar}
                  words={words}
                  setCalendar={setCalendar}
                  isRTL={isRTL}
                ></CalendarOptions>
              </Grid>
              <Grid item xs={12} md={4}>
                <Language
                  lang={lang}
                  setLang={setLang}
                  isRTL={isRTL}
                ></Language>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Options;
