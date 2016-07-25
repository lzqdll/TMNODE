;
(function () {
	logger.i('Here we go...');
	logger.i(location.href);
	/**
	 * _config comes from server-side template. see views/index.jade
	 */
	_config = JSON.parse(mss);
/* 	logger.i(_config.agentId);
	logger.i(_config.corpId);
	logger.i(_config.timeStamp);
	logger.i(_config.nonceStr);
	logger.i(_config.signature); */
	dd.config({
		agentId : _config.agentId,
		corpId : _config.corpId,
		timeStamp : _config.timeStamp,
		nonceStr : _config.nonceStr,
		signature : _config.signature,
		jsApiList : [
			'runtime.info',
			'device.notification.prompt',
			'biz.chat.pickConversation',
			'device.notification.confirm',
			'device.notification.alert',
			'device.notification.prompt',
			'biz.chat.open',
			'biz.util.open',
			'biz.user.get',
			'biz.contact.choose',
			'biz.telephone.call',
			'biz.ding.post']
	});

	dd.userid = 0;
	//alert("obj   "+_config);
	dd.ready(function () {
		//alert('aa reday');
		logger.i('dd.ready rocks!');
		dd.runtime.info({
			onSuccess : function (info) {
				logger.i('runtime info: ' + JSON.stringify(info));
			},
			onFail : function (err) {
				logger.e('fail: ' + JSON.stringify(err));
			}
		});

		dd.runtime.permission.requestAuthCode({
			corpId : _config.corpId, //企业id
			onSuccess : function (info) {
				var code = info.code;
				//logger.i('authcode: ' + code);
				$.ajax({
					url : '/users/ssoauth',
					type : "GET",
					data : {
						'code' : code
					},
					dataType : 'json',
					timeout : 5000,
					success : function (data, status, xhr) {
						if (data.result) {
							logger.i('SSO success' + JSON.stringify(data));
							window.location.replace(window.location + 'tm/leavebalance?dd_nav_bgcolor=FF5E97F6');
							//window.location = window.location + 'tm/leavebalance?dd_nav_bgcolor=FF5E97F6';
							//dd.biz.navigation.close();
						} else
							logger.i('SSO fail');
					},
					error : function (xhr, errorType, error) {
						logger.e("ajax failed：" + errorType + ', requestauthcode ' + error + ',' + JSON.stringify(xhr));
					}
				});
			},
			onFail : function (err) {
				logger.e('requestAuthCode fail: ' + JSON.stringify(err));
			}
		});

		$('.chooseonebtn').on('click', function () {

			dd.biz.chat.pickConversation({
				corpId : _config.corpId, //企业id
				isConfirm : 'false', //是否弹出确认窗口，默认为true
				onSuccess : function (data) {
					var chatinfo = data;
					if (chatinfo) {
						console.log(chatinfo.cid);
						dd.device.notification.prompt({
							message : "发送消息",
							title : chatinfo.title,
							buttonLabels : ['发送', '取消'],
							onSuccess : function (result) {
								var text = result.value;
								if (text == '') {
									return false;
								}

								$.ajax({
									url : '/sendMsg.php',
									type : "POST",
									data : {
										"event" : "send_to_conversation",
										"cid" : chatinfo.cid,
										"sender" : dd.userid,
										"content" : text
									},
									dataType : 'json',
									timeout : 900,
									success : function (data, status, xhr) {
										var info = data;
										logger.i('sendMsg: ' + JSON.stringify(data));
										if (info.errcode == 0) {
											logger.i('sendMsg: 发送成功');
											/**
											 * 跳转到对话界面
											 */
											dd.biz.chat.open({
												cid : chatinfo.cid,
												onSuccess : function (result) {},
												onFail : function (err) {}
											});
										} else {
											logger.e('sendMsg: 发送失败' + info.errmsg);
										}
									},
									error : function (xhr, errorType, error) {
										logger.e(errorType + ', ' + error);
									}
								});
							},
							onFail : function (err) {}
						});
					}
				},
				onFail : function (err) {}
			});
		});

		$('.phonecall').on('click', function () {
			dd.biz.contact.choose({
				startWithDepartmentId : 0, //-1表示打开的通讯录从自己所在部门开始展示, 0表示从企业最上层开始，(其他数字表示从该部门开始:暂时不支持)
				multiple : false, //是否多选： true多选 false单选； 默认true
				users : [], //默认选中的用户列表，userid；成功回调中应包含该信息
				corpId : _config.corpId, //企业id
				max : 10, //人数限制，当multiple为true才生效，可选范围1-1500
				onSuccess : function (data) {
					if (data && data.length > 0) {
						var selectUserId = data[0].emplId;
						if (selectUserId > 0) {
							dd.biz.telephone.call({
								users : [selectUserId], //用户列表，工号
								corpId : _config.corpId, //企业id
								onSuccess : function (info) {
									logger.i('biz.telephone.call: info' + JSON.stringify(info));

								},
								onFail : function (err) {
									logger.e('biz.telephone.call: error' + JSON.stringify(err));
								}
							})
						} else {
							return false;
						}
					} else {
						return false;
					}
				},
				onFail : function (err) {}
			});
		});
	});

	dd.error(function (err) {
		logger.e('dd error: ' + JSON.stringify(err));
	});
})()
