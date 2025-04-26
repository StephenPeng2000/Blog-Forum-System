package com.zhenhai.programmer.bean;


/**
 * Unified error code handling class, all error codes are defined here
 */
public class CodeMsg {

    private Integer code;//Error code

    private String msg;//Error message

    /**
     * Private constructor for singleton pattern
     * This class is responsible for creating its own object while ensuring only a single object is created.
     * It provides a way to access its unique object directly without instantiating the class object.
     * @param code
     * @param msg
     */
    private CodeMsg(Integer code, String msg){
        this.code = code;
        this.msg = msg;
    }

    public CodeMsg() {

    }

    public Integer getCode() {
        return code;
    }



    public void setCode(Integer code) {
        this.code = code;
    }



    public String getMsg() {
        return msg;
    }



    public void setMsg(String msg) {
        this.msg = msg;
    }

    //Common error code definitions
    //Success message code
    public static CodeMsg SUCCESS = new CodeMsg(0, "success");
    //Common data error codes
    public static CodeMsg DATA_ERROR = new CodeMsg(-1, "Invalid data!");
    public static CodeMsg VALIDATE_ENTITY_ERROR = new CodeMsg(-2, "");
    public static CodeMsg CAPTCHA_EMPTY = new CodeMsg(-3, "Verification code cannot be empty!");
    public static CodeMsg NO_PERMISSION = new CodeMsg(-4, "You don't have permission for this operation!");
    public static CodeMsg CAPTCHA_ERROR = new CodeMsg(-5, "Verification code error!");
    public static CodeMsg USER_SESSION_EXPIRED = new CodeMsg(-6, "Not logged in or session expired, please login again!");
    public static CodeMsg UPLOAD_PHOTO_SUFFIX_ERROR = new CodeMsg(-7, "Image format is incorrect!");
    public static CodeMsg PHOTO_SURPASS_MAX_SIZE = new CodeMsg(-8, "Uploaded image cannot exceed 2MB!");
    public static CodeMsg PHOTO_FORMAT_NOT_CORRECT = new CodeMsg(-9, "Uploaded image format is incorrect!");
    public static CodeMsg SAVE_FILE_EXCEPTION = new CodeMsg(-10, "File save exception!");
    public static CodeMsg FILE_EXPORT_ERROR = new CodeMsg(-11, "File export failed!");
    public static CodeMsg SYSTEM_ERROR = new CodeMsg(-12, "System error occurred, please contact administrator!");
    public static CodeMsg NO_AUTHORITY = new CodeMsg(-13, "Sorry, you don't have permission to operate!");
    public static CodeMsg CAPTCHA_EXPIRED = new CodeMsg(-14, "Verification code expired, please refresh!");
    public static CodeMsg COMMON_ERROR = new CodeMsg(-15, "");
    public static CodeMsg PHOTO_EMPTY = new CodeMsg(-16, "Uploaded image cannot be empty!");


    //User management error codes
    public static CodeMsg USER_ADD_ERROR = new CodeMsg(-1000, "Failed to add user information, please contact administrator!");
    public static CodeMsg USER_NOT_EXIST  = new CodeMsg(-1001, "This user does not exist!");
    public static CodeMsg USER_EDIT_ERROR = new CodeMsg(-1002, "Failed to edit user information, please contact administrator!");
    public static CodeMsg USER_DELETE_ERROR = new CodeMsg(-1003, "Failed to delete user information, please contact administrator!");
    public static CodeMsg USERNAME_EXIST = new CodeMsg(-1004, "Username already exists, please choose another!");
    public static CodeMsg USERNAME_EMPTY = new CodeMsg(-1005, "Username cannot be empty!");
    public static CodeMsg PASSWORD_EMPTY = new CodeMsg(-1006, "Password cannot be empty!");
    public static CodeMsg USERNAME_PASSWORD_ERROR = new CodeMsg(-1007, "Username or password error!");
    public static CodeMsg REPASSWORD_EMPTY = new CodeMsg(-1008, "Confirm password cannot be empty!");
    public static CodeMsg REPASSWORD_ERROR = new CodeMsg(-1009, "Confirm password does not match!");
    public static CodeMsg USER_REGISTER_ERROR = new CodeMsg(-1010, "Failed to register user, please contact administrator!");
    public static CodeMsg USER_NOT_IS_ADMIN = new CodeMsg(-1011, "Only admin role can login to backend system!");

    // Article category management error codes
    public static CodeMsg CATEGORY_NAME_EXIST = new CodeMsg(-2000, "Category name already exists, please choose another!");
    public static CodeMsg CATEGORY_ADD_ERROR = new CodeMsg(-2001, "Failed to add category, please contact administrator!");
    public static CodeMsg CATEGORY_NOT_EXIST  = new CodeMsg(-2002, "This category does not exist!");
    public static CodeMsg CATEGORY_EDIT_ERROR = new CodeMsg(-2003, "Failed to edit category, please contact administrator!");
    public static CodeMsg CATEGORY_DELETE_ERROR = new CodeMsg(-2004, "Failed to delete category, please contact administrator!");

    // Article tag management error codes
    public static CodeMsg TAG_NAME_EXIST = new CodeMsg(-3000, "Tag name already exists, please choose another!");
    public static CodeMsg TAG_ADD_ERROR = new CodeMsg(-3001, "Failed to add tag, please contact administrator!");
    public static CodeMsg TAG_NOT_EXIST  = new CodeMsg(-3002, "This tag does not exist!");
    public static CodeMsg TAG_EDIT_ERROR = new CodeMsg(-3003, "Failed to edit tag, please contact administrator!");
    public static CodeMsg TAG_DELETE_ERROR = new CodeMsg(-3004, "Failed to delete tag, please contact administrator!");

    // Article management error codes
    public static CodeMsg ARTICLE_ADD_ERROR = new CodeMsg(-4000, "Failed to add article, please contact administrator!");
    public static CodeMsg ARTICLE_NOT_EXIST  = new CodeMsg(-4001, "This article does not exist!");
    public static CodeMsg ARTICLE_EDIT_ERROR = new CodeMsg(-4002, "Failed to edit article, please contact administrator!");
    public static CodeMsg ARTICLE_DELETE_ERROR = new CodeMsg(-4003, "Failed to delete article, please contact administrator!");
    public static CodeMsg ARTICLE_TAG_EMPTY = new CodeMsg(-4004, "Article tags cannot be empty!");
    public static CodeMsg ARTICLE_TAG_OVER = new CodeMsg(-4005, "Article cannot have more than 3 tags!");

    // Comment management error codes
    public static CodeMsg COMMENT_SUBMIT_ERROR = new CodeMsg(-5000, "Failed to submit comment, please contact administrator!");
    public static CodeMsg COMMENT_DELETE_ERROR = new CodeMsg(-5001, "Failed to delete comment, please contact administrator!");
    public static CodeMsg COMMENT_NOT_EXIST = new CodeMsg(-5002, "This comment does not exist!");
    public static CodeMsg COMMENT_PICK_ERROR = new CodeMsg(-5003, "Failed to accept comment, please contact administrator!");

    // Like management error codes
    public static CodeMsg LIKE_ERROR = new CodeMsg(-6000, "Failed to like, please contact administrator!");
    public static CodeMsg UNLIKE_ERROR = new CodeMsg(-6001, "Failed to unlike, please contact administrator!");

    // Collection management error codes
    public static CodeMsg COLLECT_ADD_ERROR = new CodeMsg(-7000, "Failed to collect, please contact administrator!");
    public static CodeMsg COLLECT_REMOVE_ERROR = new CodeMsg(-7001, "Failed to remove collection, please contact administrator!");

    // Follow management error codes
    public static CodeMsg ATTENTION_ADD_ERROR = new CodeMsg(-8000, "Failed to follow, please contact administrator!");
    public static CodeMsg ATTENTION_REMOVE_ERROR = new CodeMsg(-8001, "Failed to unfollow, please contact administrator!");
    public static CodeMsg ATTENTION_AGAIN_ERROR = new CodeMsg(-8002, "Please do not follow repeatedly!");
    public static CodeMsg ATTENTION_SELF_ERROR = new CodeMsg(-8003, "You cannot follow yourself!");
}
