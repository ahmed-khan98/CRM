
import { CheckCircle2 } from "lucide-react";

const Success = () => {

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white border border-zinc-200 rounded-2xl p-10 max-w-md w-full text-center shadow-xl">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-emerald-100">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-800 mb-2">
          Payment Successful
        </h2>
        <p className="text-zinc-500 text-sm mb-6">
          Thank you for your payment. Your transaction has been completed
          successfully.
        </p>
      </div>
    </div>
  );
};

export default Success;

// export default function Success() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <PaymentSuccessComponent />
//     </Suspense>
//   );
// }

// const searchParams = useSearchParams();
// const session_id = searchParams.get("session_id");
// const status = searchParams.get("status");
// const type = searchParams.get("type");
// const router = useRouter();
// console.log(status,'----status')
// const [paymentSuccess] = usePaymentSuccessMutation();

// useEffect(() => {
//   if (session_id) {
//     paymentSuccess({ session_id,status,type });
//   }
// }, [session_id, paymentSuccess]);
