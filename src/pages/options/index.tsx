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

const initcalendar = {
  duration: 30,
  start: 8.5,
  end: 21.5,
};

const Options = ({ isRTL, words, isEditor, company, editCompany }: any) => {
  const { store, dispatch }: GContextTypes = useContext(GlobalContext);
  const { lang, themeId, calendar } = store;

  const setLang = (lang: any) => {
    dispatch({ type: 'setLang', payload: lang });
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
        padding: 10,
      }}
    >
      <Grid container spacing={2}>
        {isEditor && (
          <Grid item xs={12} md={10}>
            <Company
              company={company}
              editCompany={editCompany}
              words={words}
              isRTL={isRTL}
            ></Company>
          </Grid>
        )}
        <Grid item xs={12} md={10}>
          <Language lang={lang} setLang={setLang} isRTL={isRTL}></Language>
        </Grid>

        <Grid item xs={12} md={10}>
          <CalendarOptions
            calendar={calendar}
            words={words}
            setCalendar={setCalendar}
            isRTL={isRTL}
          ></CalendarOptions>
        </Grid>

        <Grid item xs={12} md={10}>
          <GenTheme
            isRTL={isRTL}
            themeId={themeId}
            setThemeId={setThemeId}
          ></GenTheme>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Options;
