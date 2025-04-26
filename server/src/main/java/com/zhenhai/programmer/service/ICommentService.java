package com.zhenhai.programmer.service;

import com.zhenhai.programmer.dto.CommentDTO;
import com.zhenhai.programmer.dto.PageDTO;
import com.zhenhai.programmer.dto.ResponseDTO;


public interface ICommentService {

    // Submit comment information
    ResponseDTO<Boolean> submitComment(CommentDTO commentDTO);

    // Get paginated comment information
    ResponseDTO<PageDTO<CommentDTO>> getCommentList(PageDTO<CommentDTO> pageDTO);

    // Get paginated comment information for admin
    ResponseDTO<PageDTO<CommentDTO>> getCommentListByAdmin(PageDTO<CommentDTO> pageDTO);

    // Delete comment data
    ResponseDTO<Boolean> deleteComment(CommentDTO commentDTO);

    // Get total comments count by article
    ResponseDTO<Integer> countTotalComment(CommentDTO commentDTO);

    // Accept comment
    ResponseDTO<Boolean> pickComment(CommentDTO commentDTO);

    // Get total comments count
    ResponseDTO<Integer> getCommentTotal();
}
