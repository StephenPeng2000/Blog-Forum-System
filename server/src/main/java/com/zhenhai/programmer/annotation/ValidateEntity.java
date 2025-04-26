package com.zhenhai.programmer.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;


/**
 * Custom annotation class for entity validation, used to check if entity fields are within specified values
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)  //Persist during runtime
public @interface ValidateEntity {
    public boolean required() default false;//Check if null

    public boolean requiredMaxLength() default false;//Check maximum length

    public boolean requiredMinLength() default false;//Check minimum length

    public boolean requiredMaxValue() default false;//Check maximum value

    public boolean requiredMinValue() default false;//Check minimum value




    public int maxLength() default -1;//Maximum length

    public int minLength() default -1;//Minimum length

    public double maxValue() default -1;//Maximum value

    public double minValue() default -1;//Minimum value




    public String errorRequiredMsg() default "";//Error message when value is null

    public String errorMinLengthMsg() default "";//Error message when minimum length is not met

    public String errorMaxLengthMsg() default "";//Error message when maximum length is not met

    public String errorMinValueMsg() default "";//Error message when minimum value is not met

    public String errorMaxValueMsg() default "";//Error message when maximum value is not met
}
