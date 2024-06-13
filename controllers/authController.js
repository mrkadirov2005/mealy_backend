const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminScheme = require("../Schemas/admin");
const VIPScheme = require("../Schemas/VIP");
const User = require("../Schemas/User");
const { v4: uuid } = require("uuid");

const handleAdminLogIn = async (req, res) => {
	if (!Object.keys(req.body).includes("type")) {
		res.status(400).send("please provide the type");
		return;
	}
	const TYPE = req.body.type.split("/");
	// if the request is for admin login
	if (TYPE[0] == "admin" && TYPE[1] == "login") {
		// log request on console
		console.log("/Get request for handleAdminLogIn");
		// required:   email and password
		// destructure email and password from req.body
		const { email, password } = req.body;
		// check email and password existence and validity
		if (!email || !password) {
			res.status(403).json("please provide details");
			
			// do not forget to return to break and stop the process
			return;
		}
		//find admin from data base
		const foundUser = await AdminScheme.findOne({ email }).exec();

		if (foundUser) {
			bcrypt.compare(password, foundUser.password, async (err, result) => {
				if (err) {
					console.error(err);
					res.json(err);
					return;
				}
				if (result) {
					if (foundUser.loggedIn) {
						res.status(409).json(foundUser)
						return;
					} else {
						const response = await AdminScheme.updateOne({ email, loggedIn: false }, { loggedIn: true }).exec();
						if (response) {
							res.json({ ...foundUser._doc });
							console.log(JSON.stringify(foundUser))
						}
					}
				}
			});
		} else {
			res.status(400).json({ message: "not found admin" });
		}
	}
	// handle logOut
	if (TYPE[0] === "admin" && TYPE[1] == "logout") {
		console.log("/Get request for handleAdminLogOut");
		const { email, password } = req.body;
		if (!email || !password) {
			res.status(403).json("please provide details");
			return;
		}
		const foundUser = await AdminScheme.findOne({ email }).exec();

		if (foundUser) {
			bcrypt.compare(password, foundUser.password, async function (err, result) {
				if (err) {
					console.error(err);
				}
				if (result) {
					if (!foundUser.loggedIn) {
						res.status(403).json({ message: "already logged out" });
						return;
					} else {
						const response = await AdminScheme.updateOne({ loggedIn: true }, { loggedIn: false }).exec();
						if (response) {
							res.json({ message: "successfully logged out" });
						}
					}
				}
			});
		} else {
			res.status(400).json({ message: "not found admin" });
		}
	}

	// handle VIP login
	if (TYPE[0].toLowerCase() === "vip" && TYPE[1].toLowerCase() == "login") {
		// requirements
		const { password, email, number } = req.body;
		if (!password || !email) {
			res.status(403).json({ message: "please provide whole details" });
		}
		const foundUser = await VIPScheme.findOne({ email }).exec();

		console.log(number)
		if (foundUser && Number(number) === foundUser.phone_number) {
			console.log(foundUser);
			bcrypt.compare(password, foundUser.password, async function (err, result) {
				if (err) {
					console.log(err);
				}
				if (result) {
					// check if is already logged in
					if (foundUser.loggedIn) {
						res.status(409).json(foundUser);
						return;
					}

					await VIPScheme.updateOne({ loggedIn: false }, { loggedIn: true });
					res.status(200).json(foundUser);
				} else {
					res.json({ message: "incorrect data entered;" });
					return;
				}
			});
		} else {
			res.json({ message: "user not found" });
			return;
		}
	}
	// handle vip logout
	// required email and password
	if (TYPE[0].toLowerCase() === "vip" && TYPE[1].toLowerCase() == "logout") {
		const { email, password } = req.body;
		if (!email || !password) {
			res.status(401).json({ message: "please provide whole details" });
			return;
		}
		const foundUser = await VIPScheme.findOne({ email }).exec();
		if (foundUser) {
			if (!foundUser.loggedIn) {
				res.json({ message: "already logged out" });
				return;
			}
			const match = bcrypt.compare(password, foundUser.password);
			if (match) {
				await VIPScheme.updateOne(
					{ password: foundUser.password, loggedIn: true },
					{ password: foundUser.password, loggedIn: false },
				);
				res.status(200).json({ message: "successfully logged out" });
			} else {
				res.json({ message: "invalid password" });
			}
		}
	}
	// user re_get_access_token
	if (TYPE[0] === "user" && TYPE[1] == "access_token") {
		const { email, password, phone_number } = req.body;

		const foundUser = await User.findOne({ email, phone_number }).exec();
		bcrypt.compare(password, foundUser.password, async (err, result) => {
			if (err) {
				console.log(err);
			}
			if (result) {
				const accessToken = jwt.sign({ email,  phone_number }, "hhhh", { expiresIn: "1h" });

				await User.updateOne({ access_token: foundUser.access_token, email }, { access_token: accessToken });
				console.log("updated");
				res.json({ status: "renewed", message: "access_token " + accessToken, expires: "1h" });
				// set time out to make it expired
				// setTimeout(async () => {
				// 	await User.updateOne({email,access_token:accessToken},{access_token:"expired"})

				// }, 60000*2);
			} else {
				console.log(res.json({ message: "message occured" }));
			}
		});
	}

	// user login
	// required:
	// password
	// username
	//phone number
	if (TYPE[0] == "user" && TYPE[1] == "login") {
		const { password, username, phone_number, token, email } = req.body;
		if (!password || !email || !username || !phone_number || !token) {
			res.status(400).json("please provide whole data");
			return;
		}
		const foundUser = await User.findOne({ phone_number, username,email }).exec();
		if (!foundUser) {
			console.log(token);
			res.json({ not_found_user: foundUser });
			return;
		}

		if (foundUser && foundUser.access_token==token) {
			bcrypt.compare(password, foundUser.password, async function (err, result) {
				if (err) {
					console.log(err);
				}
				if (result ) {
					if (foundUser.loggedIn) {
						res.json({ message: "already logged in" });
						return;

					}
					try {
						jwt.verify(foundUser.refresh_token, "hhhh", async function (err, decoded) {
							if (err) {
								res.status(403).json({ messagesd: err,"user":foundUser });
								
								return;
							}
							if (decoded) {
								if (decoded.email === email && decoded.phone_number === phone_number) {
									if(!foundUser.refresh_token){
										const refreshToken = jwt.sign({ username, email, phone_number }, "refresh", { expiresIn: "10d" });
									}
									await User.updateOne({ username, phone_number }, { loggedIn: true });
									
									res.json({ message: "logged in" });
								}
							}
						});
					} catch (error) {
						res.json({ message: "error in try catch " });
					}
				} else {
					res.json({ message: "error occured" });
				}
			});
		}else{
			res.json({"message":"incorrect or expired token provided"})
		}
	}

	// user logout
	// required:
	// password
	// username
	//phone number
	if (TYPE[0] == "user" && TYPE[1] == "logout") {
		const { password, username, phone_number } = req.body;
		if (!password || !username || !phone_number) {
			res.status(400).json("please provide whole data");
			return;
		}
		const foundUser = await User.findOne({ phone_number, username }).exec();
		if (!foundUser) {
			console.log(token);
			res.json({ not_found_user: foundUser });
			return;
		}

		if (foundUser) {
			bcrypt.compare(password, foundUser.password, async function (err, result) {
				if (err) {
					console.log(err);
				}
				if (result) {
					if (!foundUser.loggedIn) {
						res.json({ message: "already logged out" });
						return;
					}
					try {
						if (foundUser.phone_number === phone_number) {
							await User.updateOne({ username, phone_number }, { loggedIn: false});
							res.json({ message: "logged out" });
						} else {
							res.json({ message: "error occured in details" });
						}
					} catch (error) {
						res.json({ message: "error in try catch " });
					}
				} else {
					res.json({ message: "error occured" });
				}
			});
		}
	}
};
module.exports = { handleAdminLogIn };
