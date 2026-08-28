const express = require("express");

require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.post("/subscribe", async (req, res) => {

    const email = req.body.email;

    console.log("Subscriber:", email);

    // Add member to mailing list
    const memberData = new URLSearchParams({
        address: email
    });

    const auth = Buffer.from(
        `api:${process.env.MAILGUN_API_KEY}`
    ).toString("base64");

    try {

        const memberResponse = await fetch(
            `https://api.mailgun.net/v3/lists/${process.env.MAILGUN_DOMAIN}/members`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${auth}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: memberData
            }
        );

        const memberResponseData = await memberResponse.text();

        console.log("Mailgun:", memberResponseData);
        console.log("Status code:", memberResponse.status);

        if (!memberResponse.ok) {

            res.status(memberResponse.status).send(
                "Failed to subscribe."
            );

            return;
        }

        res.status(200).send(
            "Successfully subscribed!"
        );

    } catch (error) {

        console.error("Error:", error);

        res.status(500).send(
            "Something went wrong."
        );
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});