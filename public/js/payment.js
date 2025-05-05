// import open, { apps } from 'open';
// const shenaseSite = process.env.SITE_PAYMENT_ID;
// const price = 30000000;

// async function checkPayment(req, res) {
//   const { Authority, Status } = await req.query;

//   try {
//     const response = await axios.post(
//       'https://sandbox.zarinpal.com/pg/v4/payment/verify.json',
//       {
//         merchant_id: shenaseSite,
//         amount: price,
//         authority: Authority,
//       },

//       {
//         headers: {
//           accept: 'application/json',
//           'content-type': 'application/json',
//         },
//       }
//     );
//     await open(`https://127.0.0.1:3000/`, {
//       app: {
//         name: apps.chrome,
//       },
//     });
//     console.log(response.data);
//   } catch (error) {
//     console.error(
//       'Error:',
//       error.response ? error.response.data : error.message
//     );
//   }

//   //

//   console.log(Authority, Status);
// }

// // app.get("/check-payment", checkPayment);
