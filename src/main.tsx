import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

import {
  Column,
  createTable,
  TableInstance,
  useTableInstance,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from '@tanstack/react-table'

import {RankingInfo, rankItem, rankings,} from '@tanstack/match-sorter-utils'

import {defaultData, Person} from './makeData'

const table = createTable()
  .setRowType<Person>()
  .setFilterMetaType<RankingInfo>()
  .setOptions({
    filterFns: {
      fuzzy: (row, columnId, value, addMeta) => {
        // Rank the item
        const itemRank = rankItem(row.getValue(columnId), value, {
          threshold: rankings.MATCHES,
        })

        // Store the ranking info
        addMeta(itemRank)

        // Return if the item should be filtered in/out
        return itemRank.passed
      },
    },
  })

function App() {

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const columns = React.useMemo(
    () => [
      table.createDataColumn('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id,
      }),
      table.createDataColumn(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      }),
      table.createDataColumn(row => `${row.firstName} ${row.lastName}`, {
        id: 'fullName',
        header: 'Full Name',
        cell: info => info.getValue(),
        footer: props => props.column.id,
        filterFn: 'fuzzy',
      }),
      table.createDataColumn('age', {
        header: () => 'Age',
        footer: props => props.column.id,
      }),
      table.createDataColumn('visits', {
        header: () => <span>Visits</span>,
        footer: props => props.column.id,
      }),
      table.createDataColumn('status', {
        header: 'Status',
        cell: (info) => <span>{JSON.stringify(info.getValue())}</span>,
        footer: props => props.column.id,
      }),
      table.createDataColumn('progress', {
        header: 'Profile Progress',
        footer: props => props.column.id,
      }),
    ],
    []
  )

  const instance = useTableInstance(table, {
    data: defaultData,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  React.useEffect(() => {
    if (instance.getState().columnFilters[0]?.id === 'fullName') {
      if (instance.getState().sorting[0]?.id !== 'fullName') {
        instance.setSorting([{id: 'fullName', desc: false}])
      }
    }
  }, [instance.getState().columnFilters[0]?.id])

  return (
    <div>
      <table>
        <thead>
        {instance.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              return (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {header.renderHeader()}
                      </div>
                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter
                            column={header.column}
                            instance={instance}
                          />
                        </div>
                      ) : null}
                    </>
                  )}
                </th>
              )
            })}
          </tr>
        ))}
        </thead>
        <tbody>
        {instance.getRowModel().rows.map(row => {
          return (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => {
                return <td key={cell.id}>{cell.renderCell()}</td>
              })}
            </tr>
          )
        })}
        </tbody>
      </table>
      <pre>{JSON.stringify(instance.getState(), null, 2)}</pre>
    </div>
  )
}

function Filter({
                  column,
                  instance,
                }: {
  column: Column<any>
  instance: TableInstance<any>
}) {
  const firstValue = instance
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  return typeof firstValue === 'number' ? (
    <div>
      <div>
        <input
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={event =>
            column.setFilterValue((old: [number, number]) => [event.target.value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ''
          }`}
        />
        <input
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={event =>
            column.setFilterValue((old: [number, number]) => [old?.[0], event.target.value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ''
          }`}
        />
      </div>
    </div>
  ) : (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 10).map(value => <option value={value} key={value}/>)}
      </datalist>
      <input type={'text'} value={String(columnFilterValue ?? '')} onChange={e => column.setFilterValue(e.target.value)}
             placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
             list={column.id + 'list'}
      />
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
)
