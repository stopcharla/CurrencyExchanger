const HttpStatus = require('http-status');

class BaseController {

	constructor(){
	}

	getSuccessResponse(message){
		return { status: { isError: false, code: HttpStatus.OK, message: 'success' }, body: message };
	}

	getCreatedResponse(message,res){
		return { status: { isError: false, code: HttpStatus.CREATED, message: message }, body: res };
	}

	getErrorResponse(error){
		return { status: { isError: true, code: HttpStatus.INTERNAL_SERVER_ERROR, message: error } };
	}

	getBadRequestResponse(error){
		return { status: { isError: true, code: HttpStatus.BAD_REQUEST, message: error } };
	}
}

module.exports = BaseController;

