const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const sha256 = require('sha256');
const uniqid = require('uniqid');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PhonePe Credentials
const PHONEPE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox"; // Sandbox/Test
const MERCHANT_ID = "M23S0PEPLIPTJ_2602030833";
const SALT_KEY = "YWMxNDc2MzktNzJjYS00ZDYzLTg1MjgtNTU0ZDgyMDAyZWEz";
const SALT_INDEX = 1;

app.get('/', (req, res) => {
    res.send("PhonePe Payment Server is Running!");
});

app.post('/pay', async (req, res) => {
    try {
        const { name, mobile, amount, transactionId } = req.body;

        // Transaction ID (Use provided or generate one)
        const merchantTransactionId = transactionId || uniqid();
        const userId = "MUID" + uniqid(); // Unique User ID

        // Payload
        const payload = {
            merchantId: MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: userId,
            amount: amount * 100, // Amount in paise
            redirectUrl: `http://localhost:3000/redirect/${merchantTransactionId}`,
            redirectMode: "REDIRECT",
            mobileNumber: mobile,
            paymentInstrument: {
                type: "PAY_PAGE"
            }
        };

        const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
        const base64EncodedPayload = bufferObj.toString("base64");

        // X-VERIFY Checksum
        const stringToHash = base64EncodedPayload + "/pg/v1/pay" + SALT_KEY;
        const sha256Value = sha256(stringToHash);
        const xVerify = sha256Value + "###" + SALT_INDEX;

        const options = {
            method: 'post',
            url: `${PHONEPE_HOST_URL}/pg/v1/pay`,
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': xVerify,
            },
            data: {
                request: base64EncodedPayload
            }
        };

        const response = await axios.request(options);

        // Return URL to frontend
        return res.json({
            url: response.data.data.instrumentResponse.redirectInfo.url,
            transactionId: merchantTransactionId
        });

    } catch (error) {
        console.error("Payment Error:", error.response ? error.response.data : error.message);
        res.status(500).json({
            message: "Payment initiation failed",
            error: error.message
        });
    }
});

app.get('/redirect/:merchantTransactionId', (req, res) => {
    const { merchantTransactionId } = req.params;

    // In a real app, you would check payment status here using /pg/v1/status
    // For now, we redirect back to the static site success page (or home)

    if (merchantTransactionId) {
        // You might want to pass status as query param
        res.redirect(`http://127.0.0.1:5500/index.html?status=success&tid=${merchantTransactionId}`); // Adjust port if needed
    } else {
        res.redirect('http://127.0.0.1:5500/index.html?status=failure');
    }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
