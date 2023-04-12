type TableFooterKeyValueProps = {
  keyy: string
  value: string
}

export const TableFooterKeyValue = ({ keyy, value }: TableFooterKeyValueProps) => (
  <p>
    <span className="font-normal text-gray-500 dark:text-gray-400">{keyy}</span>
    &nbsp;
    <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
  </p>
)

export default TableFooterKeyValue
