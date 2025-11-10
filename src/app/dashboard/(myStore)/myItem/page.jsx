// "use client"

// import { useEffect, useState } from "react"
// import Cookies from "js-cookie"
// import { Calendar, Clock, Edit, Store, Truck } from "lucide-react"
// import { motion } from "framer-motion"
// import { useAllAppointmentQuery } from "@/app/_Services/appointment/page"
// import { formatDate, formatTime12Hour } from "@/app/utilities/date"
// import EditAppointmentModal from "@/app/_Components/Modal/EditAppointmentModal"
// import Tab from "@/app/_Components/Tab/page"
// import { appointmentTabs } from "@/app/utilities/tabs/page"
// import { useMyStoreItemsQuery } from "@/app/_Services/store/page"

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.5 },
//   },
// }

// export default function Page() {

//     const [activeFilter, setActiveFilter] = useState("all")
//     const [currentUser, setCurrentUser] = useState({})

//     useEffect(() => {
//       const data = Cookies.get("currentuser")
//       if (data) {
//         const user = JSON.parse(data)
//         console.log(user, 'user')
//         setCurrentUser(user)
//       }
//     }, [])

//   const { data, error: isError, isLoading } = useMyStoreItemsQuery()

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "scheduled":
//         return "text-gray-600 bg-gray-100"
//       case true :
//         return "text-green-600 bg-green-100"
//       case 'ended' :
//         return "text-green-600 bg-green-100"
//       case 'active' :
//         return "text-blue-600 bg-blue-100"
//       case false :
//         return "text-yellow-600 bg-yellow-100"
//       case false :
//         return "text-yellow-600 bg-yellow-100"
//       case "discarded":
//         return "text-[#5f2781] bg-red-100"
//       default:
//         return "text-gray-600 bg-gray-100"
//     }
//   }

//   const filteredNotifications = () => {
//     if (!data?.data) return []
//     if (activeFilter === "sold") {
//       return data.data.filter((item) => item?.isSold)
//     } else if (activeFilter === "unsold") {
//       return data.data.filter((item) => !item?.isSold)
//     } else if (activeFilter === "discarded") {
//       return data.data.filter((item) => item?.status === "discarded")
//     } else {
//       return data.data
//     }
//   }
//   const filterData = [
//     'all',
//     'sold',
//     'unsold',
//     'discarded',
//   ]



//   if (isLoading) {
//     return (
//       <div className="min-h-screen  flex items-center justify-center">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
//           className="w-12 h-12 border-4 border-[#5f2781] border-t-transparent rounded-full"
//         />
//         <span className="ml-4 text-[#5f2781] font-semibold">Loading your Store Items... 🚀</span>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen  py-12 px-4">
//       <div className="max-w-7xl mx-auto p-5 flex flex-col space-y-6">

//         <div className="flex flex-col gap-2 justify-between items-center md:flex-row">
//           <div className="flex items-center gap-3">
//             <Store className="h-7 w-7 text-[#5f2781]" />
//             <h3 className="text-[#242424] text-[24px] font-bold">{currentUser?.isStore ? 'My Items' :'My Store'}</h3>
//           </div>

//         {currentUser?.isStore &&
//           <div className="flex bg-white rounded-full shadow-sm p-1">
//             {filterData?.map(e => <button
//               onClick={() => setActiveFilter(e)}
//               className={`px-4 py-2 text-sm rounded-full cursor-pointer transition-all capitalize ${activeFilter === e ? "bg-[#5f2781] text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
//                 }`}
//             >
//               {e}
//             </button>)}

//             </div>}
//         </div>

//         <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-xl border border-red-100">


//           {filteredNotifications()?.length === 0 ? (
//             <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
//               <Store className="h-16 w-16 text-gray-300 mb-4" />
//               <h3 className="text-xl font-semibold text-gray-700">No Item</h3>
//               <p className="text-gray-500 mt-2">
//                 {activeFilter === "all"
//                   ? "You don't have any item yet."
//                   : activeFilter === "sold"
//                     ? "You don't have any sold item."
//                     : activeFilter === "unsold"
//                       ? "You don't have any unsold item."
//                       : "You don't have any discarded item."}
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-hidden rounded-2xl border border-gray-200" >
//               <div className="overflow-x-auto">
//                 <table className="min-w-full">
//                   <thead className="bg-[#5f2781]">
//                     <tr>
//                     <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Image
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         SKU
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         SKU Location
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Title
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Price
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Current Bid
//                       </th>

//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Sold Status
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Auction Status                      </th>
//                       {/* <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Action
//                       </th> */}
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredNotifications().map((product, index) => {
//                        const lastFour = product?._id.toString().slice(-4).toUpperCase();
//                       return(
//                       <motion.tr
//                         key={product._id}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: index * 0.1 }}
//                         className="hover:bg-[#f7f7f7] transition-colors"
//                       >
//                         <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600"> <img
//                           src={product?.images?.[0]}
//                           alt="Product-img"
//                           onClick={() => router.push(`/detailproduct/${item._id}`)}
//                           className="w-20 h-15 rounded-lg"
//                         /></td>
//                         <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{`SKU-${lastFour}`}</td>
//                         <td className="px-3 py-4 whitespace-pre-line text-sm text-gray-600">{`${product?.skuLocation},${product?.skuRoom},${product?.skuDetail}`}</td>
//                         <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{product?.name}</td>
//                         <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{product?.price}</td>
//                         <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{product?.highestBid}</td>
//                         <td className="px-3 py-4 whitespace-nowrap">
//                           <span
//                             className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.isSold)}`}
//                           >
//                             {product.isSold? 'Sold ':'Un Sold'}
//                           </span>
//                         </td>
//                         <td className="px-3 py-4 whitespace-nowrap">
//                           <span
//                             className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
//                           >
//                             {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
//                           </span>
//                         </td>
//                         {/* <td className="px-3 py-4 whitespace-nowrap">
//                           {product.status ? (
//                             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-[9825fd]">
//                               💰 $5.00
//                             </span>
//                           ) : (
//                             <span className="text-gray-400 text-sm items-center">N/A</span>
//                           )}
//                         </td> */}

//                       </motion.tr>
//                   )  })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </motion.div>

//       </div>
//     </div>
//   )
// }


// "use client"
// import { useEffect, useState } from "react"
// import Cookies from "js-cookie"
// import { Store, Plus, DollarSign } from "lucide-react"
// import { motion } from "framer-motion"
// import { useCreateStoreMutation, useMyStoreItemsQuery, useMyStoreQuery } from "@/app/_Services/store/page"
// import CreateStoreModal from "@/app/_Components/Modal/CreateStore"
// import { useAddPaymentMutation } from "@/app/_Services/payment/page"
// import { PiCrownCrossLight } from "react-icons/pi"
// import toast from "react-hot-toast"

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.5 },
//   },
// }

// export default function Page() {
//   const [activeFilter, setActiveFilter] = useState("all")
//   const [currentUser, setCurrentUser] = useState({})
//   const [Loading, setLoading] = useState(false)
//   const [addPayment] = useAddPaymentMutation();
//   const [createStore] = useCreateStoreMutation();

//   const [showCreateStoreModal, setShowCreateStoreModal] = useState(false)
//   const { data, error: isError, isLoading } = useMyStoreItemsQuery()
//   const { data: storeData, error, isLoading: isStoreLoading } = useMyStoreQuery()

//   useEffect(() => {
//     const data = Cookies.get("currentuser")
//     if (data) {
//       const user = JSON.parse(data)
//       console.log(user, "user")
//       setCurrentUser(user)
//     }
//   }, [])


//   const handlePayments = async () => {
//     try {
//       setLoading(true);
//       const response = await addPayment({ "storeId": storeData?.data?._id, 'type': 'store_payment' }).unwrap();
//       if (response?.data?.url) {
//         window.location.href = response?.data?.url;
//       }
//     } catch (error) {
//       toast.error(error?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };


//   console.log(storeData?.data, 'storeData')

//   const getStatusColor = (status) => {
//     console.log(status, "status")
//     switch (status) {
//       case "scheduled":
//         return "text-gray-600 bg-gray-100"
//       case true:
//         return "text-green-600 bg-green-100"
//       case "ended":
//         return "text-green-600 bg-green-100"
//       case "active":
//         return "text-blue-600 bg-blue-100"
//       case false:
//         return "text-yellow-600 bg-yellow-100"
//       case "discarded":
//         return "text-[#5f2781] bg-red-100"
//       default:
//         return "text-gray-600 bg-gray-100"
//     }
//   }

//   const filteredNotifications = () => {
//     if (!data?.data) return []
//     if (activeFilter === "sold") {
//       return data.data.filter((item) => item?.isSold)
//     } else if (activeFilter === "unsold") {
//       return data.data.filter((item) => !item?.isSold)
//     } else if (activeFilter === "discarded") {
//       return data.data.filter((item) => item?.status === "discarded")
//     } else {
//       return data.data
//     }
//   }

//   const filterData = ["all", "sold", "unsold", "discarded"]

//   const handleCreateStore = () => {
//     setShowCreateStoreModal(true)
//   }

//   const handleStoreSubmit = async (values) => {
//     try {
//       const response = await createStore({
//         'name': values.name, 'description': values.description
//       }).unwrap()
//       console.log(response, 'response')
//       if (response.success) {

//         const user = response?.data?.user
//         Cookies.set("currentuser", JSON.stringify(user), { expires: 7, secure: true })

//         toast.success("Store created successfully!")
//         const resp = await addPayment({ "storeId": response?.data?.store?._id, 'type': 'store_payment' }).unwrap();
//         console.log(resp, 'sadaf');
//         if (resp?.data?.url) {
//           window.location.href = resp?.data?.url;
//         }
//       } else {
//         toast.error(response.message || "Failed to process store payment")
//       }
//     } catch (error) {
//       console.log("Error creating store:", error)
//       toast.error(error.data?.message || "An error occurred")
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen  flex items-center justify-center">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
//           className="w-12 h-12 border-4 border-[#5f2781] border-t-transparent rounded-full"
//         />
//         <span className="ml-4 text-[#5f2781] font-semibold">Loading your Store Items... 🚀</span>
//       </div>
//     )
//   }

//   if (!currentUser?.isStore) {
//     return (
//       <>
//         <div className="min-h-screen  py-12 px-4">
//           <div className="max-w-4xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="bg-white rounded-3xl p-8 shadow-xl border border-red-100"
//             >
//               <div className="text-center">
//                 {/* Store Icon */}
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//                   className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6"
//                 >
//                   <Store className="h-12 w-12 text-[#5f2781]" />
//                 </motion.div>

//                 {/* Main Message */}
//                 <motion.h1
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.3 }}
//                   className="text-3xl font-bold text-gray-800 mb-4"
//                 >
//                   You Don't Have a Store Yet! 🏪
//                 </motion.h1>

//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.4 }}
//                   className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
//                 >
//                   Create your own store to start selling your items and reach thousands of potential buyers. Join our
//                   marketplace today!
//                 </motion.p>

//                 {/* Payment Info Card */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5 }}
//                   className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 mb-8 border border-red-200"
//                 >
//                   <div className="flex items-center justify-center mb-4">
//                     <DollarSign className="h-8 w-8 text-[#5f2781] mr-2" />
//                     <h3 className="text-xl font-semibold text-[9825fd]">One-Time Setup Fee</h3>
//                   </div>
//                   <div className="text-center">
//                     <span className="text-4xl font-bold text-[#5f2781]">$50</span>
//                     <p className="text-gray-600 mt-2">
//                       This one-time payment covers your store setup, verification, and lifetime access to our platform.
//                     </p>
//                   </div>
//                 </motion.div>

//                 {/* Features List */}
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.6 }}
//                   className="grid md:grid-cols-3 gap-6 mb-8"
//                 >
//                   <div className="text-center p-4">
//                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                       <span className="text-2xl">🎯</span>
//                     </div>
//                     <h4 className="font-semibold text-gray-800 mb-2">Reach More Buyers</h4>
//                     <p className="text-sm text-gray-600">Connect with thousands of active buyers</p>
//                   </div>
//                   <div className="text-center p-4">
//                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                       <span className="text-2xl">💰</span>
//                     </div>
//                     <h4 className="font-semibold text-gray-800 mb-2">Easy Payments</h4>
//                     <p className="text-sm text-gray-600">Secure and fast payment processing</p>
//                   </div>
//                   <div className="text-center p-4">
//                     <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                       <span className="text-2xl">📊</span>
//                     </div>
//                     <h4 className="font-semibold text-gray-800 mb-2">Analytics</h4>
//                     <p className="text-sm text-gray-600">Track your sales and performance</p>
//                   </div>
//                 </motion.div>

//                 {/* Create Store Button */}
//                 <motion.button
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.7 }}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={handleCreateStore}
//                   className="bg-gradient-to-r from-[#5f2781] to-[#4f1f6d] hover:from-[#4f1f6d] hover:to-[#5f2781] text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 flex items-center gap-3 mx-auto"
//                 >
//                   <Plus className="h-5 w-5" />
//                   Create My Store - $50
//                 </motion.button>

//                 {/* Additional Info */}
//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.8 }}
//                   className="text-sm text-gray-500 mt-6"
//                 >
//                   💡 <strong>Pro Tip:</strong> Once your store is created, you can immediately start listing items and
//                   earning money!
//                 </motion.p>
//               </div>
//             </motion.div>
//           </div>
//         </div>

//         <CreateStoreModal
//           isOpen={showCreateStoreModal}
//           onClose={() => setShowCreateStoreModal(false)}
//           onSubmit={handleStoreSubmit}
//         />
//       </>
//     )
//   }

//   return (
//     <div className="min-h-screen  py-12 px-4">
//       <div className="max-w-7xl mx-auto p-5 flex flex-col space-y-6">
//         <div className="flex flex-col gap-2 justify-between items-center md:flex-row">
//           <div className="flex items-center gap-3">
//             <Store className="h-7 w-7 text-[#5f2781]" />
//             <h3 className="text-[#242424] text-[24px] font-bold">My Store Items</h3>
//           </div>
//           <div className="flex bg-white rounded-full shadow-sm p-1">
//             {filterData?.map((e) => (
//               <button
//                 key={e}
//                 onClick={() => setActiveFilter(e)}
//                 className={`px-4 py-2 text-sm rounded-full cursor-pointer transition-all capitalize ${activeFilter === e ? "bg-[#5f2781] text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
//                   }`}
//               >
//                 {e}
//               </button>
//             ))}
//           </div>
//         </div>

//         <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-xl border border-red-100">
//           {filteredNotifications()?.length === 0 ? (
//             <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
//               <Store className="h-16 w-16 text-gray-300 mb-4" />
//               <h3 className="text-xl font-semibold text-gray-700">No Items</h3>
//               <p className="text-gray-500 mt-2">
//                 {activeFilter === "all"
//                   ? "You don't have any items yet."
//                   : activeFilter === "sold"
//                     ? "You don't have any sold items."
//                     : activeFilter === "unsold"
//                       ? "You don't have any unsold items."
//                       : "You don't have any discarded items."}
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-hidden rounded-2xl border border-gray-200">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full">
//                   <thead className="bg-[#5f2781]">
//                     <tr>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Image
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         SKU
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         SKU Location
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Title
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Price
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Current Bid
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Sold Status
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Auction Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredNotifications().map((product, index) => {
//                       const lastFour = product?._id.toString().slice(-4).toUpperCase()
//                       return (
//                         <motion.tr
//                           key={product._id}
//                           initial={{ opacity: 0, x: -20 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.1 }}
//                           className="hover:bg-[#f7f7f7] transition-colors"
//                         >
//                           <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
//                             <img
//                               src={product?.images?.[0] || "/placeholder.svg"}
//                               alt="Product-img"
//                               className="w-20 h-15 rounded-lg object-cover"
//                             />
//                           </td>
//                           <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{`SKU-${lastFour}`}</td>
//                           <td className="px-3 py-4 whitespace-pre-line text-sm text-gray-600">{`${product?.skuLocation},${product?.skuRoom},${product?.skuDetail}`}</td>
//                           <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
//                             {product?.name}
//                           </td>
//                           <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">${product?.price}</td>
//                           <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
//                             ${product?.highestBid || "0"}
//                           </td>
//                           <td className="px-3 py-4 whitespace-nowrap">
//                             <span
//                               className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.isSold)}`}
//                             >
//                               {product.isSold ? "Sold" : "Unsold"}
//                             </span>
//                           </td>
//                           <td className="px-3 py-4 whitespace-nowrap">
//                             <span
//                               className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
//                             >
//                               {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
//                             </span>
//                           </td>
//                         </motion.tr>
//                       )
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   )
// }


// "use client"
// import { useEffect, useState } from "react"
// import Cookies from "js-cookie"
// import { Store, Plus, DollarSign } from "lucide-react"
// import { motion } from "framer-motion"
// import { useCreateStoreMutation, useMyStoreItemsQuery, useMyStoreQuery } from "@/app/_Services/store/page"
// import CreateStoreModal from "@/app/_Components/Modal/CreateStore"
// import { useAddPaymentMutation } from "@/app/_Services/payment/page"
// import { PiCrownCrossLight } from "react-icons/pi"
// import toast from "react-hot-toast"

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.5 },
//   },
// }

// export default function Page() {
//   const [activeFilter, setActiveFilter] = useState("all")
//   const [currentUser, setCurrentUser] = useState({})
//   const [Loading, setLoading] = useState(false)
//   const [addPayment] = useAddPaymentMutation();
//   const [createStore] = useCreateStoreMutation();

//   const [showCreateStoreModal, setShowCreateStoreModal] = useState(false)
//   const { data, error: isError, isLoading } = useMyStoreItemsQuery()
//   const { data: storeData, error, isLoading: isStoreLoading } = useMyStoreQuery()

//   useEffect(() => {
//     const data = Cookies.get("currentuser")
//     if (data) {
//       const user = JSON.parse(data)
//       console.log(user, "user")
//       setCurrentUser(user)
//     }
//   }, [])


//   const handlePayments = async () => {
//     try {
//       setLoading(true);
//       const response = await addPayment({ "storeId": storeData?.data?._id, 'type': 'store_payment' }).unwrap();
//       if (response?.data?.url) {
//         window.location.href = response?.data?.url;
//       }
//     } catch (error) {
//       toast.error(error?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };


//   console.log(storeData?.data, 'storeData')

//   const getStatusColor = (status) => {
//     console.log(status, "status")
//     switch (status) {
//       case "scheduled":
//         return "text-gray-600 bg-gray-100"
//       case true:
//         return "text-green-600 bg-green-100"
//       case "ended":
//         return "text-green-600 bg-green-100"
//       case "active":
//         return "text-blue-600 bg-blue-100"
//       case false:
//         return "text-yellow-600 bg-yellow-100"
//       case "discarded":
//         return "text-[#5f2781] bg-red-100"
//       default:
//         return "text-gray-600 bg-gray-100"
//     }
//   }

//   const filteredNotifications = () => {
//     if (!data?.data) return []
//     if (activeFilter === "sold") {
//       return data.data.filter((item) => item?.isSold)
//     } else if (activeFilter === "unsold") {
//       return data.data.filter((item) => !item?.isSold)
//     } else if (activeFilter === "discarded") {
//       return data.data.filter((item) => item?.status === "discarded")
//     } else {
//       return data.data
//     }
//   }

//   const filterData = ["all", "sold", "unsold", "discarded"]

//   const handleCreateStore = () => {
//     setShowCreateStoreModal(true)
//   }

//   const handleStoreSubmit = async (values) => {
//     try {
//       const response = await createStore({
//         'name': values.name, 'description': values.description
//       }).unwrap()
//       console.log(response, 'response')
//       if (response.success) {

//         const user = response?.data?.user
//         Cookies.set("currentuser", JSON.stringify(user), { expires: 7, secure: true })

//         toast.success("Store created successfully!")
//         const resp = await addPayment({ "storeId": response?.data?.store?._id, 'type': 'store_payment' }).unwrap();
//         console.log(resp, 'sadaf');
//         if (resp?.data?.url) {
//           window.location.href = resp?.data?.url;
//         }
//       } else {
//         toast.error(response.message || "Failed to process store payment")
//       }
//     } catch (error) {
//       console.log("Error creating store:", error)
//       toast.error(error.data?.message || "An error occurred")
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen  flex items-center justify-center">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
//           className="w-12 h-12 border-4 border-[#5f2781] border-t-transparent rounded-full"
//         />
//         <span className="ml-4 text-[#5f2781] font-semibold">Loading your Store Items... 🚀</span>
//       </div>
//     )
//   }

//   if (!currentUser?.isStore) {
//     return (
//       <>
//         <div className="min-h-screen  py-12 px-4">
//           <div className="max-w-4xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="bg-white rounded-3xl p-8 shadow-xl border border-red-100"
//             >
//               <div className="text-center">
//                 {/* Store Icon */}
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//                   className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6"
//                 >
//                   <Store className="h-12 w-12 text-[#5f2781]" />
//                 </motion.div>

//                 {/* Main Message */}
//                 <motion.h1
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.3 }}
//                   className="text-3xl font-bold text-gray-800 mb-4"
//                 >
//                   You Don't Have a Store Yet! 🏪
//                 </motion.h1>

//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.4 }}
//                   className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
//                 >
//                   Create your own store to start selling your items and reach thousands of potential buyers. Join our
//                   marketplace today!
//                 </motion.p>

//                 {/* Payment Info Card */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5 }}
//                   className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 mb-8 border border-red-200"
//                 >
//                   <div className="flex items-center justify-center mb-4">
//                     <DollarSign className="h-8 w-8 text-[#5f2781] mr-2" />
//                     <h3 className="text-xl font-semibold text-[9825fd]">One-Time Setup Fee</h3>
//                   </div>
//                   <div className="text-center">
//                     <span className="text-4xl font-bold text-[#5f2781]">$50</span>
//                     <p className="text-gray-600 mt-2">
//                       This one-time payment covers your store setup, verification, and lifetime access to our platform.
//                     </p>
//                   </div>
//                 </motion.div>

//                 {/* Features List */}
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.6 }}
//                   className="grid md:grid-cols-3 gap-6 mb-8"
//                 >
//                   <div className="text-center p-4">
//                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                       <span className="text-2xl">🎯</span>
//                     </div>
//                     <h4 className="font-semibold text-gray-800 mb-2">Reach More Buyers</h4>
//                     <p className="text-sm text-gray-600">Connect with thousands of active buyers</p>
//                   </div>
//                   <div className="text-center p-4">
//                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                       <span className="text-2xl">💰</span>
//                     </div>
//                     <h4 className="font-semibold text-gray-800 mb-2">Easy Payments</h4>
//                     <p className="text-sm text-gray-600">Secure and fast payment processing</p>
//                   </div>
//                   <div className="text-center p-4">
//                     <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                       <span className="text-2xl">📊</span>
//                     </div>
//                     <h4 className="font-semibold text-gray-800 mb-2">Analytics</h4>
//                     <p className="text-sm text-gray-600">Track your sales and performance</p>
//                   </div>
//                 </motion.div>

//                 {/* Create Store Button */}
//                 <motion.button
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.7 }}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={handleCreateStore}
//                   className="bg-gradient-to-r from-[#5f2781] to-[#4f1f6d] hover:from-[#4f1f6d] hover:to-[#5f2781] text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 flex items-center gap-3 mx-auto"
//                 >
//                   <Plus className="h-5 w-5" />
//                   Create My Store - $50
//                 </motion.button>

//                 {/* Additional Info */}
//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.8 }}
//                   className="text-sm text-gray-500 mt-6"
//                 >
//                   💡 <strong>Pro Tip:</strong> Once your store is created, you can immediately start listing items and
//                   earning money!
//                 </motion.p>
//               </div>
//             </motion.div>
//           </div>
//         </div>

//         <CreateStoreModal
//           isOpen={showCreateStoreModal}
//           onClose={() => setShowCreateStoreModal(false)}
//           onSubmit={handleStoreSubmit}
//         />
//       </>
//     )
//   }

//   return (
//     <div className="min-h-screen  py-12 px-4">
//       <div className="max-w-7xl mx-auto p-5 flex flex-col space-y-6">
//         <div className="flex flex-col gap-2 justify-between items-center md:flex-row">
//           <div className="flex items-center gap-3">
//             <Store className="h-7 w-7 text-[#5f2781]" />
//             <h3 className="text-[#242424] text-[24px] font-bold">My Store Items</h3>
//           </div>
//           <div className="flex bg-white rounded-full shadow-sm p-1">
//             {filterData?.map((e) => (
//               <button
//                 key={e}
//                 onClick={() => setActiveFilter(e)}
//                 className={`px-4 py-2 text-sm rounded-full cursor-pointer transition-all capitalize ${activeFilter === e ? "bg-[#5f2781] text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
//                   }`}
//               >
//                 {e}
//               </button>
//             ))}
//           </div>
//         </div>

//         <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-xl border border-red-100">
//           {filteredNotifications()?.length === 0 ? (
//             <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
//               <Store className="h-16 w-16 text-gray-300 mb-4" />
//               <h3 className="text-xl font-semibold text-gray-700">No Items</h3>
//               <p className="text-gray-500 mt-2">
//                 {activeFilter === "all"
//                   ? "You don't have any items yet."
//                   : activeFilter === "sold"
//                     ? "You don't have any sold items."
//                     : activeFilter === "unsold"
//                       ? "You don't have any unsold items."
//                       : "You don't have any discarded items."}
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-hidden rounded-2xl border border-gray-200">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full">
//                   <thead className="bg-[#5f2781]">
//                     <tr>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Image
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         SKU
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         SKU Location
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Title
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Price
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Current Bid
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Sold Status
//                       </th>
//                       <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
//                         Auction Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredNotifications().map((product, index) => {
//                       const lastFour = product?._id.toString().slice(-4).toUpperCase()
//                       return (
//                         <motion.tr
//                           key={product._id}
//                           initial={{ opacity: 0, x: -20 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.1 }}
//                           className="hover:bg-[#f7f7f7] transition-colors"
//                         >
//                           <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
//                             <img
//                               src={product?.images?.[0] || "/placeholder.svg"}
//                               alt="Product-img"
//                               className="w-20 h-15 rounded-lg object-cover"
//                             />
//                           </td>
//                           <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{`SKU-${lastFour}`}</td>
//                           <td className="px-3 py-4 whitespace-pre-line text-sm text-gray-600">{`${product?.skuLocation},${product?.skuRoom},${product?.skuDetail}`}</td>
//                           <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
//                             {product?.name}
//                           </td>
//                           <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">${product?.price}</td>
//                           <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
//                             ${product?.highestBid || "0"}
//                           </td>
//                           <td className="px-3 py-4 whitespace-nowrap">
//                             <span
//                               className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.isSold)}`}
//                             >
//                               {product.isSold ? "Sold" : "Unsold"}
//                             </span>
//                           </td>
//                           <td className="px-3 py-4 whitespace-nowrap">
//                             <span
//                               className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
//                             >
//                               {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
//                             </span>
//                           </td>
//                         </motion.tr>
//                       )
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   )
// }

"use client"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { Store, Plus, DollarSign, CreditCard, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useCreateStoreMutation, useMyStoreQuery } from "@/app/_Services/store/page"
import CreateStoreModal from "@/app/_Components/Modal/CreateStore"
import { useAddPaymentMutation } from "@/app/_Services/payment/page"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useAllStoreProductQuery } from "@/app/_Services/StoreProduct/page"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function Page() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [currentUser, setCurrentUser] = useState({})
  const [addPayment, { isLoading: isPocessing }] = useAddPaymentMutation()
  const [createStore] = useCreateStoreMutation()
  const [showCreateStoreModal, setShowCreateStoreModal] = useState(false)
  const router = useRouter()

  const { data, error: isError, isLoading } = useAllStoreProductQuery()
  const { data: storeData, error, isLoading: isStoreLoading } = useMyStoreQuery()

  useEffect(() => {
    const data = Cookies.get("currentuser")
    if (data) {
      const user = JSON.parse(data)
      console.log(user, "user")
      setCurrentUser(user)
    }
  }, [])

  // const handlePayments = async () => {
  //   try {
  //     const response = await addPayment({
  //       storeId: storeData?.data?._id,
  //       type: "store_payment",
  //     }).unwrap()
  //     if (response?.data?.url) {
  //       window.location.href = response?.data?.url
  //     }
  //   } catch (error) {
  //     toast.error(error?.data?.message || "Something went wrong")
  //   } 
  // }

  const getStatusColor = (status) => {
    console.log(status, "status")
    switch (status) {
      case "scheduled":
        return "text-gray-600 bg-gray-100"
      case true:
        return "text-green-600 bg-green-100"
      case "ended":
        return "text-green-600 bg-green-100"
      case "active":
        return "text-blue-600 bg-blue-100"
      case false:
        return "text-yellow-600 bg-yellow-100"
      case "discarded":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const filteredNotifications = () => {
    if (!data?.data) return []
    if (activeFilter === "sold") {
      return data.data.filter((item) => item?.isSold)
    } else if (activeFilter === "unsold") {
      return data.data.filter((item) => !item?.isSold)
    } else if (activeFilter === "discarded") {
      return data.data.filter((item) => item?.status === "discarded")
    } else {
      return data.data
    }
  }

  const filterData = ["all", "sold", "unsold", "discarded"]

  const handleCreateStore = () => {
    setShowCreateStoreModal(true)
  }

  const handleStoreSubmit = async (values) => {
    try {
      const response = await createStore({
        name: values.name,
        description: values.description,
        ein: values?.ein,
        ownerName: values?.ownerName,
        businessPhone: values?.businessPhone,
        ownerPhone: values?.ownerPhone,
        storeStreet: values?.storeStreet,
        storeCity: values?.storeCity,
        storeState: values?.storeState,
        storeZipCode: values?.storeZipCode,
        storeCountry: values?.storeCountry,
        ownerStreet: values?.ownerStreet,
        ownerCity: values?.ownerCity,
        ownerState: values?.ownerState,
        ownerZipCode: values?.ownerZipCode,
        ownerCountry: values?.ownerCountry,
        sellerPremium: 20,
        listingFee: 0.35,
        advertisingFee: 5,
        JunkItemFee: 5,
        packagingFee: 5,
      }).unwrap()
      console.log(response, "response")
      if (response.success) {
        const user = response?.data?.user
        Cookies.set("currentuser", JSON.stringify(user), { expires: 7, secure: true })
        // toast.success("Store created successfully!")
        showCreateStoreModal(false)
        router.push(`/dashboard/feeConfirmation?type=store_payment&id=${response?.data?.store?._id}&amount=${99}&product=${response?.data?.store?.name}`)
        // const resp = await addPayment({
        //   storeId: response?.data?.store?._id,
        //   type: "store_payment",
        // }).unwrap()
        // console.log(resp, "sadaf")
        // if (resp?.data?.url) {
        //   window.location.href = resp?.data?.url
        // }
      } else {
        toast.error(response.message || "Failed to process store payment")
      }
    } catch (error) {
      console.log("Error creating store:", error)
      toast.error(error.data?.message || "An error occurred")
    }
  }

  if (isLoading || isStoreLoading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#5f2781] border-t-transparent rounded-full"
        />
        <span className="ml-4 text-[#5f2781] font-semibold">Loading your Store Items... 🚀</span>
      </div>
    )
  }

  // If user doesn't have a store, show create store section
  if (!currentUser?.isStore) {
    return (
      <>
        <div className="min-h-screen  py-6 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-red-100"
            >
              <div className="text-center">
                {/* Store Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6"
                >
                  <Store className="h-12 w-12 text-[#5f2781]" />
                </motion.div>

                {/* Main Message */}
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-gray-800 mb-4"
                >
                  You Don't Have a Store Yet! 🏪
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
                >
                  Create your own store to start selling your items and reach thousands of potential buyers. Join our
                  marketplace today!
                </motion.p>

                {/* Payment Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 mb-8 border border-red-200"
                >
                  <div className="flex items-center justify-center mb-4">
                    <DollarSign className="h-8 w-8 text-[#5f2781] mr-2" />
                    <h3 className="text-xl font-semibold text-[9825fd]">One-Time Setup Fee</h3>
                  </div>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-[#5f2781]">$99</span>
                    <p className="text-gray-600 mt-2">
                      This one-time payment covers your store setup, verification, and lifetime access to our platform.
                    </p>
                  </div>
                </motion.div>

                {/* Features List */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="grid md:grid-cols-3 gap-6 mb-8"
                >
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Reach More Buyers</h4>
                    <p className="text-sm text-gray-600">Connect with thousands of active buyers</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">💰</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Easy Payments</h4>
                    <p className="text-sm text-gray-600">Secure and fast payment processing</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">📊</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Analytics</h4>
                    <p className="text-sm text-gray-600">Track your sales and performance</p>
                  </div>
                </motion.div>

                {/* Create Store Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateStore}
                  className="bg-gradient-to-r from-[#5f2781] to-[#4f1f6d] hover:from-[#4f1f6d] hover:to-[#5f2781] text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  Create My Store - $99
                </motion.button>

                {/* Additional Info */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-sm text-gray-500 mt-6"
                >
                  💡 <strong>Pro Tip:</strong> Once your store is created, you can immediately start listing items and
                  earning money!
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>

        <CreateStoreModal
          isOpen={showCreateStoreModal}
          onClose={() => setShowCreateStoreModal(false)}
          onSubmit={handleStoreSubmit}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen  py-4 sm:px-1 md:px-4">
      <div className="max-w-7xl mx-auto p-5 flex flex-col space-y-6">
        {/* Store Header with Name and Payment Status */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#f7f7f7]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Store Name Section */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#f7f7f7] rounded-2xl flex items-center justify-center">
                <Store className="h-8 w-8 text-[#5f2781]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 capitalize">
                  My Store
                  {/* {storeData?.data?.isPaid && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Verified
                    </span>
                  )} */}
                </h1>
                {/* <p className="text-gray-600 mt-1 capitalize">{storeData?.data?.description || "Your marketplace store"}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 capitalize">
                  <span>EIN: {storeData?.data?.ein}</span>
                  <span>•</span>
                  <span>Owner Name: {storeData?.data?.ownerName}</span>
                  <span>•</span>
                  <span>Owner Phone: {storeData?.data?.ownerPhone}</span>
                  <span>•</span>
                  <span>Items: {data?.data?.length || 0}</span>
                </div> */}
              </div>
            </div>

            {/* Payment Status Section */}
            {!storeData?.data?.isPaid && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-yellow-800">Payment Required</h3>
                    <p className="text-sm text-yellow-700">Complete your store setup</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/dashboard/feeConfirmation?type=store_payment&id=${storeData?.data?._id}&amount=${99}&product=${storeData?.data?.name}`)
                  }
                  disabled={isPocessing}
                  className="cursor-pointer w-full bg-gradient-to-r from-[#5f2781] to-[#4f1f6d] hover:from-[#4f1f6d] hover:to-[#5f2781] disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isPocessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Pay $99 Now
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Filter and Items Section */}
        <div className="flex flex-col gap-4 justify-between items-center sm:mt-3 md:flex-row">
          <div className="flex items-center gap-3">
            <h3 className="text-[#242424] text-[24px] font-bold">Store Items</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard/createListing')}
              className="flex items-center gap-2 cursor-pointer bg-[#5f2781] text-white px-4 rounded-full text-sm font-medium hover:bg-[#4f1f6d] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Listing
            </motion.button>
            <div className="flex bg-white rounded-full shadow-sm p-1">
              {filterData?.map((e) => (
                <button
                  key={e}
                  onClick={() => setActiveFilter(e)}
                  className={`px-4 py-2 text-sm rounded-full cursor-pointer transition-all capitalize ${activeFilter === e ? "bg-[#5f2781] text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

        </div>

        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-xl border border-red-100">
          {filteredNotifications()?.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 text-center">
              <Store className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No Items</h3>
              <p className="text-gray-500 mt-2">
                {activeFilter === "all"
                  ? "You don't have any items yet."
                  : activeFilter === "sold"
                    ? "You don't have any sold items."
                    : activeFilter === "unsold"
                      ? "You don't have any unsold items."
                      : "You don't have any discarded items."}
              </p>
              {!storeData?.data?.isPaid && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-700">
                    💡 Complete your store payment to start adding items and selling products!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#f7f7f7]">
                    <tr>
                      <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
                        SKU
                      </th>
                      {/* <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
                        SKU Location
                      </th> */}
                      <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
                        Current Bid
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
                        Sold Status
                      </th>
                      <th className="px-3 py-4 text-left text-sm font-bold text-[9825fd] uppercase tracking-wider">
                        Auction Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredNotifications().map((product, index) => {
                      const lastFour = product?._id.toString().slice(-4).toUpperCase()
                      return (
                        <motion.tr
                          key={product._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-[#f7f7f7] transition-colors"
                        >
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                            <img
                              src={product?.mainImage || "/placeholder.svg"}
                              alt="Product-img"
                              className="w-20 h-15 rounded-lg object-contain"
                            />
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{`SKU-${product?.sku}`}</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                            {product?.name}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">${product?.price}</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                            ${product?.highestBid || "0"}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.isSold)}`}
                            >
                              {product.isSold ? "Sold" : "Unsold"}
                            </span>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
                            >
                              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            </span>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div >
  )
}


