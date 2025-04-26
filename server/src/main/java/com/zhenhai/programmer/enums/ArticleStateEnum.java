package com.zhenhai.programmer.enums;


public enum  ArticleStateEnum {

    WAIT(1,"Pending Review"),

    NOT_SOLVE(2,"Unsolved"),

    SOLVE(3,"Solved"),

    SUCCESS(4,"Review Passed"),

    FAIL(5,"Review Failed"),

    DRAFT(6,"Draft"),

    ;

    Integer code;

    String desc;

    ArticleStateEnum(Integer code, String desc) {
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
