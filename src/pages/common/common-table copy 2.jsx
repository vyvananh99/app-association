import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { Box, Table, TableHead, TableRow, TableCell } from '@mui/material';
import { FixedSizeList as List } from 'react-window';

export default function CommonTable({ columns: rawColumns, data, searchQuery, tableHeight }) {
  const [sorting, setSorting] = useState([]);
  const bodyRef = useRef(null);
  const headerWrapperRef = useRef(null);
  const innerHeaderRef = useRef(null);

  // Tính chiều cao cho virtualized list
  const parsedHeight = useMemo(() => {
    const th = Number(tableHeight);
    return window.innerHeight - (!isNaN(th) ? th : 300);
  }, [tableHeight]);

  // Bộ lọc dữ liệu theo search
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    return data.filter((row) =>
      rawColumns.some((column) => {
        const value = row[column.accessorKey];
        return value != null ? String(value).toLowerCase().includes(lowerCaseSearchQuery) : false;
      })
    );
  }, [data, searchQuery, rawColumns]);

  const table = useReactTable({
    data: filteredData,
    columns: rawColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onSortingChange: setSorting,
    state: { sorting },
  });

  const rowHeight = 40;

  // Body scroll ngang → header chạy theo (header không scroll độc lập)
  useEffect(() => {
    const body = bodyRef.current;
    const handleScroll = () => {
      if (innerHeaderRef.current) {
        innerHeaderRef.current.style.transform = `translateX(-${body.scrollLeft}px)`;
      }
    };
    body?.addEventListener('scroll', handleScroll);
    return () => body?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{ border: '1px solid #ddd', overflow: 'hidden' }}>
      {/* HEADER */}
      <Box
        ref={headerWrapperRef}
        sx={{
          overflowX: 'hidden',
          overflowY: 'hidden',
          position: 'sticky',
          top: 0,
          backgroundColor: '#fff',
          zIndex: 2,
          borderBottom: '1px solid #ddd',
          minWidth: '100%',
          maxWidth: '100%',
        }}
      >
        <Box ref={innerHeaderRef} sx={{ minWidth: table.getTotalSize(), position: 'relative' }}>
          <Table
            sx={{
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
              minWidth: table.getTotalSize(),
            }}
          >
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  sx={{
                    '& .MuiTableCell-root:first-of-type': { pl: 2 },
                  }}
                >
                  {headerGroup.headers.map((header) => {
                    const columnWidth = header.getSize();
                    return (
                      <TableCell
                        key={header.id}
                        sx={{
                          position: 'relative',
                          width: columnWidth,
                          minWidth: header.column.columnDef.minSize,
                          maxWidth: header.column.columnDef.maxSize,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          p: 1,
                          cursor: header.column.getCanSort() ? 'pointer' : 'default',
                          userSelect: 'none',
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder ? null : (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent:
                                header.column.columnDef.accessorKey === 'actions' ? 'flex-end' : 'flex-start',
                            }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted()] ?? null}
                          </Box>
                        )}

                        {/* Resize handle */}
                        {header.column.getCanResize() && (
                          <Box
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            sx={{
                              position: 'absolute',
                              right: 0,
                              top: 0,
                              height: '100%',
                              width: '5px',
                              cursor: 'col-resize',
                              zIndex: 1,
                              userSelect: 'none',
                            }}
                          />
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
          </Table>
        </Box>
      </Box>

      {/* BODY */}
      <Box
        ref={bodyRef}
        sx={{
          overflowX: 'auto',
          overflowY: 'auto',
          height: parsedHeight,
          minWidth: '100%',
          maxWidth: '100%',
        }}
      >
        {table.getRowModel().rows.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              p: 2,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            No data
          </Box>
        ) : (
          <Box sx={{ minWidth: table.getTotalSize() }}>
            <List
              height={Math.max(rowHeight, parsedHeight)}
              itemCount={table.getRowModel().rows.length}
              itemSize={rowHeight}
              width="100%"
            >
              {({ index, style }) => {
                const row = table.getRowModel().rows[index];
                return (
                  <Box
                    key={row.id}
                    style={{
                      ...style,
                      display: 'flex',
                      width: table.getTotalSize(),
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                      borderBottom: '1px solid #ddd',
                      alignItems: 'stretch',
                    }}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      const columnWidth = cell.column.getSize();
                      const content = flexRender(cell.column.columnDef.cell, cell.getContext());
                      return (
                        <Box
                          key={cell.id}
                          sx={{
                            flexShrink: 0,
                            flexGrow: 0,
                            width: columnWidth,
                            minWidth: cell.column.columnDef.minSize,
                            maxWidth: cell.column.columnDef.maxSize,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            p: 1,
                            pl: cellIndex === 0 ? 2 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent:
                              cell.column.columnDef.accessorKey === 'actions' ? 'flex-end' : 'flex-start',
                          }}
                        >
                          {content === null || content === undefined || String(content).trim() === '' ? '-' : content}
                        </Box>
                      );
                    })}
                  </Box>
                );
              }}
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
}
