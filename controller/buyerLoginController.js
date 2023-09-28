const buyerModel = require("../model/buyerModel");
const bcrypt = require("bcrypt");
const nodeMailer = require("nodemailer");
const OtpModel = require("../model/otpVerification");
const jwt = require("jsonwebtoken");

let transport = nodeMailer.createTransport({
    service: "Gmail",
    auth: {
        user: "prashant.meena@iratechnologies.com",
        pass: "Prashant123@",
    },
});

exports.getCredentials = (req, res, next) => {
    try {
        buyerModel
            .find({})
            .then((result) => {
                if (!result) {
                    return res.status(404).json("user does not exist");
                } else {
                    res.status(200).json(result);
                }
            })
            .catch((Error) => {
                res.status(404).json(Error);
            });
    } catch (error) {
        res.status(404).json("something went wrong");
    }
};

exports.buyerLogin = async (req, res, next) => {
    let token;
    try {
        const username = req.body.username;
        const password = req.body.password;

        const hashedPassword = await bcrypt.hash(password, 12);

        const modelStore = await new buyerModel({
            username: username,
            password: hashedPassword,
        });

        await modelStore.save();
        token = jwt.sign(
            { userId: username, password: hashedPassword },
            "secretkeyappearshere",
            { expiresIn: "1h" }
        );

        res.status(200).json(
            `you will be redirected to change password and this is your token: ${token}`
        );
    } catch (error) {
        res.status(404).json("something went wrong!!");
    }
};

exports.setPassword = async (req, res, next) => {
    try {
        const username = req.body.username;
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;

        const existUser = await buyerModel.findOne({ username: username });

        if (!existUser) {
            return res.status(404).json("user dosen't exist!!");
        }

        const validPassword = await bcrypt.compare(
            currentPassword,
            existUser.password
        );

        if (!validPassword) {
            return res.status(404).json("password is incorrect");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        existUser.password = hashedPassword;

        await existUser.save();

        res.status(200).json("password has been updated");
    } catch (error) {
        res.status(404).json("password not changed something went wrong");
    }
};

exports.otpVerificationEmail = async (req, res, next) => {
    try {
        const email = req.body.email;
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
            from: "prashant.meena@iratechnologies.com",
            to: email,
            subject: "verify your Email",
            html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete your verification</p>
        <p><b>The code will expire in 15 minutes</b></p>`,
        };

        const hashedOtp = await bcrypt.hash(otp, 10);
        const newOtpVerify = await new OtpModel({
            userId: email,
            otp: hashedOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 60000,
        });

        await newOtpVerify.save();
        await transport.sendMail(mailOptions);

        res.json({
            status: "PENDING",
            message: "verification otp email sent",
            data: {
                email,
            },
        });
    } catch (err) {
        res.json({
            status: "FAILED",
            message: err.message,
        });
    }
};

exports.verifyOtp = async (req, res, next) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;

        if (!email || !otp) {
            return res.status(404).json("empty otp or Email is not allowed !");
        }
        const findUser = await OtpModel.find({ userId: email });

        if (!findUser) {
            res.status(404).json(
                "Account record dosn't exist or has been verified already."
            );
        } else {
            const { expiresAt } = findUser[0];
            const hashedOtp = findUser[0].otp;

            if (expiresAt < Date.now()) {
                await OtpModel.deleteMany({ userId: email });
                res.status(404).json("Code has Expired.Please Try again!!");
            } else {
                const validOtp = await bcrypt.compare(otp, hashedOtp);
                if (!validOtp) {
                    return res
                        .status(404)
                        .json("invalid Otp please check you mail inbox");
                } else {
                    await OtpModel.deleteMany({ userId: email });
                    res.status(200).json("verified");
                }
            }
        }
    } catch (error) {
        res.status(404).json("you are not verified!!");
    }
};
