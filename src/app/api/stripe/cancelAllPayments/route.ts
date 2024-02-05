import {
  cancelPaymentIntent,
  getPaymentIntent,
  listPaymentIntent,
} from '@/lib/stripeAPI';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }
  const response = await listPaymentIntent();
  let updateCount = 0;
  response.paymentIntent.data.map(async (paymentIntent) => {
    if (
      (paymentIntent.status as string) != 'succeeded' &&
      (paymentIntent.status as string) != 'canceled'
    ) {
      updateCount++;
      await cancelPaymentIntent(paymentIntent.id);
    }
  });
  console.log(updateCount);
  return Response.json({ totalCanceled: updateCount });

  // const paymentIntent = await getPaymentIntent();

  // return Response.json(paymentIntent);
}
