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
import { roles } from '../../common';
import { useMutation } from '@apollo/client';
import updateUserTheme from '../../graphql/mutation/updateUserTheme';
// import { PDFViewer } from '@react-pdf/renderer';
// import MyPDFDocument from '../../print/pdf/MyPDFDocument';

const initcalendar = {
  duration: 30,
  start: 8.5,
  end: 21.5,
};

const Options = ({ isRTL, words, company, editCompany }: any) => {
  const { store, dispatch }: GContextTypes = useContext(GlobalContext);
  const lang = store?.lang;
  const calendar = store?.calendar;
  const themeId = store?.themeId;
  const { height } = useWindowDimensions();
  const [addUserTheme] = useMutation(updateUserTheme);

  const setLang = (lang: any) => {
    dispatch({ type: 'setLang', payload: lang });
    window.location.reload();
  };
  const setThemeId = (id: any) => {
    dispatch({ type: 'setThemeId', payload: id });
    addUserTheme({ variables: { themeId: id } });
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
      <Box style={{ margin: 10, marginBottom: 20 }}>
        <Grid container spacing={2}>
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
          {roles.isBranchAdmin() && (
            <Grid item xs={12}>
              <Company
                company={company}
                editCompany={editCompany}
                words={words}
                isRTL={isRTL}
              ></Company>
            </Grid>
          )}
        </Grid>
      </Box>
      {/* <Box style={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <MyPDFDocument />
        </PDFViewer>
      </Box> */}
    </Box>
  );
};

export default Options;
