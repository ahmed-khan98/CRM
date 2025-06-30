import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'; 


const DetailPageTab = ({data}) => {
    const [activeTab, setActiveTab] = useState("item_spec");
    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleCopy = (value, index) => {
        navigator.clipboard.writeText(value || '').then(() => {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 1500);
        });
    };

    const tabs = [
        { key: "item_spec", label: "Item Spec", color: "bg-red-500" },
        { key: "shipping", label: "Shipping", color: "bg-gray-500" },
        { key: "details", label: "More Info", color: "bg-green-500" },
    ];

    return (
        <div className="mt-8">
            <div className="flex gap-1 mb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-2 py-1 font-semibold flex w-[33%] items-center justify-center rounded-tl-lg rounded-tr-lg text-white cursor-pointer ${activeTab === tab.key
                            ? `border-1 border-black ${tab.color}`
                            : `${tab.color}`
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-1">
                {data?.[activeTab]?.map((e, i) => {
                    const isASIN = e?.name === 'ASIN';
                    const displayValue = isASIN ? e?.code : e?.value;

                    return (
                        <div className="flex gap-2" key={i}>
                            <div className="w-[35%] bg-[#a6a6a6] p-3 flex items-center rounded-lg">
                                <p className="uppercase font-semibold roboto text-sm">{e?.name}</p>
                            </div>
                            <div className="w-[65%] bg-[#d9d9d9] p-3 flex items-center justify-between rounded-lg">
                                <p className="font-semibold  break-words">{displayValue}</p>

                                {isASIN && (
                                    <button
                                        onClick={() => handleCopy(e?.value, i)}
                                        className={`ml-2 flex items-center gap-1 text-xs px-2 py-1 rounded transition-all 
                    ${copiedIndex === i ? 'bg-green-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-900'}
                  `}
                                    >
                                        {copiedIndex === i ? (
                                            <>
                                                <Check size={14} /> Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={14} /> Copy
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
        )    
}

export default DetailPageTab
