package com.zhenhai.programmer.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.zhenhai.programmer.bean.CodeMsg;
import com.zhenhai.programmer.dao.CategoryMapper;
import com.zhenhai.programmer.domain.Category;
import com.zhenhai.programmer.domain.CategoryExample;
import com.zhenhai.programmer.dto.CategoryDTO;
import com.zhenhai.programmer.dto.PageDTO;
import com.zhenhai.programmer.dto.ResponseDTO;
import com.zhenhai.programmer.service.ICategoryService;
import com.zhenhai.programmer.utils.CommonUtil;
import com.zhenhai.programmer.utils.CopyUtil;
import com.zhenhai.programmer.utils.UuidUtil;
import com.zhenhai.programmer.utils.ValidateEntityUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;


@Service
@Transactional
public class CategoryServiceImpl implements ICategoryService {

    @Resource
    private CategoryMapper categoryMapper;

    /**
     * Get paginated article category data
     * @param pageDTO
     * @return
     */
    @Override
    public ResponseDTO<PageDTO<CategoryDTO>> getCategoryList(PageDTO<CategoryDTO> pageDTO) {
        CategoryExample categoryExample = new CategoryExample();
        // If current page is unknown, default to first page
        if(pageDTO.getPage() == null){
            pageDTO.setPage(1);
        }
        // If page size is unknown, default to 5 records per page
        if(pageDTO.getSize() == null){
            pageDTO.setSize(5);
        }
        CategoryExample.Criteria c1 = categoryExample.createCriteria();
        if(pageDTO.getParam() != null) {
            CategoryDTO categoryDTO = pageDTO.getParam();
            c1.andNameLike("%" + categoryDTO.getName() + "%");
        }
        categoryExample.setOrderByClause("sort desc, id desc");
        PageHelper.startPage(pageDTO.getPage(), pageDTO.getSize());
        // Get paginated article category data
        List<Category> categoryList = categoryMapper.selectByExample(categoryExample);
        PageInfo<Category> pageInfo = new PageInfo<>(categoryList);
        // Get total number of records
        pageDTO.setTotal(pageInfo.getTotal());
        // Convert domain type data to DTO type data
        List<CategoryDTO> categoryDTOList = CopyUtil.copyList(categoryList, CategoryDTO.class);
        pageDTO.setList(categoryDTOList);
        return ResponseDTO.success(pageDTO);
    }

    /**
     * Save article category information
     * @param categoryDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> saveCategory(CategoryDTO categoryDTO) {
        // Perform unified form validation
        CodeMsg validate = ValidateEntityUtil.validate(categoryDTO);
        if (!validate.getCode().equals(CodeMsg.SUCCESS.getCode())) {
            return ResponseDTO.errorByMsg(validate);
        }
        Category category = CopyUtil.copy(categoryDTO, Category.class);
        if(CommonUtil.isEmpty(category.getId())) {
            // Add operation
            // Check if article category name exists
            if(isNameExist(category, "")){
                return ResponseDTO.errorByMsg(CodeMsg.CATEGORY_NAME_EXIST);
            }
            category.setId(UuidUtil.getShortUuid());
            if(categoryMapper.insertSelective(category) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.CATEGORY_ADD_ERROR);
            }
        } else {
            // Edit operation
            // Check if article category name exists
            if(isNameExist(category, category.getId())){
                return ResponseDTO.errorByMsg(CodeMsg.CATEGORY_NAME_EXIST);
            }
            if(categoryMapper.updateByPrimaryKeySelective(category) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.CATEGORY_EDIT_ERROR);
            }
        }
        return ResponseDTO.successByMsg(true, "Article category information saved successfully!");
    }

    /**
     * Delete article category information
     * @param categoryDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> deleteCategory(CategoryDTO categoryDTO) {
        if(CommonUtil.isEmpty(categoryDTO.getId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        String[] ids = categoryDTO.getId().split(",");
        for(String id : ids) {
            // Delete article category information
            if(categoryMapper.deleteByPrimaryKey(id) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.CATEGORY_DELETE_ERROR);
            }
        }
        return ResponseDTO.successByMsg(true, "Article category information deleted successfully!");
    }

    /**
     * Get all article category data
     * @return
     */
    @Override
    public ResponseDTO<List<CategoryDTO>> getAllCategoryList() {
        CategoryExample categoryExample = new CategoryExample();
        categoryExample.setOrderByClause("sort desc, id desc");
        List<Category> categoryList = categoryMapper.selectByExample(categoryExample);
        List<CategoryDTO> categoryDTOList = CopyUtil.copyList(categoryList, CategoryDTO.class);
        return ResponseDTO.success(categoryDTOList);
    }

    /**
     * Check if article category name is duplicate
     * @param category
     * @param id
     * @return
     */
    public Boolean isNameExist(Category category, String id) {
        CategoryExample categoryExample = new CategoryExample();
        categoryExample.createCriteria().andNameEqualTo(category.getName());
        List<Category> selectedCategoryList = categoryMapper.selectByExample(categoryExample);
        if(selectedCategoryList != null && selectedCategoryList.size() > 0) {
            if(selectedCategoryList.size() > 1){
                return true; // Duplicate name exists
            }
            if(!selectedCategoryList.get(0).getId().equals(id)) {
                return true; // Duplicate name exists
            }
        }
        return false; // No duplicate name
    }
}
