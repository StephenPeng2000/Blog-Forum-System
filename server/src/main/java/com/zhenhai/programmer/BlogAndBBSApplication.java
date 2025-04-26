package com.zhenhai.programmer;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Application Startup Class
 */
@SpringBootApplication
@MapperScan("com.zhenhai.programmer.dao")
public class BlogAndBBSApplication
{
    public static void main( String[] args )
    {
        SpringApplication.run(BlogAndBBSApplication.class, args);
    }
}
