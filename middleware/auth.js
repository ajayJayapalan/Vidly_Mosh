const jwt = require('jsonwebtoken')

module.exports = function(req,res,next){
	const token = req.header('x-auth-token');
	if(!token) return res.status(401).send(' Access Denied: Token not provided')
	
	try {
			const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
			req.user = decoded;
			// req.user._id can be used in the route handlers
			next();
	} catch(err){
			res.status(400).send('Invlaid token.')
	}
}