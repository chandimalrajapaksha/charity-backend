const router = require("express").Router();
const stripe = require("stripe")(
  "sk_test_51N6SokEyrZyjTHe0p6XLtVz9PsbTuhtvaxAf4TNaUGdOUS69nxVgjuwvRljbzzJVBnxGPZgiZ7OronMgVBiTvfcf00Ag1ytyht"
);

router.route("/").post(async (req, res) => {
  try {
    // Create the subscription. Note we're expanding the Subscription's
    // latest invoice and that invoice's payment_intent
    // so we can pass it to the front end to confirm the payment
    const subscription = await stripe.subscriptions.create({
      customer: "cus_Nw8s0EJRerUodO",
      items: [
        {
          price: "usd",
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

   
    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {}

  //res.send("Hello, World!");
});

//done
router.route("/save").post(async (req, res) => {

  const { email, name } = req.body;
  
  if (email == null || name == null) {
    res.status(422).json({
      status: 422,
      message: "Unprocessable Content",
    });

    return;
  }

  stripe.customers.create(
    {
      email: email,
      name: name,
      description: "New customer",
    },
    function (err, customer) {
      if (err) {
        
        res.status(500).json({
          status: 500,
          message: "internal server error occured",
          error: err,
        });
      } else {
        
        res.status(200).json({
          status: 200,
          message: "customer saved successfully",
          data: customer,
        });
      }
    }
  );
});

router.route("/subscribe").post(async (req, res) => {
  const { customerId, priceId , paymentMethod } = req.body;

  if (customerId == null) {
    res.status(422).json({
      status: 422,
      message: "Unprocessable Content",
    });

    return;
  }

  stripe.subscriptions.create(
    {
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      trial_period_days: 0,
      metadata: {
        order_id: "12345",
      },
      default_payment_method: paymentMethod,
    },

    function (err, subscription) {
      if (err) {
        
        res.status(500).json({
          status: 500,
          message: "internal server error occured",
          data: err,
        });
      } else {
        
        res.status(200).json({
          status: 200,
          message: "subscription created successfully",
          data: subscription,
        });
      }
    }
  );
});

router.route("/payment").post(async (req, res) => {
  const { cardNo, expMonth, expYear, cvc } = req.body;
 
  if (cardNo == null || expMonth == null || expYear == null || cvc == null ) {
    res.status(422).json({
      status: 422,
      message: "Unprocessable Content",
    });

    return;
  }

  try {
    // Create a payment method
    stripe.paymentMethods.create(
      {
        type: "card",
        card: {
          number: cardNo, // Replace with a valid card number
          exp_month: expMonth, // Replace with the expiration month
          exp_year: expYear, // Replace with the expiration year
          cvc: cvc, // Replace with the CVC code
        },
      },
      function (err, paymentMethod) {
        if (err) {
          res.status(500).json({
            status: 500,
            message: "internal server error occured",
            error: err,
          });
        } else {
          
          res.status(200).json({
            status: 200,
            message: "payment method created successfully",
            data: paymentMethod,
          });
        }
      }
    );
  } catch (error) {
    console.log(error)
  }

  //res.send("Hello, World!");
});

router.route("/attach").post(async (req, res) => {
 
  const {customerId , paymentMethod} = req.body

  if (customerId == null) {
    res.status(422).json({
      status: 422,
      message: "Unprocessable Content",
    });

    return;
  }


  
    // Attach a payment method to a customer
    stripe.paymentMethods.attach(
      paymentMethod, // Replace with the payment method ID
      {
        customer: customerId, // Replace with the customer ID
      },
      function (err, paymentMethod) {
        if (err) {
          
          res.status(500).json({
            status: 500,
            message: "internal server error occured",
            error: err,
          });
        } else {
          
          res.status(200).json({
            status: 200,
            message: "payment method attached successfully",
            data: paymentMethod,
          });
        }
      }
    );
  

  //res.send("Hello, World!");
});

module.exports = router;
