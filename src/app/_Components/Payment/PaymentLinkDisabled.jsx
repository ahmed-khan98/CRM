import PaymentPagHeader from "./PaymentPagHeader";

const PaymentLinkDisabled = ({ paymentData }) => {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-slate-900">
      <PaymentPagHeader image={paymentData?.brandId?.image} />
      <main className="max-w-3xl mx-auto sm:px-2 px-4 py-6">
        <div className="rounded-3xl border border-red-200 bg-white p-10 shadow-xl">
          <div className="flex items-center justify-center mb-6">
            <span className="inline-flex items-center justify-center rounded-full bg-red-100 p-3">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-6 w-6 text-red-600"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.414-4.414a1 1 0 011.414 0L10 14.586l.586-.586a1 1 0 011.414 1.414l-1.293 1.293a1 1 0 01-1.414 0L8.586 15a1 1 0 010-1.414zM10 5a1 1 0 00-.993.883L9 6v4a1 1 0 001.993.117L11 10V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 text-center">
            Payment Link Disabled
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600 text-center">
            This payment link is no longer active, so paying with PayPal is disabled.
          </p>
          <div className="mt-8 rounded-2xl bg-zinc-50 p-5 text-sm text-slate-700">
            <p className="font-semibold">Invoice details</p>
            <div className="mt-3 space-y-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Customer</span>
                <span>{paymentData?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>Email</span>
                <span>{paymentData?.email || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount</span>
                <span>{paymentData?.currency} {paymentData?.amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-semibold text-red-600">Disabled</span>
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm text-slate-500 text-center">
            Contact the sender or support if you think this is an error.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PaymentLinkDisabled;
