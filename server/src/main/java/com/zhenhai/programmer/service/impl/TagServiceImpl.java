package com.zhenhai.programmer.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.zhenhai.programmer.bean.CodeMsg;
import com.zhenhai.programmer.dao.TagItemMapper;
import com.zhenhai.programmer.dao.TagMapper;
import com.zhenhai.programmer.domain.Tag;
import com.zhenhai.programmer.domain.TagExample;
import com.zhenhai.programmer.domain.TagItem;
import com.zhenhai.programmer.domain.TagItemExample;
import com.zhenhai.programmer.dto.PageDTO;
import com.zhenhai.programmer.dto.ResponseDTO;
import com.zhenhai.programmer.dto.TagDTO;
import com.zhenhai.programmer.dto.TagItemDTO;
import com.zhenhai.programmer.service.ITagService;
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
public class TagServiceImpl implements ITagService {

    @Resource
    private TagMapper tagMapper;

    @Resource
    private TagItemMapper tagItemMapper;

    /**
     * Get paginated article tag data
     * @param pageDTO
     * @return
     */
    @Override
    public ResponseDTO<PageDTO<TagDTO>> getTagList(PageDTO<TagDTO> pageDTO) {
        TagExample tagExample = new TagExample();
        // If current page is unknown, default to first page
        if(pageDTO.getPage() == null){
            pageDTO.setPage(1);
        }
        // If page size is unknown, default to 5 records per page
        if(pageDTO.getSize() == null){
            pageDTO.setSize(5);
        }
        TagExample.Criteria c1 = tagExample.createCriteria();
        if(pageDTO.getParam() != null) {
            TagDTO tagDTO = pageDTO.getParam();
            c1.andNameLike("%" + tagDTO.getName() + "%");
        }
        PageHelper.startPage(pageDTO.getPage(), pageDTO.getSize());
        // Get paginated article tag data
        List<Tag> tagList = tagMapper.selectByExample(tagExample);
        PageInfo<Tag> pageInfo = new PageInfo<>(tagList);
        // Get total number of records
        pageDTO.setTotal(pageInfo.getTotal());
        // Convert domain type data to DTO type data
        List<TagDTO> tagDTOList = CopyUtil.copyList(tagList, TagDTO.class);
        pageDTO.setList(tagDTOList);
        return ResponseDTO.success(pageDTO);
    }

    /**
     * Save article tag information
     * @param tagDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> saveTag(TagDTO tagDTO) {
        // Perform unified form validation
        CodeMsg validate = ValidateEntityUtil.validate(tagDTO);
        if (!validate.getCode().equals(CodeMsg.SUCCESS.getCode())) {
            return ResponseDTO.errorByMsg(validate);
        }
        Tag tag = CopyUtil.copy(tagDTO, Tag.class);
        if(CommonUtil.isEmpty(tag.getId())) {
            // Add operation
            // Check if article tag name exists
            if(isNameExist(tag, "")){
                return ResponseDTO.errorByMsg(CodeMsg.TAG_NAME_EXIST);
            }
            tag.setId(UuidUtil.getShortUuid());
            if(tagMapper.insertSelective(tag) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.TAG_ADD_ERROR);
            }
        } else {
            // Edit operation
            // Check if article tag name exists
            if(isNameExist(tag, tag.getId())){
                return ResponseDTO.errorByMsg(CodeMsg.TAG_NAME_EXIST);
            }
            if(tagMapper.updateByPrimaryKeySelective(tag) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.TAG_EDIT_ERROR);
            }
        }
        return ResponseDTO.successByMsg(true, "Article tag information saved successfully!");
    }

    /**
     * Delete article tag information
     * @param tagDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> deleteTag(TagDTO tagDTO) {
        if(CommonUtil.isEmpty(tagDTO.getId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        String[] ids = tagDTO.getId().split(",");
        for(String id : ids) {
            // Delete tag detail information
            TagItemExample tagItemExample = new TagItemExample();
            tagItemExample.createCriteria().andTagIdEqualTo(id);
            tagItemMapper.deleteByExample(tagItemExample);
            // Delete article tag information
            if(tagMapper.deleteByPrimaryKey(id) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.TAG_DELETE_ERROR);
            }
        }
        return ResponseDTO.successByMsg(true, "Article tag information deleted successfully!");
    }

    /**
     * Get all article tag data
     * @return
     */
    @Override
    public ResponseDTO<List<TagDTO>> getAllTagList() {
        TagExample tagExample = new TagExample();
        List<Tag> tagList = tagMapper.selectByExample(tagExample);
        List<TagDTO> tagDTOList = CopyUtil.copyList(tagList, TagDTO.class);
        return ResponseDTO.success(tagDTOList);
    }

    /**
     * Save tag detail information
     * @param tagItemDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> saveTagItem(TagItemDTO tagItemDTO) {
        if(CommonUtil.isEmpty(tagItemDTO.getArticleId())) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_NOT_EXIST);
        }
        if(tagItemDTO.getTagIdList() == null || tagItemDTO.getTagIdList().length == 0) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_TAG_EMPTY);
        }
        // First delete all tags of this article
        TagItemExample tagItemExample = new TagItemExample();
        tagItemExample.createCriteria().andArticleIdEqualTo(tagItemDTO.getArticleId());
        tagItemMapper.deleteByExample(tagItemExample);
        // Then save the latest article tags
        for(String tagId: tagItemDTO.getTagIdList()) {
            TagItem tagItem = new TagItem();
            tagItem.setId(UuidUtil.getShortUuid());
            tagItem.setArticleId(tagItemDTO.getArticleId());
            tagItem.setTagId(tagId);
            tagItemMapper.insertSelective(tagItem);
        }
        return ResponseDTO.successByMsg(true, "Tag detail information saved successfully!");
    }

    /**
     * Check if article tag name is duplicate
     * @param tag
     * @param id
     * @return
     */
    public Boolean isNameExist(Tag tag, String id) {
        TagExample tagExample = new TagExample();
        tagExample.createCriteria().andNameEqualTo(tag.getName());
        List<Tag> selectedTagList = tagMapper.selectByExample(tagExample);
        if(selectedTagList != null && selectedTagList.size() > 0) {
            if(selectedTagList.size() > 1){
                return true; // Duplicate name exists
            }
            if(!selectedTagList.get(0).getId().equals(id)) {
                return true; // Duplicate name exists
            }
        }
        return false; // No duplicate name
    }
}
