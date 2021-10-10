import { Box, Button, Grid, Paper, Typography } from "@material-ui/core";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { GlobalContext } from "../../contexts";
import { PopupTextField } from "../../Shared";

export default function Names({ isRTL, words, setNames }) {
  const { store } = useContext(GlobalContext);
  const { names } = store;
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      tasks: names ? names?.tasks : null,
      customers: names ? names?.customers : null,
      employees: names ? names?.employees : null,
      departments: names ? names?.departments : null,
    },
  });

  const onSubmit = (data: any) => {
    const { customers, departments, employees, tasks } = data;
    if (
      customers?.length < 3 ||
      customers?.length < 3 ||
      customers?.length < 3 ||
      customers?.length < 3
    ) {
      return;
    }
    const names = {
      tasks,
      customers,
      employees,
      departments,
    };
    setNames(names);
  };

  return (
    <Paper>
      <Box padding={3}>
        <Typography variant="h6">
          {isRTL ? "تعديل الاسماء" : "Edit Names"}
        </Typography>
        <Box
          style={{
            marginTop: 20,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <PopupTextField
                name="tasks"
                label={words.task}
                register={register}
                errors={errors}
              />
            </Grid>
            {/* <Grid item xs={6}>
              <PopupTextField
                name="tasksAr"
                label={words.task}
                register={register}
                errors={errors}
              />
            </Grid> */}
            <Grid item xs={3}>
              <PopupTextField
                name="employees"
                label={words.employee}
                register={register}
                errors={errors}
              />
            </Grid>
            {/* <Grid item xs={6}>
              <PopupTextField
                name="employeesAr"
                label={words.employee}
                register={register}
                errors={errors}
              />
            </Grid> */}
            <Grid item xs={6}></Grid>
            <Grid item xs={3}>
              <PopupTextField
                name="departments"
                label={words.department}
                register={register}
                errors={errors}
              />
            </Grid>
            {/* <Grid item xs={6}>
              <PopupTextField
                name="departmentsAr"
                label={words.deparrtment}
                register={register}
                errors={errors}
              />
            </Grid> */}
            <Grid item xs={3}>
              <PopupTextField
                name="customers"
                label={words.customer}
                register={register}
                errors={errors}
              />
            </Grid>
            {/* <Grid item xs={6}>
              <PopupTextField
                name="customersAr"
                label={words.customer}
                register={register}
                errors={errors}
              />
            </Grid> */}
          </Grid>

          <Box
            display="flex"
            style={{
              alignItems: "center",
              justifyContent: "flex-start",
              height: 50,
              // marginTop: 20,
            }}
          >
            <Button
              onClick={handleSubmit(onSubmit)}
              color="primary"
              variant="contained"
              style={{
                width: 90,
                height: 34,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography>{words.save}</Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
