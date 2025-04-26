package com.zhenhai.programmer.controller.web;

import com.zhenhai.programmer.dto.CommentDTO;
import com.zhenhai.programmer.dto.PageDTO;
import com.zhenhai.programmer.dto.ResponseDTO;
import com.zhenhai.programmer.service.ICommentService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;


@RestController("WebCommentController")
@RequestMapping("/web/comment")
public class CommentController {

    @Resource
    private ICommentService commentService;

    /**
     * Submit comment information
     * @param commentDTO
     * @return
     */
    @PostMapping("/submit")
    public ResponseDTO<Boolean> submitComment(@RequestBody CommentDTO commentDTO){
        return commentService.submitComment(commentDTO);
    }

    /**
     * Accept comment
     * @param commentDTO
     * @return
     */
    @PostMapping("/pick")
    public ResponseDTO<Boolean> pickComment(@RequestBody CommentDTO commentDTO){
        return commentService.pickComment(commentDTO);
    }

    /**
     * Get comment information by pagination
     * @param pageDTO
     * @return
     */
    @PostMapping("/list")
    public ResponseDTO<PageDTO<CommentDTO>> getCommentList(@RequestBody PageDTO<CommentDTO> pageDTO){
        return commentService.getCommentList(pageDTO);
    }

    /**
     * Delete comment data
     * @param commentDTO
     * @return
     */
    @PostMapping("/delete")
    public ResponseDTO<Boolean> deleteComment(@RequestBody CommentDTO commentDTO){
        return commentService.deleteComment(commentDTO);
    }

    /**
     * Get total number of comments by article
     * @param commentDTO
     * @return
     */
    @PostMapping("/total")
    public ResponseDTO<Integer> countTotalComment(@RequestBody CommentDTO commentDTO){
        return commentService.countTotalComment(commentDTO);
    }


}
