/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMutation } from "@apollo/client";
import { createEvent, deleteEvent, getEvents, updateEvent } from "../graphql";

export default () => {
  const [addEvent] = useMutation(createEvent, {
    refetchQueries: [{ query: getEvents }],
  });
  const [editEvent] = useMutation(updateEvent);
  const [removeEvent] = useMutation(deleteEvent, {
    refetchQueries: [{ query: getEvents }],
  });

  return { addEvent, editEvent, removeEvent };
};
