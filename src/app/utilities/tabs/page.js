import { Calendar, HelpCircle, MapPin, Lock, MessageSquare, Truck, User, Printer } from "lucide-react"

export const helpTabs = [
    { name: "Contact Support", path: "/dashboard/contactform", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "My Queries", path: "/dashboard/response", icon: <HelpCircle className="h-4 w-4" /> },
  ]
export  const myAccountTabs = [
    { name: "Profile", path: "/dashboard/profile", icon: <User className="h-4 w-4" /> },
    { name: "Change Password", path: "/dashboard/changepassword", icon: <Lock className="h-4 w-4" /> },
    { name: "Address", path: "/dashboard/address", icon: <MapPin className="h-4 w-4" /> },
    { name: "Username", path: "/dashboard/username", icon: <User className="h-4 w-4" /> },
    { name: "Print Account Info", path: "/dashboard/printAccountInfo", icon: <Printer className="h-4 w-4" /> },
  ]
export  const appointmentTabs = [
    { path: "/dashboard/appointment", name: "Pick Up ", color: "bg-blue-500",icon: <Calendar className="h-4 w-4" /> },
    { path: "/dashboard/shippingRequest", name: "Shipping Request", color: "bg-red-400",icon: <Truck className="h-4 w-4" /> },
];