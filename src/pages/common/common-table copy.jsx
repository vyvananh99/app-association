import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Box,
} from '@mui/material';
import { FixedSizeList as List } from 'react-window';

export default function CommonTable({
  columns,
  data,
  searchQuery,
  tableHeight,
}) {
  const [sorting, setSorting] = useState([]);
  const tableContainerRef = useRef(null);
  const headerRef = useRef(null);

  const parsedHeight = useMemo(() => {
    const th = Number(tableHeight);
    return window.innerHeight - (!isNaN(th) ? th : 300);
  }, [tableHeight]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((row) =>
      columns.some((column) => {
        const value = row[column.accessorKey];
        return value
          ? value.toString().toLowerCase().includes(searchQuery.toLowerCase())
          : false;
      }),
    );
  }, [data, searchQuery, columns]);

  const table = useReactTable({
    columns,
    data: filteredData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const container = tableContainerRef.current;
    const header = headerRef.current;
    if (!container || !header) return;

    const updateWidth = () => setContainerWidth(container.clientWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);

    const syncScroll = () => {
      header.scrollLeft = container.scrollLeft;
    };
    container.addEventListener('scroll', syncScroll);

    return () => {
      window.removeEventListener('resize', updateWidth);
      container.removeEventListener('scroll', syncScroll);
    };
  }, [filteredData]);

  const rowHeight = 40;

  return (
    <TableContainer
      ref={tableContainerRef}
      sx={{
        height: parsedHeight,
        width: '100%',
        overflowY: 'auto',
        overflowX: 'auto',
        '& td, & th': { whiteSpace: 'nowrap' },
      }}
    >
      <Table sx={{ borderCollapse: 'collapse', minWidth: '100%' }}>
        <TableHead
          ref={headerRef}
          sx={{
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            zIndex: 1,
            display: 'flex',
            width: containerWidth,
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              sx={{ display: 'flex', width: '100%' }}
            >
              {headerGroup.headers.map((header) => {
                const def = header.column.columnDef;
                const hasFixedSize = def.size != null;
                const flexGrow = hasFixedSize ? 0 : 1;
                const flexBasis = hasFixedSize ? `${def.size}px` : '0px';
                const minWidth = !hasFixedSize
                  ? `${def.minSize || 100}px`
                  : undefined;

                return (
                  <TableCell
                    key={header.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      overflow: 'hidden',
                      flexGrow,
                      flexShrink: 1,
                      flexBasis,
                      minWidth,
                      borderBottom: 'none',
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <Box
                        sx={{
                          cursor: header.column.getCanSort()
                            ? 'pointer'
                            : 'default',
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted()] ?? null}
                      </Box>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHead>
      </Table>

      {table.getRowModel().rows.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 2 }}>No data</Box>
      ) : (
        <Box sx={{ width: '100%', display: 'block' }}>
          <List
            height={Math.max(40, parsedHeight - rowHeight)}
            itemCount={table.getRowModel().rows.length}
            itemSize={rowHeight}
            width={containerWidth}
          >
            {({ index, style }) => {
              const row = table.getRowModel().rows[index];
              return (
                <Box
                  key={row.id}
                  style={{
                    ...style,
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#fff',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const def = cell.column.columnDef;
                    const hasFixedSize = def.size != null;
                    const flexGrow = hasFixedSize ? 0 : 1;
                    const flexBasis = hasFixedSize ? `${def.size}px` : '0px';
                    const minWidth = !hasFixedSize
                      ? `${def.minSize || 100}px`
                      : undefined;

                    const content = flexRender(
                      def.cell,
                      cell.getContext(),
                    );

                    return (
                      <Box
                        key={cell.id}
                        sx={{
                          display: 'flex',
                          flexGrow,
                          flexShrink: 1,
                          flexBasis,
                          minWidth,
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          justifyContent:
                            def.accessorKey === 'actions'
                              ? 'flex-end'
                              : 'flex-start',
                          p: 1,
                        }}
                      >
                        {content === null ||
                        content === undefined ||
                        String(content).trim() === ''
                          ? '-'
                          : content}
                      </Box>
                    );
                  })}
                </Box>
              );
            }}
          </List>
        </Box>
      )}
    </TableContainer>
  );
}
