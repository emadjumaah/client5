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

export default () => {
  const [getDeparts, catpData]: any = useLazyQuery(getSendreqs);

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
  }, [getDeparts]);

  const sendreqs = catpData?.data?.['getSendreqs']?.data || [];
  const refreshsendreqs = () => catpData?.refetch();
  return { sendreqs, addSendreq, editSendreq, removeSendreq, refreshsendreqs };
};
