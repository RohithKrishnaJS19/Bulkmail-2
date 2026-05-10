const express = require("express")
const nodemailer = require("nodemailer")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URL)

const passkey = mongoose.model("summa", {
    user: String,
    pass: String
}, "student")

app.post("/sendemail", function (req, res) {
    var msg = req.body.value
    var email = req.body.email

    passkey.find().then(function (data) {
        const userdata = data[0].user
        const passdata = data[0].pass
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: userdata,
                pass: passdata
            }
        })
        new Promise(async function (resolve, reject) {
            try {
                for (var i = 0; i < email.length; i++) {
                    await transport.sendMail(
                        {
                            from: userdata,
                            to: email[i],
                            subject: "Creating a Bulk main app",
                            text: msg
                        })
                    console.log("Email send to :" + email[i])
                }
                resolve("Success")
            }
            catch {
                reject("Fail")
            }
        }).then(function () {
            res.send(true)
        }).catch(function () {
            res.send(false)
        })
    }).catch(function () {
        console.log("No data")
    })
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("Server Started...");
});