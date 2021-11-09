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

export default () => {
  const [getDeparts, catpData]: any = useLazyQuery(getReminders);

  const [addReminder] = useMutation(createReminder, {
    refetchQueries: [{ query: getReminders }],
  });
  const [editReminder] = useMutation(updateReminder, {
    refetchQueries: [{ query: getReminders }],
  });
  const [removeReminder] = useMutation(deleteReminder, {
    refetchQueries: [{ query: getReminders }],
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
