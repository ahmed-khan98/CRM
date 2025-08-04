"use client"

import { useEffect, useState, useRef } from "react"
import Cookies from "js-cookie"
import toast, { Toaster } from "react-hot-toast"
import { User, MapPin, CheckCircle, Printer, } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Tab from "@/app/_Components/Tab/page"
import { myAccountTabs } from "@/app/utilities/tabs/page"
import { US_STATES } from "@/app/utilities/state"

const page = () => {
    const [showSuccess, setShowSuccess] = useState(false)
    const printRef = useRef()

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        note: "",
        accountNo: "",
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
        },
    })

    useEffect(() => {
        const data = Cookies.get("currentuser")
        if (data) {
            const user = JSON.parse(data)
            setFormData({
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
                email: user?.email || "",
                accountNo: '098767' || "",
                address: {
                    street: user?.address?.street || "",
                    city: user?.address?.city || "",
                    state: user?.address?.state || "",
                    zipCode: user?.address?.zipCode || "",
                },
            })
        }
    }, [])

    const handlePrint = () => {
        if (printRef.current) {
            const printContents = printRef.current.innerHTML
            const win = window.open('', '', 'height=800,width=1000')
            win.document.write('<html><head><title>Account Info</title>')
            win.document.write('</head><body>')
            win.document.write(printContents)
            win.document.write('</body></html>')
            win.document.close()
            win.focus()
            win.print()
            win.close()
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-4 px-4">
            <Toaster position="top-center" />
            <div className="max-w-5xl mx-auto pt-4">

                <Tab tabs={myAccountTabs} />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 my-6"
                >


                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-green-50 border-l-4 border-green-500 p-4 mx-8"
                            >
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <p className="text-green-700">Your Address Detail has been updated successfully!</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form className="p-4 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-gray-700 font-medium pl-4">
                                    <User size={16} className="text-[#F33E0A]" />
                                    Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={`${formData.firstName} ${formData.lastName}`}
                                        disabled
                                        className={`w-full p-4  border bg-gray-50  
                                             border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F33E0A] transition-all duration-200`}
                                        placeholder="Your city"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-gray-700 font-medium pl-4">
                                    <User size={16} className="text-[#F33E0A]" />
                                   User Account Number
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="accountNo"
                                        value={formData?.accountNo}
                                        disabled
                                        className={`w-full p-4  border bg-gray-50  
                                             border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F33E0A] transition-all duration-200`}
                                        placeholder="Your city"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-gray-700 font-medium pl-4">
                                    <MapPin size={16} className="text-[#F33E0A]" />
                                    Street Address
                                </label>
                                <div className="relative">
                                    <input
                                        name="address.street"
                                        value={formData?.address?.street}
                                        disabled
                                        // rows={4}
                                        className={`w-full p-4  border bg-gray-50
                                             border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F33E0A] transition-all duration-200`}
                                        placeholder="Your full street address"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-gray-700 font-medium pl-4">
                                    <MapPin size={16} className="text-[#F33E0A]" />
                                    City
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="address.city"
                                        value={formData?.address?.city}
                                        disabled
                                        className={`w-full p-4  border bg-gray-50  
                                             border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F33E0A] transition-all duration-200`}
                                        placeholder="Your city"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-gray-700 font-medium pl-4">
                                    <MapPin size={16} className="text-[#F33E0A]" />
                                    State
                                </label>
                                <div className="relative">
                                    <select
                                        name="address.state"
                                        value={formData?.address?.state}
                                        disabled
                                        className={`w-full p-4  border bg-gray-50  
                                             border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F33E0A] transition-all duration-200`}
                                    >
                                        <option value="">Select a state</option>
                                        {US_STATES.map((state) => (
                                            <option key={state} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-gray-700 font-medium pl-4">
                                    <MapPin size={16} className="text-[#F33E0A]" />

                                    Zip Code
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="address.zipCode"
                                        value={formData?.address?.zipCode}
                                        disabled
                                        className={`w-full p-4  border bg-gray-50
                                             border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F33E0A] transition-all duration-200`}
                                        placeholder="Your zip code"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1 mt-2">
                            <label className="flex items-center gap-2 text-gray-700 font-medium pl-4">
                                <MapPin size={16} className="text-[#F33E0A]" />

                                Note
                            </label>
                            <div className="relative">
                                <textarea
                                    onChange={(e) => setFormData((prev) => ({
                                        ...prev,
                                        note: e.target.value,
                                    }))}
                                    type="text"
                                    name="note"
                                    // row={4}
                                    value={formData.note}
                                    className={`w-full p-4  border bg-gray-50  
                                             border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F33E0A] transition-all duration-200`}
                                    placeholder="Your notes"
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="mt-3 flex justify-center"
                            >
                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    className="group cursor-pointer relative overflow-hidden px-6 py-2 bg-[#F33E0A] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-70 min-w-[150px]"
                                >
                                    <span className="relative flex items-center justify-center gap-2">
                                        Print
                                        <Printer className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </button>
                            </motion.div>

                        </AnimatePresence>
                    </form>

                    <div className="hidden print:block p-8" ref={printRef}>
                        <h1 className="text-lg font-bold mb-6">User Account Info</h1>
                        <h2><strong>User Account No. :</strong> {formData.accountNo}</h2>
                        <p ><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                        <p ><strong>Email:</strong> {formData.email}</p>
                        <p ><strong>Street:</strong> {formData.address.street}</p>
                        <p ><strong>City:</strong> {formData.address.city}</p>
                        <p ><strong>State:</strong> {formData.address.state}</p>
                        <p ><strong>Zip Code:</strong> {formData.address.zipCode}</p>
                        <p ><strong>Note:</strong> {formData.note}</p>
                    </div>

                </motion.div>
            </div>
        </div>
    )
}

export default page
