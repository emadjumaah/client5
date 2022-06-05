/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PageLayout from '../main/PageLayout';
import PopupCustomerView from '../../pubups/PopupCustomerView';
import useTasks from '../../hooks/useTasks';
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from '../../graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useResoursesUp from '../../hooks/useResoursesUp';
import { useServices } from '../../hooks';
import { Box } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import PopupCustomerImport from '../../pubups/PopupCustomerImport';
import ImportBtn from '../../common/ImportBtn';
import createMultiCustomers from '../../graphql/mutation/createMultiCustomers';
import CustomerCardList from '../../components/items/CustomerCardList';
import { searchInRows } from '../../common/helpers';
import { PopupCustomer } from '../../pubups';
import { AlertLocal } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';

export default function Customers(props: any) {
  const { isRTL, words, menuitem, theme, company } = props;
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [rows, setRows] = useState([]);
  const [frows, setFRows] = useState([]);
  const [openImport, setOpenImport] = useState(false);

  const [item, setItem] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [query, setQuery] = useState('');

  const { height } = useWindowDimensions();
  const { tasks } = useTasks();
  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();
  const { services } = useServices();

  const handleSearch = (e: any) => {
    const q = e.target.value;
    setQuery(q);
  };
  const onOpenCreate = (item: any) => {
    setItem(null);
    setOpenEdit(true);
  };
  const onOpenView = (item: any) => {
    setItem(item);
    setOpenView(true);
  };
  const onCloseView = () => {
    setOpenView(false);
    setItem(null);
  };

  const onOpenEdit = (item: any) => {
    setItem(item);
    setOpenEdit(true);
  };
  const onCloseEdit = () => {
    setOpenEdit(false);
    setItem(null);
  };

  const onDeleteItem = async (_id: any) => {
    const res = await removeCustomer({ variables: { _id } });
    if (res?.data?.deleteCustomer?.ok === false) {
      if (res?.data?.deleteCustomer?.error.includes('related')) {
        await errorDeleteAlert(setAlrt, isRTL);
      } else {
        await errorAlert(setAlrt, isRTL);
      }
    }
  };

  const [loadCusts, custssData]: any = useLazyQuery(getCustomers, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    loadCusts({ isRTL });
  }, []);

  const refresQuery = {
    refetchQueries: [
      {
        query: getCustomers,
        variables: { isRTL },
      },
    ],
  };

  const [addCustomer] = useMutation(createCustomer, refresQuery);
  const [addMultiCustomers] = useMutation(createMultiCustomers, refresQuery);
  const [editCustomer] = useMutation(updateCustomer, refresQuery);
  const [removeCustomer] = useMutation(deleteCustomer, refresQuery);

  useEffect(() => {
    if (custssData?.data?.getCustomers?.data) {
      const { data } = custssData.data.getCustomers;
      setRows(data);
      setFRows(data);
    }
  }, [custssData]);

  useEffect(() => {
    if (!query || query === '') {
      setFRows(rows);
    } else {
      const frows = searchInRows({ rows, query });
      setFRows(frows);
    }
  }, [query]);

  const refresh = () => {
    custssData?.refetch();
  };

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refresh}
    >
      <Box
        style={{
          height: height - 50,
          overflow: 'auto',
          backgroundColor: '#f3f3f3',
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <ImportBtn
          open={() => setOpenImport(true)}
          isRTL={isRTL}
          theme={theme}
        ></ImportBtn>
        <CustomerCardList
          query={query}
          handleSearch={handleSearch}
          rows={frows}
          isRTL={isRTL}
          onOpenView={onOpenView}
          onOpenCust={onOpenEdit}
          onCreateItem={onOpenCreate}
          onDeleteCust={onDeleteItem}
        ></CustomerCardList>
        <PopupCustomer
          open={openEdit}
          onClose={onCloseEdit}
          row={item}
          isNew={!(item && item._id)}
          theme={theme}
          addAction={addCustomer}
          editAction={editCustomer}
        ></PopupCustomer>
        <PopupCustomerView
          open={openView}
          onClose={onCloseView}
          row={item}
          isNew={false}
          addAction={addCustomer}
          editAction={editCustomer}
          theme={theme}
          departments={departments}
          company={company}
          employees={employees}
          resourses={resourses}
          servicesproducts={services}
          customers={rows}
          tasks={tasks}
        ></PopupCustomerView>
        <PopupCustomerImport
          open={openImport}
          onClose={() => setOpenImport(false)}
          addMultiItems={addMultiCustomers}
          isRTL={isRTL}
          theme={theme}
          words={words}
        ></PopupCustomerImport>
        {alrt.show && (
          <AlertLocal
            isRTL={isRTL}
            type={alrt?.type}
            msg={alrt?.msg}
            top
          ></AlertLocal>
        )}
      </Box>
    </PageLayout>
  );
}
