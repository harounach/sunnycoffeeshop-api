const { verifyToken } = require("../utils/auth");

exports.isAuth = async (req, res, next) => {
	const authorization = req.headers.authorization || req.headers.Authorization
	try {
		const token = authorization.slice(7, authorization.length);
		const user = verifyToken(token);
		if (!user) {
			return res.status(401).json({error: "Invalid token"});
		}

		req.user = user;
		return next();
	} catch(err) {
		return res.status(401).json({error: "Invalid token"});
	}
};

exports.isAdmin = async (req, res, next) => {
	if (req.user && req.user.admin) {
    return next();
  }

  return res.status(403).json({ error: 'Unauthorized' });
}
