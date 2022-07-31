/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  createSendreq,
  deleteSendreq,
  getSendreqs,
  updateSendreq,
} from '../graphql';
import { getOoredooSMSlist } from '../graphql/query';

export default () => {
  const [getDeparts, catpData]: any = useLazyQuery(getSendreqs);
  const [getOoredooList, ooredooData]: any = useLazyQuery(getOoredooSMSlist);

  const [addSendreq] = useMutation(createSendreq, {
    refetchQueries: [{ query: getSendreqs }],
  });
  const [editSendreq] = useMutation(updateSendreq, {
    refetchQueries: [{ query: getSendreqs }],
  });
  const [removeSendreq] = useMutation(deleteSendreq, {
    refetchQueries: [{ query: getSendreqs }],
  });

  useEffect(() => {
    getDeparts();
    getOoredooList();
  }, [getDeparts]);
  const sendreqs = catpData?.data?.['getSendreqs']?.data || [];
  const ooredooList = ooredooData?.data?.['getOoredooSMSlist']?.data || `[]`;
  const ooredoo = JSON.parse(ooredooList);
  const refreshsendreqs = () => catpData?.refetch();
  return {
    sendreqs,
    addSendreq,
    editSendreq,
    removeSendreq,
    refreshsendreqs,
    ooredoo,
    loading: catpData?.loading,
  };
};
