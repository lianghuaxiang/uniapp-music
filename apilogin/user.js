import {request} from '@/utils/loginrequest.js';
export const users =(options)=>{
	return request({
		url:'/list',
		method:'GET',
		data:options
	})
}