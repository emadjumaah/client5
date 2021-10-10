/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createMuiTheme } from "@material-ui/core";
import { palettes } from "./palettes";
import { themeArData, themeEnData } from "./themes";

export const createThem = ({ lang, themeId }: any) => {
  const themeData = lang === "ar" ? themeArData : themeEnData;
  const paletteData = palettes[Number(themeId)];

  // @ts-ignore
  const theme: any = createMuiTheme({
    ...paletteData,
    ...themeData,
  });
  return theme;
};
