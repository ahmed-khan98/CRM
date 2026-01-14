"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import PayPalButton from "@/app/_Components/PayPalButton";
import { useGetPaymentLinkByIdQuery } from "@/app/_Services/paymentLink/page";
import Image from "next/image";

const PaymentDetail = ({ id }) => {
  const router = useRouter();

  const { data, error, isLoading } = useGetPaymentLinkByIdQuery({ id });

  const handlePayPalSuccess = (paymentData) => {
    console.log("PayPal payment successful:", paymentData);
      router.push("/payment-success");
  };

  const handlePayPalError = (error) => {
    console.error("PayPal payment error:", error);
     router.push("/payment-failed");
  };

  // const getPayPalId = () => {
  //   if (type === "auction_payment") {
  //     const searchId = searchParams.get("productId");
  //     return {
  //       productId: searchId,
  //       auctionWonId: id,
  //     };
  //   }
  //   return id;
  // };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-12 h-12 border-4 border-[#5f2781] border-t-transparent rounded-full"
        />
        <span className="ml-4 text-[#5f2781] font-semibold">
          Loading ... 🚀
        </span>
      </div>
    );
  if (error)
    return (
      <div className="p-10 text-center text-red-600">Error fetching data.</div>
    );
  if (!data)
    return (
      <div className="p-10 text-center text-gray-600">
        No Payment link info Found.
      </div>
    );

  return (
    <div className="min-h-screen  py-6 px-4">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* <div className="flex items-center justify-between my-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <CreditCard className="mr-2 h-8 w-8 text-[#5f2781]" />
            Payment Confirmation
          </h1>
        </div> */}

        {/* <div className=" w-25 h-25"> */}
          <Image
            src={data?.data?.brandId?.image || "/placeholder.svg"}
            alt="brand-logo"
            // fill
            width="200"
            height="100"
            className="rounded object-cover p-3 m-"
          />
        {/* </div> */}
        <div className="grid lg:grid-cols-2 gap-3">
          {/* Left Column - Payment Method Content */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Here's your invoice info
            </h2>
            {/* (737) 336-9867 */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 ">
                <div className="flex justify-between items-center">
                  <div>
                    <h6 className="font-medium text-sm  text-gray-800">
                      Brand:
                    </h6>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-sm text-gray-500 mt-1 capitalize">
                      {data?.data?.brandId?.name}
                    </p>
                    {/* <span className="text-2xl font-bold text-gray-800">
                        ${Math.round(amount * 100) / 100}
                      </span> */}
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-200 ">
                <div className="flex justify-between items-center">
                  <div>
                    <h6 className="font-medium text-sm  text-gray-800">
                      Customer Name:
                    </h6>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-sm text-gray-500 mt-1 capitalize">
                      {data?.data?.name}
                    </p>
                    {/* <span className="text-2xl font-bold text-gray-800">
                        ${Math.round(amount * 100) / 100}
                      </span> */}
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-200 ">
                <div className="flex justify-between items-center">
                  <div>
                    <h6 className="font-medium text-sm  text-gray-800">
                      Customer Email:
                    </h6>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-sm text-gray-500 mt-1 ">
                      {data?.data?.email}
                    </p>
                    {/* <span className="text-2xl font-bold text-gray-800">
                        ${Math.round(amount * 100) / 100}
                      </span> */}
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-200 ">
                <div className="flex justify-between items-center">
                  <div>
                    <h6 className="font-medium text-sm  text-gray-800">
                      Services:
                    </h6>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-sm text-gray-500">
                      {Array.isArray(data?.data?.service) ? (
                        data?.data?.service.length > 0 ? (
                          data?.data?.service.map((tagItem, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center m-0.5 gap-0.5 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize whitespace-nowrap "
                            >
                              {tagItem}
                            </span>
                          ))
                        ) : (
                          <span className="text-[12px] text-gray-600">
                            No Service
                          </span>
                        )
                      ) : (
                        <span className="capitalize inline-flex items-center m-0.5 gap-0.5 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {data?.data?.service || "No Service"}
                        </span>
                      )}
                    </p>
                    {/* <span className="text-2xl font-bold text-gray-800">
                        ${Math.round(amount * 100) / 100}
                      </span> */}
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-200 ">
                <div className="flex justify-between items-center">
                  <div>
                    <h6 className="font-medium text-sm  text-gray-800">
                      Currency:
                    </h6>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-sm text-gray-500 mt-1 ">
                      {data?.data?.currency}
                    </p>
                    {/* <span className="text-2xl font-bold text-gray-800">
                        ${Math.round(amount * 100) / 100}
                      </span> */}
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-200 ">
                <div className="flex justify-between items-center">
                  <div>
                    <h6 className="font-medium text-sm  text-gray-800">
                      Amount:
                    </h6>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-sm text-gray-500 mt-1 ">
                      {Math.round(data?.data?.amount * 100) / 100}
                    </p>
                    {/* <span className="text-2xl font-bold text-gray-800">
                        ${Math.round(amount * 100) / 100}
                      </span> */}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">
                    Total Amount
                  </span>
                  <span className="text-xl font-semibold text-gray-600">
                    ${Math.round(data?.data?.amount * 100) / 100}
                  </span>
                </div>
              </div>

              {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-700">
                      <strong>Secure Payment:</strong> All payments are
                      processed securely. Your payment information is encrypted
                      and protected.
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Right Column - Fee Details */}

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Choose a way to Pay
            </h2>
            <PayPalButton
              id={data?.data?._id}
              paypalClientId={data?.data?.paypalClientId}
              // amount={Math.round(amount * 100) / 100}
              onSuccess={handlePayPalSuccess}
              onError={handlePayPalError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaymentDetail;
