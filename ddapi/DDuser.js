var querystring = require("querystring");
var httpUtil = require('../util/http');

var dduserapi = {

	getuserinfo : function (accessToken, authcode, cb) {
		var path = '/user/getuserinfo?' + querystring.stringify({
				access_token : accessToken,
				code : authcode
			});
		httpUtil.get(path, cb);
	},

	getuserdetails : function (accessToken, authcode, cb) {
		dduserapi.getuserinfo(accessToken, authcode, {
			success : function (userinfo) {
				var path = '/user/get?' + querystring.stringify({
						access_token : accessToken,
						userid : userinfo.userid
					});
				httpUtil.get(path, cb);
			},
			error(error) {
				console.log('Get user details failure!!')
			}
		})

	},

	delete  : function (accessToken, id, cb) {
		var path = '/department/delete?' + querystring.stringify({
				access_token : accessToken,
				id : id,
			});
		httpUtil.get(path, cb);
	}
};
module.exports = dduserapi;