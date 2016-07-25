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
			corpId : _config.corpId, //��ҵid
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
						logger.e("ajax failed��" + errorType + ', requestauthcode ' + error + ',' + JSON.stringify(xhr));
					}
				});
			},
			onFail : function (err) {
				logger.e('requestAuthCode fail: ' + JSON.stringify(err));
			}
		});

		$('.chooseonebtn').on('click', function () {

			dd.biz.chat.pickConversation({
				corpId : _config.corpId, //��ҵid
				isConfirm : 'false', //�Ƿ񵯳�ȷ�ϴ��ڣ�Ĭ��Ϊtrue
				onSuccess : function (data) {
					var chatinfo = data;
					if (chatinfo) {
						console.log(chatinfo.cid);
						dd.device.notification.prompt({
							message : "������Ϣ",
							title : chatinfo.title,
							buttonLabels : ['����', 'ȡ��'],
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
											logger.i('sendMsg: ���ͳɹ�');
											/**
											 * ��ת���Ի�����
											 */
											dd.biz.chat.open({
												cid : chatinfo.cid,
												onSuccess : function (result) {},
												onFail : function (err) {}
											});
										} else {
											logger.e('sendMsg: ����ʧ��' + info.errmsg);
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
				startWithDepartmentId : 0, //-1��ʾ�򿪵�ͨѶ¼���Լ����ڲ��ſ�ʼչʾ, 0��ʾ����ҵ���ϲ㿪ʼ��(�������ֱ�ʾ�Ӹò��ſ�ʼ:��ʱ��֧��)
				multiple : false, //�Ƿ��ѡ�� true��ѡ false��ѡ�� Ĭ��true
				users : [], //Ĭ��ѡ�е��û��б�userid���ɹ��ص���Ӧ��������Ϣ
				corpId : _config.corpId, //��ҵid
				max : 10, //�������ƣ���multipleΪtrue����Ч����ѡ��Χ1-1500
				onSuccess : function (data) {
					if (data && data.length > 0) {
						var selectUserId = data[0].emplId;
						if (selectUserId > 0) {
							dd.biz.telephone.call({
								users : [selectUserId], //�û��б�����
								corpId : _config.corpId, //��ҵid
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
