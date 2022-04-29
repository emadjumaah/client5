/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  createReminder,
  deleteReminder,
  getReminders,
  updateReminder,
} from '../graphql';
import getNotificationsList from '../graphql/query/getNotificationsList';

export default () => {
  const [getDeparts, catpData]: any = useLazyQuery(getReminders);

  const [addReminder] = useMutation(createReminder, {
    refetchQueries: [{ query: getReminders }, { query: getNotificationsList }],
  });
  const [editReminder] = useMutation(updateReminder, {
    refetchQueries: [{ query: getReminders }, { query: getNotificationsList }],
  });
  const [removeReminder] = useMutation(deleteReminder, {
    refetchQueries: [{ query: getReminders }, { query: getNotificationsList }],
  });

  useEffect(() => {
    getDeparts();
  }, [getDeparts]);

  const reminders = catpData?.data?.['getReminders']?.data || [];
  const refreshreminders = () => catpData?.refetch();
  return {
    reminders,
    addReminder,
    editReminder,
    removeReminder,
    refreshreminders,
  };
};
