/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
//TODO: not used
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import { useState, useEffect } from "react";
import { en, ar, translation } from "../languages";

export default (lang: any) => {
  const transD = lang === "ar" ? translation(ar) : translation(en);
  const [translate, setTranslate] = useState(transD);

  useEffect(() => {
    setTranslate(transD);
  }, [lang]);

  return translate;
};
