import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Please fill all fields" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token, user: { name: user.name } });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({
            success: false,
            message: "Error in registration",
            error: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token, user: { name: user.name } });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log("Login Error:", error);
        res.json({ success: false, message: "Error in login" });
    }
};

const userCredits = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await userModel.findById(userId);
        res.json({
            success: true,
            credits: user.creditBalance,
            user: { name: user.name },
        });
    } catch (error) {
        console.log("UserCredits Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async (req, res) => {   
    try {

        const {userId, planId} = req.body;

        const userData = await userModel.findById(userId);

        if (!userId || !planId) {
            return res.json({ success: false, message: "Please provide userId and planId" });
        }

        let credits, plan, amount, date

        switch (planId) {
            case "Basic":
                plan = "Basic";
                credits = 100; 
                amount = 10;
                break
                
            case "Advanced":
                plan = "Advanced";
                credits = 500;
                amount = 50;
                break

            case "Business":
                plan = "Business";
                credits = 5000;
                amount = 250;
                break
        
            default:
                return res.json({ success: false, message: "plan not found" });
        }

        date = Date.now();
         
        const transactionData ={
            userId, plan, amount, credits, date
        }

        const newTransaction = await transactionModel.create(transactionData);

        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency: process.env.CURRENCY,
            receipt: newTransaction._id,
        }

        await razorpayInstance.orders.create(options, (error, order) => { 
            if (error) {
                console.log(error);
                return res.json({ success: false, message: error});
            }
            res.json({success: true, order});

        })


        


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });       
    }
}

export { registerUser, loginUser, userCredits, paymentRazorpay };
