/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import getDecryptedLicense from "../graphql/query/getDecryptedLicense";

export default () => {
  const [getLicense, licensData] = useLazyQuery(getDecryptedLicense);

  useEffect(() => {
    getLicense();
  }, [getLicense]);
  const licn = licensData?.data?.["getDecryptedLicense"]?.data || null;
  const lcen = licn ? JSON.parse(licn) : null;
  const branche = lcen?.license?.branches[0]?.name;
  const systems = lcen?.license?.branches[0]?.systems;

  return { branche, systems };
};
