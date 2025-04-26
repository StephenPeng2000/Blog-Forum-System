package com.zhenhai.programmer.interceptor;

import com.alibaba.fastjson.JSON;
import com.zhenhai.programmer.bean.CodeMsg;
import com.zhenhai.programmer.dao.UserMapper;
import com.zhenhai.programmer.dto.ResponseDTO;
import com.zhenhai.programmer.dto.UserDTO;
import com.zhenhai.programmer.service.IUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


/**
 * Login Interceptor
 *
 */
@Component
public class LoginInterceptor implements HandlerInterceptor {

	private Logger log = LoggerFactory.getLogger(LoginInterceptor.class);

	@Resource
	private IUserService userService;

	@Resource
	private UserMapper userMapper;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler){
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Headers", "*");
		response.setContentType("application/json; charset=utf-8");
		String method = request.getMethod();
		if("OPTIONS".equalsIgnoreCase(method)) {
			// If it's an OPTIONS test request, return test success directly
			try {
				// JSON.parseObject converts Json string to corresponding object; JSON.toJSONString converts object to Json string
				response.getWriter().print(JSON.toJSONString(ResponseDTO.success(true)));
				return false;
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		String token = request.getHeader("token");
		log.info("Received token={}", token);
		UserDTO userDTO = new UserDTO();
		userDTO.setToken(token);
		ResponseDTO<UserDTO> responseDTO = userService.checkLogin(userDTO);
		if(responseDTO.getCode() != 0) {
			try {
				// JSON.parseObject converts Json string to corresponding object; JSON.toJSONString converts object to Json string
				response.getWriter().print(JSON.toJSONString(ResponseDTO.errorByMsg(CodeMsg.USER_SESSION_EXPIRED)));
				return false;
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return true;
	}
}
