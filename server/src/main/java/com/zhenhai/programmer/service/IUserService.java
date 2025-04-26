package com.zhenhai.programmer.service;

import com.zhenhai.programmer.dto.PageDTO;
import com.zhenhai.programmer.dto.ResponseDTO;
import com.zhenhai.programmer.dto.UserDTO;


public interface IUserService {

    // Register user information
    ResponseDTO<Boolean> registerUser(UserDTO userDTO);

    // Frontend user login operation
    ResponseDTO<UserDTO> webLogin(UserDTO userDTO);

    // Backend user login operation
    ResponseDTO<UserDTO> adminLogin(UserDTO userDTO);

    // Check if user is logged in
    ResponseDTO<UserDTO> checkLogin(UserDTO userDTO);

    // Logout operation
    ResponseDTO<Boolean> logout(UserDTO userDTO);

    // Get paginated user data
    ResponseDTO<PageDTO<UserDTO>> getUserList(PageDTO<UserDTO> pageDTO);

    // Save user information
    ResponseDTO<Boolean> saveUser(UserDTO userDTO);

    // Delete user information
    ResponseDTO<Boolean> deleteUser(UserDTO userDTO);

    // Get user information by ID
    ResponseDTO<UserDTO> getUserById(UserDTO userDTO);

    // Update personal information
    ResponseDTO<UserDTO> updateUserInfo(UserDTO userDTO);

    // Get total number of users
    ResponseDTO<Integer> getUserTotal();

}
