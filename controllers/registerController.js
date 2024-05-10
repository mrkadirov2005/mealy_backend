const UserScheme = require("../Schemas/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

const createNewUser = async (req, res) => {
	const { firstname, lastname, username, email, password, phone_number } = req.body;
	if (!firstname || !lastname || !username || !email || !password || !phone_number) {
		res.status(400).send({ message: "please provide all data" });
		return;
	}
	// check if the username is already taken or not
	const foundUser = await UserScheme.findOne({ username: username, phone_number: phone_number }).exec();
	if (foundUser) {
		res.status(400).send({ message: "existing user" });
		return;
	}

	if (!foundUser) {
		bcrypt.hash(password, 10, function (err, hash) {
			if (err) {
				console.log(err);
				return;
			}
			if (hash) {
				const refresh_token = jwt.sign({ firstname, lastname, username, email, phone_number }, "hhhh",{expiresIn:"10d"});
                const access_token=jwt.sign({firstname,lastname,email},"access_token",{expiresIn:"1h"});
				const newUser = new UserScheme({
					firstname,
					lastname,
					username,
					email,
					phone_number,
					access_token: access_token,
					refresh_token:refresh_token,
					password: hash,
					loggedIn: false,
				});
				newUser.save();
				res.json({ message: "user saved successfully", access_token: access_token, expireIn: "1h" });
				
			} else {
				res.json({ message: "error occured" });
			}
		});
	}
	// get delete user

};
module.exports = createNewUser;
