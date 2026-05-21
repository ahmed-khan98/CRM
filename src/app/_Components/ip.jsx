import React, { memo } from 'react'

const Ip = ({loggedErrorMessage}) => {
  return (
     <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4">
           <div className="w-full max-w-md bg-white border border-red-200 shadow-lg rounded-2xl p-6 text-center">
             <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <h2 className="text-xl font-semibold text-red-700 mb-2">Data load failed</h2>
             <p className="text-sm text-zinc-600 mb-4 break-words whitespace-pre-wrap">
               {loggedErrorMessage}
             </p>
             <button
               type="button"
               onClick={() => window.location.reload()}
               className="cursor-pointer rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
             >
               Refresh page
             </button>
           </div>
         </div>
  )
}

export default memo(Ip)
