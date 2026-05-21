import React from 'react'
import PaymentDetail from '@/app/_Components/Payment/PaymentDetail'

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}paymentlink/${params.id}`, {
      cache: 'no-store',
    })
    const json = await res.json()
    const brandName = json?.data?.brandId?.name || 'Customer payment'
    const brandImage = json?.data?.brandId?.image

    return {
      title: `Customer Payment | ${brandName}`,
      description: 'Complete your payment securely. Fast and reliable payment processing.',
      keywords: ['payment', 'secure payment', 'checkout'],
      openGraph: {
        title: `Customer Payment | ${brandName}`,
        description: 'Complete your payment securely',
        type: 'website',
      },
      icons: {
        icon: '/payment-card.svg',
        // icon: brandImage || '/favicon.svg',
        apple: brandImage || '/apple-touch-icon.png',
      },
    }
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return {
      title: 'Payment | Customer payment',
      description: 'Complete your payment securely. Fast and reliable payment processing.',
      keywords: ['payment', 'secure payment', 'checkout'],
      openGraph: {
        title: 'Payment | Customer payment',
        description: 'Complete your payment securely',
        type: 'website',
      },
      icons: {
        icon: '/favicon-card.svg',
        // apple: '/apple-touch-icon.png',
      },
    }
  }
}

const page = async ({ params }) => {
  const { id } = await params;

  return <PaymentDetail id={id} />;
};

export default page;
