/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { getReportEvents } from "../graphql";

export default () => {
  const [getEvents, evnData] = useLazyQuery(getReportEvents, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  const eventsData = evnData?.data?.["getEvents"]?.data || [];
  const events =
    eventsData.length > 0
      ? eventsData.map((ap: any) => {
          return {
            ...ap,
            startDate: new Date(ap.startDate),
            endDate: new Date(ap.endDate),
            start: ap.startDate,
            end: ap.endDate,
          };
        })
      : [];

  return { events, getEvents };
};
