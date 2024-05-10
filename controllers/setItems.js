const VIP=require("../Schemas/VIP")
const mongoose=require("mongoose")
const bcrypt=require('bcrypt')
let hashedPWD=''
bcrypt.hash("muzaffarkadirovmr_kadirov101muzaffar571181974088108", 10, function(err, hash) {
    if(err){
		console.log(err)
	}

	if(hash){
		const nVIP=new VIP({
			firstname:"muzaffar",
			lastname:"kadirov",
			username:"mr_kadirov101",
			email:"muzaffar571181@gmail.com",
			phone_number:974088108,
			password:"$2b$10$myarlbcN9rFt8sJ0RfqxyOnZyQhivgbhN.MPIefhigcjSgTYBtgdK",
			loggedIn:false,
			token:hash
		})
		// nVIP.save()
		console.log("successfully saved VIP")
	}
});


