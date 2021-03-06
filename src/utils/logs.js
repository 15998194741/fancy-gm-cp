const log4js = require('log4js');
const logsConfig = require('../lib/logs.js');
//加载配置文件
log4js.configure(logsConfig);
//调用预先定义的日志名称
const resLogger = log4js.getLogger('resLogger');
const errorLogger = log4js.getLogger('errorLogger');
const consoleLogger = log4js.getLogger('resLogger');
const debugLogger = log4js.getLogger('debugLogger');

// 格式化日志文本 加上日志头尾和换行方便查看 ==>  普通日志、请求日志、响应日志、操作日志、错误日志
const formatText = {
	obj: function(info) {
		let logText = '';
		//响应日志头信息
		logText += '\n' + '*************** log start ***************' + '\n';
		//响应内容
		logText += '日志记录：' + JSON.stringify(info) + '\n';
		//响应日志结束信息
		logText += '*************** log end ***************' + '\n';
		return logText;
	},
	request: function(req, resTime) {
		let logText = '';
		const method = req.method;
		//访问方法
		logText += 'request method: ' + method + '\n';
		//请求原始地址
		logText += 'request originalUrl:  ' + req.originalUrl + '\n';
		//客户端ip
		logText += 'request client ip:  ' + req.ip + '\n';
		//开始时间
		let startTime;
		//请求参数
		if (method === 'GET') {
			logText += 'request query:  ' + JSON.stringify(req.query) + '\n';
			// startTime = req.query.requestStartTime;
		} else {
			logText += 'request body: ' + '\n' + JSON.stringify(req.body) + '\n';
			// startTime = req.body.requestStartTime;
		}
		//服务器响应时间
		logText += 'response time: ' + resTime + '\n';
		return logText;
	},
	response: function(ctx, resTime, log) {
		let logText = '';
		//响应日志开始
		logText += '\n' + '*************** response log start ***************' + '\n';
		//添加请求日志
		logText += formatText.request(ctx.request, resTime);
		// 具体参数
		logText += 'system logs:' + JSON.stringify(log) + '\n';
		//响应内容
		logText += 'response body: ' + '\n' + JSON.stringify(ctx.body) + '\n';
		//响应日志结束
		logText += '*************** response log end ***************' + '\n';
		return logText;
	},
	error: function(ctx, err, resTime) {
		let logText = '';
		//错误信息开始
		logText += '\n' + '*************** error log start ***************' + '\n';
		//添加请求日志
		logText += formatText.request(ctx.request, resTime);
		//错误名称
		logText += 'err name: ' + err.name + '\n';
		//错误信息
		logText += 'err message: ' + err.message + '\n';
		//错误详情
		logText += 'err stack: ' + err.stack + '\n';
		//错误信息结束
		logText += '*************** error log end ***************' + '\n';
		return logText;
	}
};

module.exports = {
	//封装普通日志
	info: function(info) {
		if (info && typeof info === 'object') {
			consoleLogger.info(formatText.obj(info));
		} else if (info && typeof info === 'string') {
			consoleLogger.info(info);
		}
	},
	//封装响应日志
	response: function(ctx, resTime, log) {
		if (ctx) {
			resLogger.info(formatText.response(ctx, resTime, log));
		}
	},
	//封装错误日志
	error: function(ctx, error, resTime) {
		if (ctx && error) {
			errorLogger.error(formatText.error(ctx, error, resTime));
		}
	},
	//封装调试日志
	debug: function(log) {
		debugLogger.debug(log);
	}
};
