;
(function () {
	var Page = {
		init : function () {
			var that = this;
			//防止300毫秒点击延迟
			FastClick.attach(document.body);
			//绑定事件
			this.bind();
			//绑定左上角返回事件
			this.setLeft();
			//初始化导航的title,采用事件的方式实现解耦
			$('body').trigger('navigation.title.change', [{
						"title" : "新申请"
					}
				]);
			$('body').trigger('navigation.rightButton.change', [{
						"text" : "保存",
						"callback" : function () {
							var obj = {};
							obj.taskId =  + (new Date());
							obj.attTypeID = $('#attTypeid').val();
							if (!obj.attTypeID) {
								//alert(obj.attTypeid);
								dd.device.notification.toast({
									icon : 'error', //icon样式，有success和error，默认为空0.0.2
									text : "请输入假期类型", //提示信息
									duration : 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s>2s)]
									delay : 0, //延迟显示，单位秒，默认0
									onSuccess : function (result) {
										/*{}*/
									},
									onFail : function (err) {}
								});
								return;
							}

							obj.startTime = $('#startTime').html();
							if (!obj.startTime) {
								dd.device.notification.toast({
									icon : 'error', //icon样式，有success和error，默认为空0.0.2
									text : "请选择开始时间", //提示信息
									duration : 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s>2s)]
									delay : 0, //延迟显示，单位秒，默认0
									onSuccess : function (result) {
										/*{}*/
									},
									onFail : function (err) {}
								});
								return;
							}
							obj.endTime = $('#endTime').html();
							if (!obj.endTime) {
								dd.device.notification.toast({
									icon : 'error', //icon样式，有success和error，默认为空0.0.2
									text : "请选择结束时间", //提示信息
									duration : 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s>2s)]
									delay : 0, //延迟显示，单位秒，默认0
									onSuccess : function (result) {
										/*{}*/
									},
									onFail : function (err) {}
								});
								return;
							}
							obj.duration = $('#duration').val();
							if (!obj.duration) {
								dd.device.notification.toast({
									icon : 'error', //icon样式，有success和error，默认为空0.0.2
									text : "请输入时长(小时)", //提示信息
									duration : 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s>2s)]
									delay : 0, //延迟显示，单位秒，默认0
									onSuccess : function (result) {
										/*{}*/
									},
									onFail : function (err) {}
								});
								return;
							}
							obj.memo = $('#memo').val();
							if (!obj.memo) {
								dd.device.notification.toast({
									icon : 'error', //icon样式，有success和error，默认为空0.0.2
									text : "请输入任务描述", //提示信息
									duration : 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s>2s)]
									delay : 0, //延迟显示，单位秒，默认0
									onSuccess : function (result) {
										/*{}*/
									},
									onFail : function (err) {}
								});
								return;
							}
							obj.oper = 'add';
							$.ajax({
								url : '/tm/vacationadding',
								type : 'post',
								data : obj,
								//timeout : 5000,
								success : function (data) {
									alert("first" + JSON.stringify(data));
									if (data.result==true) {
										dd.biz.navigation.close();
									} else { //dd.biz.navigation.close();
										window.location.href = 'http://192.168.31.105:3000';
										alert('second' + data);
									}

								},
								error : function (xhr, errorType, error) {
									alert('ajaxfailed' + errorType + error)
								}
							})
						}
					}
				])
		},

		bind : function () { //采用事件监听的方式是为了能够在统一一个地方设置导航的Title
			$('body').on('navigation.title.change', function (e, res) {
				dd.biz.navigation.setTitle({
					title : res.title
				});
			}); //采用事件监听的方式是为了能够在统一一个地方设置导航的右上角按钮文案及点击事件
			$('body').on('navigation.rightButton.change', function (e, res) {
				dd.biz.navigation.setRight({
					show : res.show, //控制按钮显示，true显示，false隐藏，默认true
					control : true, //是否控制点击事件，true控制，false不控制，默认false
					showIcon : true, //是否显示icon，true显示，false不显示，默认true；注：具体UI以客户端为准
					text : res.text,
					onSuccess : function () {
						res.callback && res.callback();
					}
				})
			});
			$('#task-add .datepicker').on('click', function () {
				var node = $(this).find('.date');
				var v = node.html().trim();
				dd.biz.util.datetimepicker({
					format : 'yyyy/MM/dd HH:mm',
					value : v, //默认显示日期
					onSuccess : function (result) {
						/*{
						value:"2015-02-10"
						}
						 */
						node.html(result.value);
					},
					onFail : function () {}
				});
			});

			$('#task-add .select-type').on('click', function () {
				var node = $(this).find('.select');
				var s = $(this).find('input[name=attTypeid]');
				var v = node.html().trim();
				dd.biz.util.chosen({
					source : [{
							key : '带薪年假', //显示文本
							value : 1
						}, {
							key : '带薪病假',
							value : 2
						}, {
							key : '加班倒休',
							value : 3
						}, {
							key : '婚假',
							value : 6
						}, {
							key : '产假/陪产假',
							value : 7
						}, {
							key : '丧假',
							value : 8
						}
					],
					selectedKey : v,
					onSuccess : function (result) {
						/*{
						key:'选项2',
						value:'234'
						}
						 */
						node.html(result.key);
						s.val(result.value);
					},
					onFail : function () {}
				})
			});
		},
		setLeft : function () {
			var that = this;
			dd.biz.navigation.setLeft({
				show : true, //控制按钮显示，true显示，false隐藏，默认true
				control : true, //是否控制点击事件，true控制，false不控制，默认false
				showIcon : true, //是否显示icon，true显示，false不显示，默认true；注：具体UI以客户端为准
				onSuccess : function (result) {
					dd.device.notification.confirm({
						message : "新增任务还未保存",
						title : "提示",
						buttonLabels : ['不保存', '继续'],
						onSuccess : function (result) {
							/*{
							buttonIndex:0//被点击按钮的索引值，Number类型，从0开始
							}
							 */
							if (result.buttonIndex == 0) {
								dd.biz.navigation.close();
							}
						},
						onFail : function (err) {}
					});
				},
				onFail : function (err) {}
			});

		}
	};
	//为了能够在PC端进行测试
	if (dd.version) {
		dd.ready(function () {
			Page.init();
		});
	} else {
		Page.init();
	}
})();
