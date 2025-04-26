package com.zhenhai.programmer.enums;


public enum RoleEnum {

    USER(1,"Regular User"),

    ADMIN(2,"Administrator"),

    ;

    Integer code;

    String desc;

    RoleEnum(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }
}
