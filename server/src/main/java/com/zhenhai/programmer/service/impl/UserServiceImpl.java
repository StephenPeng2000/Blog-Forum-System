package com.zhenhai.programmer.service.impl;

import com.alibaba.fastjson.JSON;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.zhenhai.programmer.bean.CodeMsg;
import com.zhenhai.programmer.dao.*;
import com.zhenhai.programmer.domain.*;
import com.zhenhai.programmer.dto.*;
import com.zhenhai.programmer.enums.RoleEnum;
import com.zhenhai.programmer.service.IArticleService;
import com.zhenhai.programmer.service.ICommentService;
import com.zhenhai.programmer.service.IUserService;
import com.zhenhai.programmer.utils.CommonUtil;
import com.zhenhai.programmer.utils.CopyUtil;
import com.zhenhai.programmer.utils.UuidUtil;
import com.zhenhai.programmer.utils.ValidateEntityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;


@Service
@Transactional
public class UserServiceImpl implements IUserService {

    @Resource
    private UserMapper userMapper;

    @Resource
    private ArticleMapper articleMapper;

    @Resource
    private IArticleService articleService;

    @Resource
    private LikeMapper likeMapper;

    @Resource
    private AttentionMapper attentionMapper;

    @Resource
    private CollectMapper collectMapper;

    @Resource
    private ICommentService commentService;

    @Resource
    private CommentMapper commentMapper;

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    /**
     * Register user information
     * @param userDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> registerUser(UserDTO userDTO) {
        // Perform unified form validation
        CodeMsg validate = ValidateEntityUtil.validate(userDTO);
        if (!validate.getCode().equals(CodeMsg.SUCCESS.getCode())) {
            return ResponseDTO.errorByMsg(validate);
        }
        User user = CopyUtil.copy(userDTO, User.class);
        // Check if username exists
        if(isNameExist(user, "")){
            return ResponseDTO.errorByMsg(CodeMsg.USERNAME_EXIST);
        }
        user.setId(UuidUtil.getShortUuid());
        user.setRoleId(RoleEnum.USER.getCode());
        user.setRegisterTime(new Date());
        if(userMapper.insertSelective(user) == 0) {
            return ResponseDTO.errorByMsg(CodeMsg.USER_REGISTER_ERROR);
        }
        return ResponseDTO.successByMsg(true, "Register user information successfully!");
    }

    /**
     * Front-end user login operation
     * @param userDTO
     * @return
     */
    @Override
    public ResponseDTO<UserDTO> webLogin(UserDTO userDTO) {
        // Check if empty
        if(CommonUtil.isEmpty(userDTO.getUsername())){
            return ResponseDTO.errorByMsg(CodeMsg.USERNAME_EMPTY);
        }
        if(CommonUtil.isEmpty(userDTO.getPassword())){
            return ResponseDTO.errorByMsg(CodeMsg.PASSWORD_EMPTY);
        }
        // Compare if username and password are correct
        UserExample userExample = new UserExample();
        userExample.createCriteria().andUsernameEqualTo(userDTO.getUsername()).andPasswordEqualTo(userDTO.getPassword());
        List<User> userList = userMapper.selectByExample(userExample);
        if(userList == null || userList.size() != 1){
            return ResponseDTO.errorByMsg(CodeMsg.USERNAME_PASSWORD_ERROR);
        }
        // Generate login token and store in Redis
        UserDTO selectedUserDto = CopyUtil.copy(userList.get(0), UserDTO.class);
        String token = UuidUtil.getShortUuid();
        selectedUserDto.setToken(token);
        // Store token in redis with 1 hour validity
        stringRedisTemplate.opsForValue().set("USER_" + token, JSON.toJSONString(selectedUserDto), 3600, TimeUnit.SECONDS);
        return ResponseDTO.successByMsg(selectedUserDto, "Login successful!");
    }

    /**
     * 后台用户登录操作
     * @param userDTO
     * @return
     */
    @Override
    public ResponseDTO<UserDTO> adminLogin(UserDTO userDTO) {
        // 进行是否为空判断
        if(CommonUtil.isEmpty(userDTO.getUsername())){
            return ResponseDTO.errorByMsg(CodeMsg.USERNAME_EMPTY);
        }
        if(CommonUtil.isEmpty(userDTO.getPassword())){
            return ResponseDTO.errorByMsg(CodeMsg.PASSWORD_EMPTY);
        }
        // 对比昵称和密码是否正确
        UserExample userExample = new UserExample();
        userExample.createCriteria().andUsernameEqualTo(userDTO.getUsername()).andPasswordEqualTo(userDTO.getPassword()).andRoleIdEqualTo(RoleEnum.ADMIN.getCode());
        List<User> userList = userMapper.selectByExample(userExample);
        if(userList == null || userList.size() != 1){
            return ResponseDTO.errorByMsg(CodeMsg.USERNAME_PASSWORD_ERROR);
        }
        // 生成登录token并存入Redis中
        UserDTO selectedUserDto = CopyUtil.copy(userList.get(0), UserDTO.class);
        String token = UuidUtil.getShortUuid();
        selectedUserDto.setToken(token);
        //把token存入redis中 有效期1小时
        stringRedisTemplate.opsForValue().set("USER_" + token, JSON.toJSONString(selectedUserDto), 3600, TimeUnit.SECONDS);
        return ResponseDTO.successByMsg(selectedUserDto, "登录成功！");
    }

    /**
     * 检查用户是否登录
     * @param userDTO
     * @return
     */
    @Override
    public ResponseDTO<UserDTO> checkLogin(UserDTO userDTO) {
        if(userDTO == null || CommonUtil.isEmpty(userDTO.getToken())){
            return ResponseDTO.errorByMsg(CodeMsg.USER_SESSION_EXPIRED);
        }
        ResponseDTO<UserDTO> responseDTO = getLoginUser(userDTO.getToken());
        if(responseDTO.getCode() != 0 ) {
            return responseDTO;
        }
        User user = userMapper.selectByPrimaryKey(responseDTO.getData().getId());
        if(user == null) {
            logout(userDTO);
            return ResponseDTO.errorByMsg(CodeMsg.USER_NOT_EXIST);
        }
        if(responseDTO.getCode() != 0){
            return responseDTO;
        }
        logger.info("获取到的登录信息={}", responseDTO.getData());
        return ResponseDTO.success(responseDTO.getData());
    }

    /**
     * 退出登录操作
     * @param userDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> logout(UserDTO userDTO) {
        if(!CommonUtil.isEmpty(userDTO.getToken())){
            // token不为空  清除redis中数据
            stringRedisTemplate.delete("USER_" + userDTO.getToken());
        }
        return ResponseDTO.successByMsg(true, "退出登录成功！");
    }

    /**
     * 分页获取用户数据
     * @param pageDTO
     * @return
     */
    @Override
    public ResponseDTO<PageDTO<UserDTO>> getUserList(PageDTO<UserDTO> pageDTO) {
        UserExample userExample = new UserExample();
        // 不知道当前页多少，默认为第一页
        if(pageDTO.getPage() == null){
            pageDTO.setPage(1);
        }
        // 不知道每页多少条记录，默认为每页5条记录
        if(pageDTO.getSize() == null){
            pageDTO.setSize(5);
        }
        UserExample.Criteria c1 = userExample.createCriteria();
        if(pageDTO.getParam() != null) {
            UserDTO userDTO = pageDTO.getParam();
            if(userDTO.getRoleId() != null && userDTO.getRoleId() != 0) {
                c1.andUsernameLike("%" + userDTO.getUsername() + "%").andRoleIdEqualTo(userDTO.getRoleId());
            } else {
                c1.andUsernameLike("%" + userDTO.getUsername() + "%");
            }
        }
        PageHelper.startPage(pageDTO.getPage(), pageDTO.getSize());
        // 分页查出用户数据
        List<User> userList = userMapper.selectByExample(userExample);
        PageInfo<User> pageInfo = new PageInfo<>(userList);
        // 获取数据的总数
        pageDTO.setTotal(pageInfo.getTotal());
        // 讲domain类型数据  转成 DTO类型数据
        List<UserDTO> userDTOList = CopyUtil.copyList(userList, UserDTO.class);
        pageDTO.setList(userDTOList);
        return ResponseDTO.success(pageDTO);
    }

    /**
     * 保存用户信息
     * @param userDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> saveUser(UserDTO userDTO) {
        // 进行统一表单验证
        CodeMsg validate = ValidateEntityUtil.validate(userDTO);
        if (!validate.getCode().equals(CodeMsg.SUCCESS.getCode())) {
            return ResponseDTO.errorByMsg(validate);
        }
        User user = CopyUtil.copy(userDTO, User.class);
        if(CommonUtil.isEmpty(user.getId())) {
            // 添加操作
            // 判断用户昵称是否存在
            if(isNameExist(user, "")){
                return ResponseDTO.errorByMsg(CodeMsg.USERNAME_EXIST);
            }
            user.setId(UuidUtil.getShortUuid());
            user.setRegisterTime(new Date());
            if(userMapper.insertSelective(user) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.USER_ADD_ERROR);
            }
        } else {
            // 修改操作
            // 判断用户昵称是否存在
            if(isNameExist(user, user.getId())){
                return ResponseDTO.errorByMsg(CodeMsg.USERNAME_EXIST);
            }
            ResponseDTO<UserDTO> loginUser = getLoginUser(userDTO.getToken());
            if(loginUser.getCode() != 0) {
                return ResponseDTO.errorByMsg(CodeMsg.USER_SESSION_EXPIRED);
            }
            if(userMapper.updateByPrimaryKeySelective(user) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.USER_EDIT_ERROR);
            }
            UserDTO loginUserDTO = loginUser.getData();
            if(user.getId().equals(loginUserDTO.getId())) {
                // 如果是修改个人信息  则更新redis中数据
                loginUserDTO = CopyUtil.copy(userMapper.selectByPrimaryKey(user.getId()), UserDTO.class);
                loginUserDTO.setToken(userDTO.getToken());
                stringRedisTemplate.opsForValue().set("USER_" + userDTO.getToken(), JSON.toJSONString(loginUserDTO), 3600, TimeUnit.SECONDS);
            }
        }
        return ResponseDTO.successByMsg(true, "保存用户信息成功！");
    }

    /**
     * 删除用户信息
     * @param userDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> deleteUser(UserDTO userDTO) {
        if(CommonUtil.isEmpty(userDTO.getId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        String[] ids = userDTO.getId().split(",");
        for(String id : ids) {
            // 删除该用户文章信息
            ArticleExample articleExample = new ArticleExample();
            articleExample.createCriteria().andUserIdEqualTo(id);
            List<Article> articleList = articleMapper.selectByExample(articleExample);
            for(Article article : articleList) {
                articleService.deleteArticle(CopyUtil.copy(article, ArticleDTO.class));
            }
            // 删除该用户的喜欢信息
            LikeExample likeExample = new LikeExample();
            likeExample.createCriteria().andUserIdEqualTo(id);
            likeMapper.deleteByExample(likeExample);
            // 删除该用户的收藏信息
            CollectExample collectExample = new CollectExample();
            collectExample.createCriteria().andUserIdEqualTo(id);
            collectMapper.deleteByExample(collectExample);
            // 删除该用户的评论信息
            CommentExample commentExample = new CommentExample();
            CommentExample.Criteria c1 = commentExample.createCriteria();
            CommentExample.Criteria c2 = commentExample.createCriteria();
            c1.andFromIdEqualTo(id);
            c2.andToIdEqualTo(id);
            commentExample.or(c2);
            List<Comment> commentList = commentMapper.selectByExample(commentExample);
            for(Comment comment : commentList) {
                commentService.deleteComment(CopyUtil.copy(comment, CommentDTO.class));
            }
            // 删除关注和粉丝信息
            AttentionExample attentionExample = new AttentionExample();
            AttentionExample.Criteria c3 = attentionExample.createCriteria();
            AttentionExample.Criteria c4 = attentionExample.createCriteria();
            c3.andFromIdEqualTo(id);
            c4.andToIdEqualTo(id);
            attentionExample.or(c4);
            attentionMapper.deleteByExample(attentionExample);
            // 删除用户信息
            if(userMapper.deleteByPrimaryKey(id) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.USER_DELETE_ERROR);
            }
        }
        return ResponseDTO.successByMsg(true, "删除用户信息成功！");
    }

    /**
     * 根据id获取用户信息
     * @param userDTO
     * @return
     */
    @Override
    public ResponseDTO<UserDTO> getUserById(UserDTO userDTO) {
        if(CommonUtil.isEmpty(userDTO.getId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        User user = userMapper.selectByPrimaryKey(userDTO.getId());
        if(user == null) {
            return ResponseDTO.errorByMsg(CodeMsg.USER_NOT_EXIST);
        }
        return ResponseDTO.success(CopyUtil.copy(user, UserDTO.class));
    }

    /**
     * 修改个人信息
     * @param userDTO
     * @return
     */
    @Override
    public ResponseDTO<UserDTO> updateUserInfo(UserDTO userDTO) {
        if(CommonUtil.isEmpty(userDTO.getId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        // 进行统一表单验证
        CodeMsg validate = ValidateEntityUtil.validate(userDTO);
        if (!validate.getCode().equals(CodeMsg.SUCCESS.getCode())) {
            return ResponseDTO.errorByMsg(validate);
        }
        User user = CopyUtil.copy(userDTO, User.class);
        // 判断用户昵称是否存在
        if(isNameExist(user, userDTO.getId())){
            return ResponseDTO.errorByMsg(CodeMsg.USERNAME_EXIST);
        }
        if(userMapper.updateByPrimaryKeySelective(user) == 0) {
            return ResponseDTO.errorByMsg(CodeMsg.USER_EDIT_ERROR);
        }
        User userDB = userMapper.selectByPrimaryKey(userDTO.getId());
        UserDTO userDBDTO = CopyUtil.copy(userDB, UserDTO.class);
        userDBDTO.setToken(userDTO.getToken());
        stringRedisTemplate.opsForValue().set("USER_" + userDBDTO.getToken(), JSON.toJSONString(userDBDTO), 3600, TimeUnit.SECONDS);
        return ResponseDTO.successByMsg(CopyUtil.copy(userDB, UserDTO.class), "修改个人信息成功！");
    }

    /**
     * 获取用户总数
     * @return
     */
    @Override
    public ResponseDTO<Integer> getUserTotal() {
        return ResponseDTO.success(userMapper.countByExample(new UserExample()));
    }

    /**
     * 获取当前登录用户
     * @return
     */
    public ResponseDTO<UserDTO> getLoginUser(String token){
        String value = stringRedisTemplate.opsForValue().get("USER_" + token);
        if(CommonUtil.isEmpty(value)){
            return ResponseDTO.errorByMsg(CodeMsg.USER_SESSION_EXPIRED);
        }
        UserDTO selectedUserDTO = JSON.parseObject(value, UserDTO.class);
        return ResponseDTO.success(selectedUserDTO);
    }

    /**
     * 判断用户昵称是否重复
     * @param user
     * @param id
     * @return
     */
    public Boolean isNameExist(User user, String id) {
        UserExample userExample = new UserExample();
        userExample.createCriteria().andUsernameEqualTo(user.getUsername());
        List<User> selectedUserList = userMapper.selectByExample(userExample);
        if(selectedUserList != null && selectedUserList.size() > 0) {
            if(selectedUserList.size() > 1){
                return true; //出现重名
            }
            if(!selectedUserList.get(0).getId().equals(id)) {
                return true; //出现重名
            }
        }
        return false;//没有重名
    }
}
