import { getStatusConfig } from '@/app/utilities/attendence'
import { Filter, X } from 'lucide-react'
import React, { memo, useMemo } from 'react'

const ActiveFilterShowing = ({ activeFilter, setActiveFilter, length }) => {
  if (!activeFilter) return null;

  const config = useMemo(() => getStatusConfig(activeFilter), [activeFilter]);

  return (
    <div 
      className={`shrink-0 flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200
        ${config.bg} ${config.text} ${config.border}`}
    >
      <span className="flex items-center gap-2 text-[11px]">
        <Filter size={13} className="opacity-70" />
        <span className="tracking-tight">
          Showing <span className="font-black uppercase">{activeFilter}</span> records 
          <span className="mx-1.5 opacity-40">·</span> 
          <span className="font-bold">{length}</span> found
        </span>
      </span>

      <button
        onClick={() => setActiveFilter(null)}
        aria-label="Clear filter"
        className="cursor-pointer p-1 rounded-lg hover:bg-black/10 transition-colors flex items-center justify-center"
      >
        <X size={14} />
      </button>
    </div>
  )
}

// 3. React.memo: Ye component tabhi re-render hoga jab props (filter ya length) change honge
export default memo(ActiveFilterShowing);