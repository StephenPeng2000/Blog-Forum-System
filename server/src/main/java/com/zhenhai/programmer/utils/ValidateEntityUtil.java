package com.zhenhai.programmer.utils;


import com.zhenhai.programmer.annotation.ValidateEntity;
import com.zhenhai.programmer.bean.CodeMsg;

import java.lang.reflect.Field;
import java.math.BigDecimal;


/**
 * Entity validation utility class
 */
public class ValidateEntityUtil {
    public static CodeMsg validate(Object object){
        Field[] declaredFields = object.getClass().getDeclaredFields();  // Get all fields in the object (excluding parent fields)
        // Iterate over all fields
        for(Field field : declaredFields){
            ValidateEntity annotation = field.getAnnotation(ValidateEntity.class);   // Get ValidateEntity annotation on the field
            field.setAccessible(true);    // Allows access to private variables using reflection
            if(annotation != null){
                if(annotation.required()){
                    // Indicates that the field is required
                    try {
                        Object o = field.get(object);   // Retrieve the value of each field
                        // First check if it is null
                        if(o == null){
                            CodeMsg codeMsg = CodeMsg.VALIDATE_ENTITY_ERROR;
                            codeMsg.setMsg(annotation.errorRequiredMsg());
                            return codeMsg;
                        }
                    } catch (IllegalArgumentException e) {
                        e.printStackTrace();
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    }
                }
                // If not a required field, also check user input
                try {
                    Object o = field.get(object);   // Retrieve the value of each field
                    // First check if it is a String type
                    CodeMsg stringResult = confirmStringLength(o, annotation);
                    if(stringResult.getCode().intValue() != 0) {
                        return stringResult;
                    }
                    // Then check if it is a number
                    CodeMsg numberResult = confirmNumberValue(o, annotation);
                    if(numberResult.getCode().intValue() != 0) {
                        return numberResult;
                    }
                } catch (IllegalArgumentException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }
        return CodeMsg.SUCCESS;
    }

    // If the field is a string type, check the string length
    public static CodeMsg confirmStringLength(Object o, ValidateEntity annotation) {
        // If o=null, the following If will not be executed
        if(o instanceof String){
            // If it is a string type, check its length
            if(annotation.requiredMinLength()){
                if(o.toString().trim().length() < annotation.minLength()){
                    CodeMsg codeMsg = CodeMsg.VALIDATE_ENTITY_ERROR;
                    codeMsg.setMsg(annotation.errorMinLengthMsg());
                    return codeMsg;
                }
            }
            if(annotation.requiredMaxLength())
            {
                if(o.toString().trim().length() > annotation.maxLength()){
                    CodeMsg codeMsg = CodeMsg.VALIDATE_ENTITY_ERROR;
                    codeMsg.setMsg(annotation.errorMaxLengthMsg());
                    return codeMsg;
                }
            }
        }
        return CodeMsg.SUCCESS;
    }

    // If the field is a numeric type, check if its maximum and minimum values are met
    public static CodeMsg confirmNumberValue(Object o, ValidateEntity annotation) {
        // If o=null, the following If will not be executed
        if(isNumberObject(o)){
            // Check if minimum value is specified
            if(annotation.requiredMinValue()){
                if(Double.valueOf(o.toString().trim()) < annotation.minValue()){
                    CodeMsg codeMsg = CodeMsg.VALIDATE_ENTITY_ERROR;
                    codeMsg.setMsg(annotation.errorMinValueMsg());
                    return codeMsg;
                }
            }
            // Check if maximum value is specified
            if(annotation.requiredMaxValue()){
                if(Double.valueOf(o.toString().trim()) > annotation.maxValue()){
                    CodeMsg codeMsg = CodeMsg.VALIDATE_ENTITY_ERROR;
                    codeMsg.setMsg(annotation.errorMaxValueMsg());
                    return codeMsg;
                }
            }
        }else if(isBigDecimalObject(o)) {
            // Check if minimum value is specified
            BigDecimal inputValue = new BigDecimal(o.toString().trim()); // User input value, this declaration method ensures precision
            if(annotation.requiredMinValue()){
                BigDecimal minValue = BigDecimal.valueOf(annotation.minValue()); // This declaration method ensures precision
                if(inputValue.compareTo(minValue) == -1){
                    CodeMsg codeMsg = CodeMsg.VALIDATE_ENTITY_ERROR;
                    codeMsg.setMsg(annotation.errorMinValueMsg());
                    return codeMsg;
                }
            }
            // Check if maximum value is specified
            if(annotation.requiredMaxValue()){
                BigDecimal maxValue = BigDecimal.valueOf(annotation.maxValue()); // This declaration method ensures precision
                if(inputValue.compareTo(maxValue) == 1){
                    CodeMsg codeMsg = CodeMsg.VALIDATE_ENTITY_ERROR;
                    codeMsg.setMsg(annotation.errorMaxValueMsg());
                    return codeMsg;
                }
            }
        }

        return CodeMsg.SUCCESS;
    }



    /**
     * Check if the object is a numeric type
     * @param object
     * @return
     */
    public static boolean isNumberObject(Object object){
        if(object instanceof Integer)return true;
        if(object instanceof Long)return true;
        if(object instanceof Float)return true;
        if(object instanceof Double)return true;
        return false;
    }

    /**
     * Check if the object is a BigDecimal type
     * @param object
     * @return
     */
    public static boolean isBigDecimalObject(Object object){
        if(object instanceof BigDecimal)return true;
        return false;
    }
}
