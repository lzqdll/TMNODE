;
(function () {
	var hash;
	var isShow = true;
	var t = 0;
	var pullDtd;

	var Util = {
		getQuery : function (param) {
			var url = window.location.href;
			var searchIndex = url.indexOf('?');
			var searchParams = url.slice(searchIndex + 1).split('&');
			for (var i = 0; i < searchParams.length; i++) {
				var items = searchParams[i].split('=');
				if (items[0].trim() == param) {
					return items[1].trim();
				}
			}
		},
		getTargetUrl : function (replaceUrl, targetUrl) {
			var protocol = location.protocol;
			var host = location.host;
			//alert(location.pathname);
			var pathname = location.pathname.replace(replaceUrl, targetUrl);
			//alert(pathname);
			return protocol + '//' + host + pathname;
		}
	};

	var Page = {
		init : function () {
			var that = this;
			//防止300毫秒点击延迟
			FastClick.attach(document.body);
			//绑定事件
			this.bind();
			//初始化导航的title,采用事件的方式实现解耦
			$('body').trigger('navigation.title.change', [{
						"title" : "假期摘要"
					}
				]);
			//初始化导航的右上角,采用事件的方式实现解耦
			$('body').trigger('navigation.rightButton.change', [{
						"text" : "新增",
						"show" : true,
						"callback" : function (data) {
							 alert(data.id);
							that.go('add','',data.id);
						}
					}
				]);
			//绑定下拉事件
			dd.ui.pullToRefresh.enable({
				onSuccess : function () {
					setTimeout(function () {
						//todo 相关数据更新操作
						dd.ui.pullToRefresh.stop();
					}, 2000);
				},
				onFail : function () {}
			});
			//绑定每个任务的点击事件，事件采用代理的方式
			$('.doc').on('click', '.item', function () {
				var _this = $(this);
				_this.addClass('active');
				setTimeout(function () {
					that.go('detail', _this.data('taskid'), _this.data('task-type'));
					_this.removeClass('active');
				}, 100);
				//alert(_this.data('task-type'));

			});		
		},

		bind : function () {
			//采用事件监听的方式是为了能够在统一一个地方设置导航的Title
			$('body').on('navigation.title.change', function (e, res) {
				dd.biz.navigation.setTitle({
					title : res.title
				});
			});
			//采用事件监听的方式是为了能够在统一一个地方设置导航的右上角按钮文案及点击事件
			$('body').on('navigation.rightButton.change', function (e, res) {
				dd.biz.navigation.setMenu({
					backgroundColor : "FF5E97F6",
					items : [{
							"id" : "1",
							//"iconId" : "photo",
							"text" : "休假申请"
						},{
							"id" : "2",
							//"iconId" : "photo",
							"text" : "加班申请"
						}
					],
					onSuccess : function (data) {
						/*{"id":"1"}
						 */
						 res.callback&&res.callback(data);
						
					},
					onFail : function (err) {}
				});
			});
		},
		go : function (page, taskId, taskType) {
			var that = this;
			if (page == 'add') {
				//这里替换为对应的页面url
				dd.biz.util.openLink({
					url : Util.getTargetUrl('tm/leavebalance', 'add/')+taskType
				});
				return;

			} else if (page == 'detail') {
				dd.biz.util.openLink({
					url : Util.getTargetUrl('index.html', 'detail.html') + '?taskId=' + taskId + '&taskType=' + taskType
				});
				return;
			}
		}
	};
	if (dd.version) {
		//alert('dd:' + dd.version);
		dd.ready(function () {
			Page.init();
		});
	} else {
		alert('dd else:' + dd.version);
		Page.init();
	}
})();
