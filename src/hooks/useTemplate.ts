/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
//TODO: not used
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import { useState, useEffect } from 'react';
import { getStoreItem } from '../store';

export default () => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const template = store?.template;

  const [tempwords, setTempwords]: any = useState({});

  useEffect(() => {
    const words = template?.words?.[lang];
    setTempwords(words);
  }, [lang]);

  return {
    tempwords,
    tempoptions: template?.options,
    taskExtra: template?.taskExtra,
    sortOrder: template?.sortOrder,
    templateId: template?.id,
  };
};
