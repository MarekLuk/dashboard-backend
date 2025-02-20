const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { schemaEmail, schemaPassword } = require("../schemas/todoSchema");
const Joi = require("joi");

router.post(
	"/register",
	asyncHandler(async (req, res) => {
		const {
			error: errorPassword,
			value: { password },
		} = schemaPassword.validate({ password: req.body.password });
		const {
			error: errorEmail,
			value: { email },
		} = schemaEmail.validate({ email: req.body.email.toLowerCase() });
		if (errorPassword || errorEmail) {
			return res.status(400).json({
				errorPassword: errorPassword ? errorPassword.details[0].message : null,
				errorEmail: errorEmail ? errorEmail.details[0].message : null,
			});
		}

		if (await User.findOne({ where: { email } })) {
			return res.status(400).json({ message: "User already exists" });
		}
		await User.create({ email, password });
		return res.status(201).json({ message: "User registered successfully" });
	})
);

router.post(
	"/login",
	asyncHandler(async (req, res) => {
		const { password } = req.body;
		const email = req.body.email.toLowerCase();
		const user = await User.findOne({ where: { email } });
		if (!user) {
			console.log("No user found for:", email);
			return res.status(401).json({ message: "Invalid credentials" });
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			console.log("Password mismatch for:", email);
			return res.status(401).json({ message: "Invalid credentials" });
		}
		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET,
			{
				expiresIn: "5m",
			}
		);
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "None",
			// sameSite: "lax",
			maxAge: 5 * 60 * 1000,
		});
		res.json({ message: "Login successful" });
	})
);

router.post("/logout", (req, res) => {
	res.cookie("token", "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "None",
		expires: new Date(0),
	});

	res.status(200).json({ message: "Logged out successfully" });
});

router.get(
	"/verify",
	asyncHandler(async (req, res) => {
		const token = req.cookies.token;
		if (!token) {
			return res.status(401).json({ message: "Not authenticated" });
		}
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			return res.status(200).json({ user: decoded });
		} catch (error) {
			return res.status(401).json({ message: "Invalid or expired token" });
		}
	})
);

module.exports = router;
