package com.zhenhai.programmer.service;

import com.zhenhai.programmer.dto.AttentionDTO;
import com.zhenhai.programmer.dto.PageDTO;
import com.zhenhai.programmer.dto.ResponseDTO;

import java.util.List;


public interface IAttentionService {

    // Follow user operation
    ResponseDTO<Boolean> addAttention(AttentionDTO attentionDTO);

    // Unfollow user operation
    ResponseDTO<Boolean> removeAttention(AttentionDTO attentionDTO);

    // Check if following
    ResponseDTO<Boolean> judgeAttention(AttentionDTO attentionDTO);

    // Get paginated following and followers data
    ResponseDTO<PageDTO<AttentionDTO>> getAttentionList(PageDTO<AttentionDTO> pageDTO);

    // Get all following and followers data
    ResponseDTO<List<AttentionDTO>> getAllAttentionList(AttentionDTO attentionDTO);
}
