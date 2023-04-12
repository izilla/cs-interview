export const Table = ({ headers, children }: { headers: string[]; children: any }) => (
  <div className="overflow-scroll max-h-[75vh]">
    <table className="table-auto border-collapse border border-slate-600 overflow-scroll w-full">
      <thead className="text-sm bg-slate-50 dark:bg-slate-800 sticky top-[-1px] border-t-1 border-slate-600">
        <tr className="text-md m-2">
          {headers.map((header: string, i) => (
            <th
              key={`${i}.${header}`}
              className="p-4 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-200">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="text-sm">{children}</tbody>
    </table>
  </div>
)

export default Table
