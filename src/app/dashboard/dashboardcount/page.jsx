"use client";

import {
  Award,
  Eye,
  Calendar,
  Star,
  ArrowUp,
  ArrowDown,
  CalendarRangeIcon,
  Frown,
  Users,
  Settings,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Package,
  BoxIcon,
  Mail,
} from "lucide-react";
import { FaGavel } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useWonItemsQuery } from "@/app/_Services/wonProduct/page";
import { useAllAppointmentQuery } from "@/app/_Services/appointment/page";
import { usePenalizedProductItemsQuery } from "@/app/_Services/PenaltyFeeProduct/page";
import { useGetBillBoardQuery } from "@/app/_Services/services/page";
import { useAllStoreProductQuery } from "@/app/_Services/StoreProduct/page";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
  trend,
  trendValue,
}) => {
  const router = useRouter();

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.02, y: -5 }}
      // onClick={() => router.push(link)}
      className={`relative overflow-hidden rounded-3xl p-6 shadow-xl ${color} backdrop-blur-sm`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mbg-zinc-800">
          <div className={`p-3 rounded-2xl bg-white bg-opacity-20`}>
            <Icon className={`h-6 w-6 text-${color}`} />
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                trend === "up"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {trend === "up" ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {trendValue}%
            </div>
          )}
        </div>
        <div className="text-3xl font-bold text-white my-1">{value}</div>
        <div className="text-white text-opacity-80 font-medium">{title}</div>
        {subtitle && (
          <div className="text-white text-opacity-60 text-sm mt-1">
            {subtitle}
          </div>
        )}
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
    </motion.div>
  );
};

const QuickActionCard = ({ icon: Icon, title, description, color, link }) => {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      // onClick={() => router.push(link)}
      className="bg-white rounded-2xl p-4 md:p-5 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300"
    >
      <div className={`p-3 rounded-2xl w-fit mbg-zinc-800 ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
      {/* <p className="text-gray-600 text-sm">{description}</p> */}
    </motion.div>
  );
};

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  // API Queries
  const { data: billBoard, isLoading: billBoardLoading } =
    useGetBillBoardQuery();
  const { data: storeItems, isLoading: storeLoading } =
    useAllStoreProductQuery();
  const { data: purchasesData, isLoading: purchasesLoading } =
    useWonItemsQuery();

  const { data: missed, isLoading: missedLoading } = useAllAppointmentQuery();
  const { data: penalized, isLoading: penalizedLoading } =
    usePenalizedProductItemsQuery();
  console.log(billBoard, "billBoard");

  useEffect(() => {
    const data = Cookies.get("currentuser");
    if (data) {
      const user = JSON.parse(data);
      setCurrentUser(user);
    }

    // Set greeting based on time
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) {
      setGreeting("Good Morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon");
    } else if (hour >= 17 && hour < 23) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }
  }, []);

  const soldProducts =
    storeItems?.data?.filter((item) => item.isSold)?.length || 0;
  const totalProducts = storeItems?.data?.length || 0;
  const purchasedProducts = purchasesData?.data?.paid?.length || 0;
  const totalFees = 0;
  const pendingFees =
    penalized?.data?.length +
      missed?.data?.filter(
        (e) => e?.status === "missed" && e?.paymentStatus === "unpaid"
      )?.length +
      purchasesData?.data?.pending?.length || 0;

  const isLoading =
    billBoardLoading ||
    storeLoading ||
    purchasesLoading ||
    missedLoading ||
    penalizedLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-12 h-12 border-4 border-zinc-800 border-t-transparent rounded-full"
        />
        <span className="ml-4 text-gray-800 font-semibold">
          Loading your dashboard... ✨
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-2">
      {/* {billBoard?.data?.map(e=><div className=" pt-6 p-1 md:p-4  bg-gray-200 shadow-lg rounded-2xl border-3 border-[#ffa51d] ">
        <div
          dangerouslySetInnerHTML={{ __html: e?.title }}
        />
        <div
          dangerouslySetInnerHTML={{ __html: e?.description }}
          className="py-3"
        />
      </div>)} */}

      <div className="relative overflow-hidden bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 text-white rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-opacity-100"></div>
        <div className="relative z-10 w-full mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mbg-zinc-800 capitalize">
              {greeting}, {currentUser?.fullName}! 👋
            </h1>
            <p className="text-xl text-white text-opacity-90 my-2">
              Welcome to your personalized dashboard
            </p>
            <p className="text-white text-opacity-70">
              Track your Attendance, Leads, Sales and account activity all in one place
            </p>
          </motion.div>
        </div>
        <div className="absolute top-12 right-55 w-60 h-60 -mt-10 -mr-10 opacity-10">
          <div className="w-full h-full rounded-full border-8 border-white"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 -mt-15 -ml-17 rounded-full border-8 border-white"></div>
        </div>
        <div className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-white bg-opacity-10 rounded-full -translate-x-16 -translate-y-16 md-translate-x-32 md:-translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 md:w-92 md:h-92 bg-white bg-opacity-5 rounded-full translate-x-14 translate-y-14 md:translate-x-48 md:translate-y-48"></div>
      </div>

      <div className="w-full mx-auto px-2 py-8">
        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt-16 relative z-10"
        >
          <StatCard
            icon={Package}
            title="Total Lead"
            value={totalProducts}
            // subtitle="Items in your watchlist"
            color="bg-gradient-to-br from-blue-700 to-blue-800"
            trend="up"
            trendValue="0"
            link={"/dashboard/wishlist"}
          />

          <StatCard
            icon={ShoppingBag}
            title="Total Client"
            value={purchasedProducts}
            // subtitle="Items you've bought"
            color="bg-gradient-to-br from-yellow-600 to-yellow-700"
            trend="up"
            trendValue="0"
            link={"/dashboard/wonitem"}
          />

          <StatCard
            icon={TrendingUp}
            title="Total Sale"
            value={soldProducts}
            // subtitle={`${
            //   totalProducts > 0
            //     ? Math.round((soldProducts / totalProducts) * 100)
            //     : 0
            // }% success rate`}
            color="bg-gradient-to-br from-green-600 to-emerald-700"
            emerald="up"
            trendValue="0"
            link={"/dashboard/lostitem"}
          />

          <StatCard
            icon={DollarSign}
            title="Pending Payment Link"
            value={pendingFees}
            // subtitle={`${pendingFees} unpaid fees`}
            color="bg-gradient-to-br from-orange-600 to-red-700"
            trend={"down"}
            trendValue="0"
            link={"/dashboard/UnpaidItem"}
          />
        </motion.div>

        {/* Quick Actions */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Star className="h-6 w-6 text-yellow-500 bg-ora" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-6">
            <QuickActionCard
              icon={FaGavel}
              title="Bidding"
              description="View bidding items"
              color="bg-gradient-to-r from-gray-500 to-gray-600"
              link={"/dashboard/Bidding"}
            />
            <QuickActionCard
              icon={ShoppingBag}
              title="Won"
              description="View Won Items"
              color="bg-gradient-to-r from-green-500 to-emerald-600"
              link={"/dashboard/wonitem"}
            />

            <QuickActionCard
              icon={Frown}
              title="Lost"
              description="View Lost Items"
              color="bg-gradient-to-r from-rose-500 to-rose-600"
              link={"/dashboard/lostitem"}
            />
            <QuickActionCard
              icon={Eye}
              title="WatchList"
              description="View Items"
              color="bg-gradient-to-r from-blue-500 to-blue-600"
              link={"/dashboard/wishlist"}
            />
            <QuickActionCard
              icon={DollarSign}
              title="Invoices"
              description="View Invoices"
              color="bg-gradient-to-r from-orange-400 to-orange-500"
              link={"/dashboard/appointment"}
            />

            <QuickActionCard
              icon={BoxIcon}
              title="Selling"
              description="View Store Items"
              color="bg-gradient-to-r from-lime-600 to-lime-700"
              link={"/dashboard/myItem"}
            />

            <QuickActionCard
              icon={CalendarRangeIcon}
              title="Appointments "
              description="View Pickup Appointment"
              color="bg-gradient-to-r from-purple-500 to-purple-600"
              link={"/dashboard/appointment"}
            />
            <QuickActionCard
              icon={Users}
              title="Referrals"
              description="View Your Squads"
              color="bg-gradient-to-r from-yellow-500 to-yellow-600"
              link={"/dashboard/refferal"}
            />
            <QuickActionCard
              icon={Settings}
              title="Setting"
              description="View Your Squads"
              color="bg-gradient-to-r from-fuchsia-300 to-fuchsia-400"
              link={"/dashboard/profile"}
            />
            <QuickActionCard
              icon={Mail}
              title="Help"
              description="View Your Squads"
              color="bg-gradient-to-r from-cyan-400 to-cyan-500"
              link={"/dashboard/contactform"}
            />
          </div>
        </motion.div> */}

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 "
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Calendar className="h-6 w-6 text-indigo-500" />
            Recent Activity
          </h2>

          {/* Activity Timeline */}
          <div className="space-y-6">
            {soldProducts > 0 && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Products Sold</h3>
                  <p className="text-gray-600 text-sm">
                    You've successfully sold {soldProducts} products
                  </p>
                  <p className="text-gray-400 text-xs">Recent activity</p>
                </div>
              </div>
            )}

            {purchasedProducts > 0 && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">New Purchases</h3>
                  <p className="text-gray-600 text-sm">
                    You've made {purchasedProducts} purchases
                  </p>
                  <p className="text-gray-400 text-xs">Recent activity</p>
                </div>
              </div>
            )}

            {totalFees > 0 && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Pending Fees</h3>
                  <p className="text-gray-600 text-sm">
                    You have ${totalFees.toFixed(2)} in pending fees
                  </p>
                  <p className="text-gray-400 text-xs">Action required</p>
                </div>
              </div>
            )}

            {soldProducts === 0 &&
              purchasedProducts === 0 &&
              totalFees === 0 && (
                <div className="text-center py-8">
                  <Award className="h-16 w-16 text-gray-300 mx-auto mbg-zinc-800" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Recent Activity
                  </h3>
                  <p className="text-gray-500">
                    Start by listing your first product or making a purchase!
                  </p>
                </div>
              )}
          </div>
        </motion.div>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 text-sm">
            Dashboard last updated: {new Date().toLocaleDateString()} at{" "}
            {new Date().toLocaleTimeString()}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
