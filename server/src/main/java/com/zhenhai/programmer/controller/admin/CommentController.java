package com.zhenhai.programmer.controller.admin;

import com.zhenhai.programmer.dto.CommentDTO;
import com.zhenhai.programmer.dto.PageDTO;
import com.zhenhai.programmer.dto.ResponseDTO;
import com.zhenhai.programmer.service.ICommentService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;


@RestController("AdminCommentController")
@RequestMapping("/admin/comment")
public class CommentController {

    @Resource
    private ICommentService commentService;

    /**
     * Get comment data by pagination
     * @param pageDTO
     * @return
     */
    @PostMapping("/list")
    public ResponseDTO<PageDTO<CommentDTO>> getCommentList(@RequestBody PageDTO<CommentDTO> pageDTO){
        return commentService.getCommentListByAdmin(pageDTO);
    }

    /**
     * Delete comment information
     * @param commentDTO
     * @return
     */
    @PostMapping("/delete")
    public ResponseDTO<Boolean> deleteComment(@RequestBody CommentDTO commentDTO){
        return commentService.deleteComment(commentDTO);
    }

    /**
     * Get total number of comments
     * @return
     */
    @PostMapping("/total")
    public ResponseDTO<Integer> getCommentTotal(){
        return commentService.getCommentTotal();
    }
}
