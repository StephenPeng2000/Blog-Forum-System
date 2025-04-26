package com.zhenhai.programmer.dao.my;

import org.apache.ibatis.annotations.Param;

import java.util.Map;


public interface MyArticleMapper {

    // Get article count by date range
    Integer getArticleTotalByDate(@Param("queryMap") Map<String, Object> queryMap);
}
