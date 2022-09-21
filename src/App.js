import React, { useState } from "react";
import styled from "styled-components";
import { useTable, useRowSelect, useMountedLayoutEffect } from "react-table";
import { dataTab } from "../data";
console.log("hello");
const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, data, selectedRows, onSelectedRowsChange }) {
  // Use the state and functions returned from useTable to build your UI
  const inst = useTable(
    {
      getRowId: (row) => row.productId,
      columns,
      data,
      initialState: {
        selectedRowIds: selectedRows
      }
      // state: {
      //   selectedRowIds: selectedRows
      // }
    },
    useRowSelect
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { selectedRowIds }
  } = inst;

  console.log("INIT::", inst);

  // Keep parent/store state in sync with local state
  // No need to update on mount since we are passing initial state
  useMountedLayoutEffect(() => {
    console.log("SELECTED ROWS CHANGED", selectedRowIds);
    onSelectedRowsChange && onSelectedRowsChange(selectedRowIds);
  }, [onSelectedRowsChange, selectedRowIds]);

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(
            (row, i) =>
              prepareRow(row) || (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              )
          )}
        </tbody>
      </table>
    </>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      // Let's make a column for selection
      {
        id: "selection",
        // The header can use the table's getToggleAllRowsSelectedProps method
        // to render a checkbox
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <div>
            <input type="checkbox" />
          </div>
        ),
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({ row }) => (
          <div>
            <input type="checkbox" {...row.getToggleRowSelectedProps()} />
          </div>
        )
      },
      {
        Header: "Name",
        columns: [
          {
            Header: "productId",
            accessor: "productId"
          },
          {
            Header: " productName",
            accessor: "productName"
          }
        ]
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "productFamily",
            accessor: "productFamily"
          },
          {
            Header: "rateType",
            accessor: "rateType"
          }
        ]
      }
    ],
    []
  );

  // const data = React.useMemo(() => makeData(10), []);
  const data = dataTab;

  const [selectedRows, setSelectedRows] = useState({
    "01t1L00000LOpHNQA1": true,
    "01t1V00000K3Z4aQAF": true
  });

  const selectedRowKeys = Object.keys(selectedRows);
  console.log({ selectedRows });

  return (
    <Styles>
      <Table
        columns={columns}
        data={data}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
      />
      <p>Selected Rows: {selectedRowKeys.length}</p>
      <pre>
        <code>
          {JSON.stringify(
            {
              selectedRowKeys
            },
            null,
            2
          )}
        </code>
      </pre>
    </Styles>
  );
}

export default App;
