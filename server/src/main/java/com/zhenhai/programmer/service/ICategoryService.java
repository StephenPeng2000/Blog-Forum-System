package com.zhenhai.programmer.service;

import com.zhenhai.programmer.dto.CategoryDTO;
import com.zhenhai.programmer.dto.PageDTO;
import com.zhenhai.programmer.dto.ResponseDTO;

import java.util.List;


public interface ICategoryService {

    // Get paginated article category data
    ResponseDTO<PageDTO<CategoryDTO>> getCategoryList(PageDTO<CategoryDTO> pageDTO);

    // Save article category information
    ResponseDTO<Boolean> saveCategory(CategoryDTO categoryDTO);

    // Delete article category information
    ResponseDTO<Boolean> deleteCategory(CategoryDTO categoryDTO);

    // Get all article category data
    ResponseDTO<List<CategoryDTO>> getAllCategoryList();
}
