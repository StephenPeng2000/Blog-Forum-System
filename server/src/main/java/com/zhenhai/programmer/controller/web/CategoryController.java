package com.zhenhai.programmer.controller.web;

import com.zhenhai.programmer.dto.CategoryDTO;
import com.zhenhai.programmer.dto.ResponseDTO;
import com.zhenhai.programmer.service.ICategoryService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;


@RestController("WebCategoryController")
@RequestMapping("/web/category")
public class CategoryController {

    @Resource
    private ICategoryService categoryService;

    /**
     * Query all article category data
     * @return
     */
    @PostMapping("/all")
    public ResponseDTO<List<CategoryDTO>> getAllCategoryList(){
        return categoryService.getAllCategoryList();
    }

}
