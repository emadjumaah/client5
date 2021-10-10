/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import {
  Plugin,
  Template,
  TemplateConnector,
  TemplatePlaceholder,
} from "@devexpress/dx-react-core";

const PopupEditing = (props: any) => (
  <Plugin>
    <Template name="popupEditing">
      <TemplateConnector>
        {(
          { rows, getRowId, addedRows, editingRowIds, rowChanges },
          {
            stopEditRows,
            cancelAddedRows,
            cancelChangedRows,
            commitChangedRows,
            commitAddedRows,
          },
        ) => {
          const isNew = addedRows.length > 0;
          let editedRow: any;
          let rowId: any;
          if (isNew) {
            rowId = 0;
            editedRow = addedRows[rowId];
          } else {
            [rowId] = editingRowIds;
            const targetRow = rows.filter(
              (row: any) => getRowId(row) === rowId,
            )[0];
            editedRow = { ...targetRow, ...rowChanges[rowId] };
          }

          const rowIds = isNew ? [0] : editingRowIds;

          const applyChanges = () => {
            if (isNew) {
              commitAddedRows({ rowIds });
            } else {
              stopEditRows({ rowIds });
              commitChangedRows({ rowIds });
            }
          };
          const cancelChanges = () => {
            if (isNew) {
              cancelAddedRows({ rowIds });
            } else {
              stopEditRows({ rowIds });
              cancelChangedRows({ rowIds });
            }
          };

          const open = editingRowIds.length > 0 || isNew;
          return (
            <div>
              {React.cloneElement(props.children, {
                ...props,
                open,
                isNew,
                row: editedRow,
                onClose: cancelChanges,
                addAction: props.addAction,
                editAction: props.editAction,
                applyChanges,
              })}
            </div>
          );
        }}
      </TemplateConnector>
    </Template>
    <Template name="root">
      <TemplatePlaceholder />
      <TemplatePlaceholder name="popupEditing" />
    </Template>
  </Plugin>
);

export default PopupEditing;
