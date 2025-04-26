import axios from "axios";

export const initializePayment = async (req, res) => {
  const { email } = req.body;

  // const options = {
  //   hostname: "api.paystack.co",
  //   port: 443,
  //   path: "/transaction/initialize",
  //   method: "POST",
  //   headers: {
  //     Authorization: "Bearer SECRET_KEY",
  //     "Content-Type": "application/json",
  //   },
  // };
  try {
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email,
      amount: 5000,
      callback_url: `${process.env.BASE_URL}/api/v0/payment-callback`,
    },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": 'application/json'
        },
      });
    
    const data = response.data;
    const authorizationURL = response.data.data.authorization_url;

    res.status(200).json(data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to initialize payment" });
  }
};

export const verifyPaymentAndGenerateQR = async (req, res) => {
  const { reference } = req.query;

  try {
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to verify payment" });
  }
};
