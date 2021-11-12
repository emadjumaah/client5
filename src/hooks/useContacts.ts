/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact,
  createMultiContacts,
  addGroupToContact,
  removeGroupFromContact,
  getGroups,
} from '../graphql';
import syncCustomers from '../graphql/mutation/syncCustomers';
import syncEmployees from '../graphql/mutation/syncEmployees';

export default () => {
  const [getCusts, custData]: any = useLazyQuery(getContacts);

  const [addContact] = useMutation(createContact, {
    refetchQueries: [{ query: getContacts }, { query: getGroups }],
  });
  const [addMultiContacts] = useMutation(createMultiContacts, {
    refetchQueries: [{ query: getContacts }, { query: getGroups }],
  });
  const [editContact] = useMutation(updateContact, {
    refetchQueries: [{ query: getContacts }, { query: getGroups }],
  });
  const [removeContact] = useMutation(deleteContact, {
    refetchQueries: [{ query: getContacts }, { query: getGroups }],
  });
  const [addGtoContact] = useMutation(addGroupToContact, {
    refetchQueries: [{ query: getContacts }, { query: getGroups }],
  });
  const [removeGfromContact] = useMutation(removeGroupFromContact, {
    refetchQueries: [{ query: getContacts }, { query: getGroups }],
  });
  const [syncCust] = useMutation(syncCustomers, {
    refetchQueries: [{ query: getContacts }, { query: getGroups }],
  });
  const [syncEmpl] = useMutation(syncEmployees, {
    refetchQueries: [{ query: getContacts }, { query: getGroups }],
  });

  useEffect(() => {
    getCusts();
  }, [getCusts]);

  const contacts = custData?.data?.['getContacts']?.data || [];
  const refreshcontact = () => custData?.refetch();
  return {
    contacts,
    refreshcontact,
    addContact,
    addMultiContacts,
    editContact,
    removeContact,
    addGtoContact,
    removeGfromContact,
    syncCust,
    syncEmpl,
  };
};
