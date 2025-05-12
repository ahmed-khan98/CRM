import React, { useEffect, useState } from 'react'

const BiddingHistory = ({history,isSold}) => {
    const [visibleBidsHistory, setVisibleBidsHistory] = useState([]);
      const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        setVisibleBidsHistory(history?.slice(0, 4))
    }, [])

    const toggleBidHistory = () => {
        if (showAll) {
            setVisibleBidsHistory(history?.slice(0, 4));
        } else {
            setVisibleBidsHistory(history);
        }
        setShowAll(!showAll);
    };

    return (
        <div className="bg-white shadow rounded-md sm:p-4 sm:mr-4 xl:mr-0">
            <div className="flex justify-between px-4 sm:px-0 pt-4 sm:pt-0">
                <p className="  text-left font-bold uppercase mb-1 text-title-xs">
                    Bid History
                </p>
            </div>
            <div>

                {visibleBidsHistory?.map((e, i) => (
                    <div
                        key={e._id}
                        className={`py-2 border-b border-b-gray-400 ${i == '0' && isSold ? 'bg-emerald-100' : ''}`}
                    >
                        <div className="grid grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_0.5fr)] md:grid-cols-5 justify-items-start items-center px-4 sm:px-3 py-1 rounded ">
                            <p className="text-label-md text-left ">Bidder no {history?.length - i}</p>
                            <p className="text-label-md  text-left md:justify-self-center">
                                {e?.bidder?.username}
                            </p>
                            <p className="text-label-md  text-left col-start-1 md:col-start-3 md:justify-self-center">
                                ${e?.bidAmount}
                            </p>
                            <p className="text-label-md  text-left whitespace-nowrap">
                                {new Date(e.createdAt).toLocaleString()}
                            </p>

                        </div>
                    </div>
                ))}
            </div>
            {history?.length > 4 &&
                <button onClick={toggleBidHistory} className="w-full cursor-pointer flex justify-between py-2 px-4 md:px-0">
                    <p className="uppercase text-burgundy-900 font-semibold">
                        {showAll ? "View Less" : `View ${history?.length - 4} more bids`}
                    </p>
                    {showAll ? (
                        <svg width="24" height="24" className="fill-burgundy-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M246.6 105.4c6.2-6.2 16.4-6.2 22.6 0l192 192c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L256 139.3 73.4 320c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l192-192z" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" className="fill-burgundy-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M267.3 395.3c-6.2 6.2-16.4 6.2-22.6 0l-192-192c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L256 361.4 436.7 180.7c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6l-192 192z" />
                        </svg>
                    )}
                </button>}
        </div>
    )
}

export default React.memo(BiddingHistory)