package com.zhenhai.programmer.controller.admin;

import com.zhenhai.programmer.dto.PageDTO;
import com.zhenhai.programmer.dto.ResponseDTO;
import com.zhenhai.programmer.dto.TagDTO;
import com.zhenhai.programmer.service.ITagService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;


@RestController("AdminTagController")
@RequestMapping("/admin/tag")
public class TagController {

    @Resource
    private ITagService tagService;

    /**
     * Get article tag data by pagination
     * @param pageDTO
     * @return
     */
    @PostMapping("/list")
    public ResponseDTO<PageDTO<TagDTO>> getTagList(@RequestBody PageDTO<TagDTO> pageDTO){
        return tagService.getTagList(pageDTO);
    }

    /**
     * Delete article tag information
     * @param tagDTO
     * @return
     */
    @PostMapping("/delete")
    public ResponseDTO<Boolean> deleteTag(@RequestBody TagDTO tagDTO){
        return tagService.deleteTag(tagDTO);
    }

    /**
     * Save article tag information
     * @param tagDTO
     * @return
     */
    @PostMapping("/save")
    public ResponseDTO<Boolean> saveTag(@RequestBody TagDTO tagDTO){
        return tagService.saveTag(tagDTO);
    }
}
