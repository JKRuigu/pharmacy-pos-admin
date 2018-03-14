require('dotenv').config()

module.exports ={
	google:{
		clientID:process.env.G_Client_ID+'.apps.googleusercontent.com',
		clientSecret:process.env.G_CLIENT_SECRET,
	},
	mongodb:{
		dbURI:'mongodb://jkruigu:pharmacy-pos@ds237858.mlab.com:37858/pharmacy-pos'
	},
	session:{
		cookieKey:process.env.COOKIE_KEY
	},facebook:{
		clientID:'chegeherman@gmail.com',
		clientSecret:'chegewangoi',
	},
	mlabusers:{
		dbURI:'https://api.mlab.com/api/1/databases/pharmacy-pos/collections/users?apiKey='+process.env.DB_URI
	}
};
