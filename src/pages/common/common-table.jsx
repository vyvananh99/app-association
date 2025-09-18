import React, { useMemo, useRef, useState, useEffect } from 'react';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Box, Table, TableHead, TableRow, TableCell } from '@mui/material';
import { FixedSizeList as List } from 'react-window';

export default function CommonTable({ columns: rawColumns, data, searchQuery, tableHeight, tableWidth }) {
  const [sorting, setSorting] = useState([]);
  const bodyRef = useRef(null);
  const innerHeaderRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(tableWidth || 0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (tableWidth) {
      setContainerWidth(tableWidth);
      return; // không cần ResizeObserver nữa
    }
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [tableWidth]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const parsedHeight = useMemo(() => {
    const th = Number(tableHeight);
    return window.innerHeight - (!isNaN(th) ? th : 300);
  }, [tableHeight]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((row) =>
      rawColumns.some((col) => {
        const value = row[col.accessorKey];
        return value != null ? String(value).toLowerCase().includes(q) : false;
      })
    );
  }, [data, searchQuery, rawColumns]);

  const defaultColumn = {
    minSize: 80,
    size: 120,
    maxSize: 600
  };

  const table = useReactTable({
    data: filteredData,
    columns: rawColumns,
    ...defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onSortingChange: setSorting,
    state: { sorting }
  });

  const rowHeight = 40;

  // 📏 Auto-fill width logic
  const totalSize = table.getTotalSize();
  const growableColumns = table.getAllLeafColumns().filter((col) => (col.columnDef.maxSize || Infinity) > col.columnDef.minSize);

  const autoFillSizes = useMemo(() => {
    if (containerWidth <= 0 || growableColumns.length === 0) return {};
    const extra = containerWidth - totalSize;
    if (extra <= 0) return {};
    const extraPerCol = extra / growableColumns.length;
    return growableColumns.reduce((acc, col) => {
      const base = col.getSize();
      const maxSize = col.columnDef.maxSize || Infinity;
      const newSize = Math.min(base + extraPerCol, maxSize);
      acc[col.id] = newSize;
      return acc;
    }, {});
  }, [containerWidth, totalSize, growableColumns]);

  // Body scroll => header translateX
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

  const safeWidth = (w) => (!isNaN(w) && w > 0 ? w : 100);

  return (
    <Box ref={containerRef} sx={{ border: '1px solid #ddd', overflow: 'hidden', width: '100%' }}>
      {/* HEADER */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#fff',
          zIndex: 2,
          overflowX: 'hidden',
          borderBottom: '1px solid #ddd'
        }}
      >
        <Box
          ref={innerHeaderRef}
          sx={{
            position: 'relative',
            minWidth: Math.max(totalSize, containerWidth)
          }}
        >
          <Table
            sx={{
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
              minWidth: Math.max(totalSize, containerWidth)
            }}
          >
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const columnWidth = safeWidth(autoFillSizes[header.id] ?? header.getSize());
                    return (
                      <TableCell
                        key={header.id}
                        sx={{
                          position: 'relative',
                          width: columnWidth,
                          minWidth: header.column.columnDef.minSize,
                          maxWidth: header.column.columnDef.maxSize,
                          p: 1,
                          userSelect: 'none',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          cursor: header.column.getCanSort() ? 'pointer' : 'default'
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder ? null : (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: header.column.columnDef.accessorKey === 'actions' ? 'flex-end' : 'flex-start',
                              gap: '4px'
                            }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽'
                            }[header.column.getIsSorted()] ?? null}
                          </Box>
                        )}
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
                              backgroundColor: header.column.getIsResizing() ? 'rgba(0, 150, 255, 0.5)' : 'transparent',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 150, 255, 0.2)'
                              }
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
          height: parsedHeight
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
              justifyContent: 'center'
            }}
          >
            No data
          </Box>
        ) : (
          <Box sx={{ minWidth: Math.max(totalSize, containerWidth) }}>
            <List height={Math.max(rowHeight, parsedHeight)} itemCount={table.getRowModel().rows.length} itemSize={rowHeight} width="100%">
              {({ index, style }) => {
                const row = table.getRowModel().rows[index];
                return (
                  <Box
                    key={row.id}
                    style={{
                      ...style,
                      display: 'flex',
                      width: Math.max(totalSize, containerWidth),
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                      borderBottom: '1px solid #ddd'
                    }}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      const columnWidth = safeWidth(autoFillSizes[cell.column.id] ?? cell.column.getSize());
                      const content = flexRender(cell.column.columnDef.cell, cell.getContext());
                      return (
                        <Box
                          key={cell.id}
                          sx={{
                            flexShrink: 0,
                            flexGrow: 0,
                            width: columnWidth,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            p: 1,
                            pl: cellIndex === 0 ? 2 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: cell.column.columnDef.accessorKey === 'actions' ? 'flex-end' : 'flex-start'
                          }}
                        >
                          {content == null || String(content).trim() === '' ? '-' : content}
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
