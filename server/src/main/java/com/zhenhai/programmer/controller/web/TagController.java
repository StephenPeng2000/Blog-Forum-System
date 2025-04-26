package com.zhenhai.programmer.controller.web;

import com.zhenhai.programmer.dto.ResponseDTO;
import com.zhenhai.programmer.dto.TagDTO;
import com.zhenhai.programmer.service.ITagService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;


@RestController("WebTagController")
@RequestMapping("/web/tag")
public class TagController {

    @Resource
    private ITagService tagService;

    /**
     * Query all article tag data
     * @return
     */
    @PostMapping("/all")
    public ResponseDTO<List<TagDTO>> getAllTagList(){
        return tagService.getAllTagList();
    }

}
