package com.zhenhai.programmer.enums;


public enum ArticleQueryTypeEnum {

    ALL(1,"All Articles"),

    BLOG(2,"Blog Articles"),

    FORUM(3,"Q&A Articles"),

    LIKE(4,"Liked Articles"),

    COLLECT(5,"Collected Articles"),

    ;

    Integer code;

    String desc;

    ArticleQueryTypeEnum(Integer code, String desc) {
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
