/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@material-ui/core";
import { systemsNames } from "../constants/menu";

export default function UserRoles({
  branches,
  roles,
  handleChangeRoles,
  brch,
  isRTL,
}) {
  const manager = isRTL ? "المدير العام" : "General Manager";
  return (
    <Box>
      {branches.map((branch: any) => {
        const systems = ["cal", "pos", "exp", "acc"];
        if (branch.basename === brch) {
          return (
            <Box key={branch.basename}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={roles?.[branch.basename]?.admin || false}
                    onChange={() =>
                      handleChangeRoles({
                        branch: branch.basename,
                        system: null,
                        role: "admin",
                      })
                    }
                    name={branch.basename.admin}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" style={{ fontWeight: "bold" }}>
                    {manager}
                  </Typography>
                }
              />
              <Box>
                {systems.map((bs: any) => {
                  return (
                    <div key={bs}>
                      <FormGroup row>
                        <Box style={{ minWidth: 150, marginTop: 10 }}>
                          <Typography
                            variant="subtitle2"
                            style={{ fontWeight: "bold" }}
                          >
                            {isRTL
                              ? systemsNames[bs].nameAr
                              : systemsNames[bs].name}
                          </Typography>
                        </Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                roles?.[branch.basename]?.[bs]?.admin || false
                              }
                              onChange={() =>
                                handleChangeRoles({
                                  branch: branch.basename,
                                  system: bs,
                                  role: "admin",
                                })
                              }
                              size="small"
                              disabled={roles?.[branch.basename]?.admin}
                              indeterminate={roles?.[branch.basename]?.admin}
                              name={`${bs}admin`}
                              color="primary"
                            />
                          }
                          label={
                            <Typography variant="body2" color="textSecondary">
                              {isRTL ? "مدير" : "Admin"}
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                roles?.[branch.basename]?.[bs]?.edit || false
                              }
                              onChange={() =>
                                handleChangeRoles({
                                  branch: branch.basename,
                                  system: bs,
                                  role: "edit",
                                })
                              }
                              size="small"
                              disabled={
                                roles?.[branch.basename]?.admin ||
                                roles?.[branch.basename]?.[bs]?.admin
                              }
                              indeterminate={
                                roles?.[branch.basename]?.admin ||
                                roles?.[branch.basename]?.[bs]?.admin
                              }
                              name={`${bs}edit`}
                              color="primary"
                            />
                          }
                          label={
                            <Typography variant="body2" color="textSecondary">
                              {isRTL ? "محرر" : "Editor"}
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                roles?.[branch.basename]?.[bs]?.view || false
                              }
                              onChange={() =>
                                handleChangeRoles({
                                  branch: branch.basename,
                                  system: bs,
                                  role: "view",
                                })
                              }
                              size="small"
                              disabled={
                                roles?.[branch.basename]?.admin ||
                                roles?.[branch.basename]?.[bs]?.admin ||
                                roles?.[branch.basename]?.[bs]?.edit
                              }
                              indeterminate={
                                roles?.[branch.basename]?.admin ||
                                roles?.[branch.basename]?.[bs]?.admin ||
                                roles?.[branch.basename]?.[bs]?.edit
                              }
                              name={`${bs}view`}
                              color="primary"
                            />
                          }
                          label={
                            <Typography variant="body2" color="textSecondary">
                              {isRTL ? "مشاهد" : "Viwer"}
                            </Typography>
                          }
                        />
                      </FormGroup>
                    </div>
                  );
                })}
              </Box>
            </Box>
          );
        } else {
          return <div key={branch.basename}></div>;
        }
      })}
    </Box>
  );
}
