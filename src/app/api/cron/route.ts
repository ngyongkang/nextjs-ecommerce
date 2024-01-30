import type { NextRequest } from 'next/server';
import prisma from '@/lib/db/prisma';

const daysAgo: number = 7;

function getDifferenceBetweenDates(startDate: Date, EndDate: Date) {
  // Calculating the time difference
  // of two dates
  let Difference_In_Time = EndDate.getTime() - startDate.getTime();

  // Calculating the no. of days between
  // two dates
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

  // To display the final no. of days (result)
  //   const string =
  //     'Total number of days between dates:\n' +
  //     startDate.toDateString() +
  //     ' and ' +
  //     EndDate.toDateString() +
  //     ' is: ' +
  //     Difference_In_Days +
  //     ' days';
  //   console.log(string); //For debugging

  return Difference_In_Days;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  let carts = await prisma.cart.findMany();

  carts = carts.filter((cart) => {
    if (
      getDifferenceBetweenDates(cart.updateAt, new Date()) >= daysAgo &&
      !cart.userId
    )
      return cart;

    return;
  });

  if (carts.length > 0) {
    await prisma.cart.deleteMany({
      where: {
        id: {
          in: carts.map((cart) => {
            return cart.id;
          }),
        },
      },
    });
  }

  return Response.json({ numberOfDeletedEntrires: carts.length });
}
