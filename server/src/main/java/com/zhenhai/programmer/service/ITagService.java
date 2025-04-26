package com.zhenhai.programmer.service;

import com.zhenhai.programmer.dto.PageDTO;
import com.zhenhai.programmer.dto.ResponseDTO;
import com.zhenhai.programmer.dto.TagDTO;
import com.zhenhai.programmer.dto.TagItemDTO;

import java.util.List;


public interface ITagService {

    // Get paginated article tag data
    ResponseDTO<PageDTO<TagDTO>> getTagList(PageDTO<TagDTO> pageDTO);

    // Save article tag information
    ResponseDTO<Boolean> saveTag(TagDTO tagDTO);

    // Delete article tag information
    ResponseDTO<Boolean> deleteTag(TagDTO tagDTO);

    // Get all article tag data
    ResponseDTO<List<TagDTO>> getAllTagList();

    // Save tag detail information
    ResponseDTO<Boolean> saveTagItem(TagItemDTO tagItemDTO);
}
