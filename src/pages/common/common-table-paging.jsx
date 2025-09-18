import React, { useState, useEffect, useMemo, useRef } from 'react';
import { flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const CommonTablePaging = ({ columns, data, searchQuery, tableHeight, pagination, handleChangePaging }) => {
  const [sorting, setSorting] = useState([]);
  const [columnSizing, setColumnSizing] = useState({});
  const tableContainerRef = useRef(null);
  const headerRef = useRef(null);
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((row) =>
      columns.some((column) => {
        const value = row[column.accessorKey];
        return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
      })
    );
  }, [data, searchQuery, columns]);

  const table = useReactTable({
    columns: columns.map((col) => ({
      ...col,
      size: col.size || 150
    })),
    data: filteredData,
    state: {
      sorting,
      pagination,
      columnSizing
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
      handleChangePaging(newPagination);
    },
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange'
  });

  // Adjust sticky header width on mount & data change
  useEffect(() => {
    if (tableContainerRef.current && headerRef.current) {
      const containerWidth = tableContainerRef.current.offsetWidth;
      headerRef.current.style.width = `${containerWidth}px`;
    }
  }, [filteredData]);

  return (
    <>
      <TableContainer
        ref={tableContainerRef}
        sx={{
          height: tableHeight,
          overflow: 'auto',
          width: '100%',
          border: '1px solid rgba(224, 224, 224, 1)',
          '& td, & th': {
            whiteSpace: 'nowrap',
            borderBottom: '1px solid rgb(190, 190, 190)'
          }
        }}
      >
        <Table
          sx={{
            borderCollapse: 'collapse',
            minWidth: '100%',
            tableLayout: 'fixed'
          }}
        >
          <TableHead
            ref={headerRef}
            style={{
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              zIndex: 1,
              boxShadow: '1px 2px 5px rgba(0, 0, 0, 0.1)'
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id} colSpan={header.colSpan} sx={{ position: 'relative', paddingRight: 2 }}>
                    {!header.isPlaceholder && (
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: header.column.getCanSort() ? 'pointer' : 'default'
                        }}
                      >
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        <span>
                          {{
                            asc: '🔼',
                            desc: '🔽'
                          }[header.column.getIsSorted()] ?? ''}
                        </span>
                      </div>
                    )}

                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: '5px',
                          cursor: 'col-resize',
                          zIndex: 10
                        }}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#fff',
                  '&:hover': { backgroundColor: '#e0e0e0' }
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    sx={{
                      width: `${columnSizing[cell.column.id] || cell.column.getSize()}px`,
                      wordBreak: 'break-word',
                      whiteSpace: 'normal'
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ width: '100%' }} display="flex" justifyContent="center" alignItems="center" gap={1}>
        <IconButton
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          sx={{
            border: '1px solid #ccc',
            borderRadius: '50%',
            width: 40,
            height: 40
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        {(() => {
          const totalPages = table.getPageCount();
          const currentPage = pagination.pageIndex;
          let startPage = Math.max(0, currentPage - 2);
          let endPage = Math.min(totalPages - 1, startPage + 4);

          if (endPage - startPage < 4) {
            startPage = Math.max(0, endPage - 4);
          }

          return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
            const pageIndex = startPage + i;
            const isActive = pageIndex === pagination.pageIndex;
            return (
              <Button
                key={pageIndex}
                onClick={() => table.setPageIndex(pageIndex)}
                sx={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: '50%',
                  padding: 0,
                  border: '1px solid #ccc',
                  bgcolor: isActive ? 'rgba(22, 119, 255, 0.9)' : 'transparent',
                  color: isActive ? '#fff' : '#444',
                  '&:hover': {
                    bgcolor: isActive ? 'rgba(22, 119, 255, 0.9)' : '#f0f0f0'
                  }
                }}
              >
                {pageIndex + 1}
              </Button>
            );
          });
        })()}

        <IconButton
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          sx={{
            border: '1px solid #ccc',
            borderRadius: '50%',
            width: 40,
            height: 40
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default CommonTablePaging;
