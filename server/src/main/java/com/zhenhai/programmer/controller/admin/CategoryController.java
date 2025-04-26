package com.zhenhai.programmer.controller.admin;

import com.zhenhai.programmer.dto.CategoryDTO;
import com.zhenhai.programmer.dto.PageDTO;
import com.zhenhai.programmer.dto.ResponseDTO;
import com.zhenhai.programmer.service.ICategoryService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;


@RestController("AdminCategoryController")
@RequestMapping("/admin/category")
public class CategoryController {

    @Resource
    private ICategoryService categoryService;

    /**
     * Get article category data by pagination
     * @param pageDTO
     * @return
     */
    @PostMapping("/list")
    public ResponseDTO<PageDTO<CategoryDTO>> getCategoryList(@RequestBody PageDTO<CategoryDTO> pageDTO){
        return categoryService.getCategoryList(pageDTO);
    }

    /**
     * Delete article category information
     * @param categoryDTO
     * @return
     */
    @PostMapping("/delete")
    public ResponseDTO<Boolean> deleteCategory(@RequestBody CategoryDTO categoryDTO){
        return categoryService.deleteCategory(categoryDTO);
    }

    /**
     * Save article category information
     * @param categoryDTO
     * @return
     */
    @PostMapping("/save")
    public ResponseDTO<Boolean> saveCategory(@RequestBody CategoryDTO categoryDTO){
        return categoryService.saveCategory(categoryDTO);
    }

}
