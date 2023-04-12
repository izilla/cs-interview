import { ReactNode } from 'react'

export const TableFooter = ({ children }: { children: ReactNode }) => (
  <div className="relative overflow-hidden bg-white dark:bg-gray-800">
    <nav className="flex flex-row items-center justify-between px-4 py-8" aria-label="Table navigation">
      {children}
    </nav>
  </div>
)

export default TableFooter
