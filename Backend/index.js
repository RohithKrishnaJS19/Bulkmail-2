const express = require("express")
const nodemailer = require("nodemailer")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

const app = express()
app.use(cors({
    origin: "https://bulkmail-2.vercel.app",
    methods: ["GET", "POST"]
}))
app.use(express.json())

mongoose.connect(process.env.MONGO_URL).then(function () {
    console.log("MongoDB Connected")
}).catch(function (err) {
    console.log("MongoDB Error:", err)
})

const passkey = mongoose.model("summa", {
    user: String,
    pass: String
}, "student")

app.post("/sendemail", async function (req, res) {
    try {
        const msg = req.body.value
        const email = req.body.email

        const data = await passkey.find()
        const userdata = data[0].user
        const passdata = data[0].pass

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: userdata,
                pass: passdata
            }
        })

        let success = true

        for (const e of email) {
            try {
                await transport.sendMail({
                    from: userdata,
                    to: e,
                    subject: "Creating a Bulk mail app",
                    text: msg
                })
                console.log("Sent:", e)
            } catch (err) {
                console.log("Failed:", e, err)
                success = false
            }
        }

        res.send(success)

    } catch (err) {
        console.log("GLOBAL ERROR:", err)
        res.send(false)
    }
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("Server Started...");
});