export const metadata = {
  title: "Payment | Customer payment",
  icons: { icon: "/payment-card.svg" },
};

export default function PayIndexPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <p className="text-sm font-medium text-zinc-500">
        This payment link is incomplete. Please use the full link you received.
      </p>
    </div>
  );
}
