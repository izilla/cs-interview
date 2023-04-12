type TableRowProps = {
  data: (string | number)[]
  clickable?: boolean
  onClick?: (datum: string | number) => void
}

export const TableRow = ({ data, clickable, onClick }: TableRowProps) => (
  <tr>
    {data.map(datum => (
      <td
        {...(clickable && onClick ? { onClick: () => onClick(datum) } : {})}
        key={datum}
        className="p-4 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400">
        {datum}
      </td>
    ))}
  </tr>
)

export default TableRow
