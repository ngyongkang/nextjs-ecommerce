import { listPaymentIntent } from '@/lib/stripeAPI';
import { NextRequest } from 'next/server';

export async function GET(Request: NextRequest) {
  const response = await listPaymentIntent();
  console.log(response.paymentIntent.has_more);
  //   data.paymentIntent.map((paymentIntent) => {
  //     console.log(paymentIntent.id);
  //   });
  return Response.json({});
}

export async function POST(Request: NextRequest) {
  const data = await Request.json();
  console.log(data);
  return Response.json(data);
}
