;(function($){
	var Tab = function(tab){
		var _this_ = this;//Tab类自身保存一下，防止在其他地方用全局的this出现漂移
		// 保存单个tab组件
	    this.tab =  tab; 
		// 默认配置参数
		this.config = {
			//鼠标触发类型:click/mouseover
			"triggerType" : "mouseover;",
			//内容切换效果：直接切换、淡入淡出	
			"effect" : "default",
			//默认展示第几个tab	
			"invoke" : 0,	
			//tab是否自动切换/指定时间
			"auto" : false	
		};
		// 如果默认参数存在，就扩展下
		if (this.getConfig()) {
			$.extend(this.config, this.getConfig());	
		}
		// 保存对应的tab标签列表，对应的content列表
		this.tabItems     = this.tab.find('ul.tab-nav li');
		this.contentItems = this.tab.find('div.content-wrap div.content-item');
		// 保存一下配置参数
		var config = this.config;
		if (config.triggerType === 'click'){
			this.tabItems.bind(config.triggerType, function() {
				_this_.invoke($(this));
			});
		} else if (config.triggerType === 'mouseover' || config.triggerType != 'click'){
			this.tabItems.mouseover(function() {
				var self = $(this);
				this.timer = window.setTimeout(function(){
					_this_.invoke(self);	
				},300);
				
			}).mouseout(function() {
				window.clearTimeout(this.timer);
			});
			// this.tabItems.mouseout(function() {
			// 	window.clearTimeout(this.timer);
			// });
		}
		if (config.auto) {
			// 全局定时器
			this.timer = null;
			// 计数器
			this.loop = 0;
			this.autoPlay();
			this.tab.hover(function () {
				window.clearInterval(_this_.timer);			
			},function () {
				_this_.autoPlay();
			});
		}  
		//默认显示第几个tab
		if (config.invoke >1) {
			this.invoke(this.tabItems.eq(config.invoke-1));
		}
	};
	Tab.prototype = {
		// 自动切换
		autoPlay:function(){
			var _this_ = this,
				tabItems = this.tabItems,//临时保存tab列表
				lenght = tabItems.size(),//tab的个数
				config = this.config;
			this.timer = window.setInterval(function () {
				_this_.loop++;
				if (_this_.loop > lenght) {
					_this_.loop = 0;
					// clearInterval();
				}
				tabItems.eq(_this_.loop).trigger(config.triggerType);
			},1000);
		},
		// 事件驱动函数
		/*
			要执行tab的选中状态
			当选中的加上actived（标记为白底）
			切换对应的tab内容，要根据配置参数effect是default还是fade
		 */
		invoke:function(currentTab){
			// var _this_ = this;
			// 保存索引值
			var index = currentTab.index();
			currentTab.addClass('actived').siblings().removeClass('actived');
			// 判断切换的形式 & 切换效果
			var effect = this.config.effect;
			var content = this.contentItems;
			// console.log(content[0]);
			if (effect ==='default') {
				content.eq(index).addClass('current').siblings().removeClass('current');
				
			} else if (effect ==='fade' || effect !='default') {
				content.eq(index).fadeIn().siblings().fadeOut();
			}
			// 注意：如果设置了自动切换，需要把loop的值设置成tab的index
			if (this.config.auto) {
				this.loop = index;
			}
		},
		// 获取配置参数
		getConfig:function(){
			// 获取tab的elem节点的data-config
			var config = this.tab.attr("data-config");
			if (config && config!='') {
				return $.parseJSON(config);
			}else{
				return null;
			}
		}

	};
	window.Tab = Tab;
})(jQuery);
