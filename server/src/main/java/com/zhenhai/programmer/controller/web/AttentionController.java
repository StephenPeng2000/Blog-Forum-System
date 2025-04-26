package com.zhenhai.programmer.controller.web;

import com.zhenhai.programmer.dto.AttentionDTO;
import com.zhenhai.programmer.dto.PageDTO;
import com.zhenhai.programmer.dto.ResponseDTO;
import com.zhenhai.programmer.service.IAttentionService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;


@RestController("WebAttentionController")
@RequestMapping("/web/attention")
public class AttentionController {

    @Resource
    private IAttentionService attentionService;

    /**
     * Follow user operation
     * @param attentionDTO
     * @return
     */
    @PostMapping("/add")
    public ResponseDTO<Boolean> addAttention(@RequestBody AttentionDTO attentionDTO){
        return attentionService.addAttention(attentionDTO);
    }

    /**
     * Unfollow user operation
     * @param attentionDTO
     * @return
     */
    @PostMapping("/remove")
    public ResponseDTO<Boolean> removeAttention(@RequestBody AttentionDTO attentionDTO){
        return attentionService.removeAttention(attentionDTO);
    }

    /**
     * Check if following
     * @param attentionDTO
     * @return
     */
    @PostMapping("/judge")
    public ResponseDTO<Boolean> judgeAttention(@RequestBody AttentionDTO attentionDTO){
        return attentionService.judgeAttention(attentionDTO);
    }

    /**
     * Get following and followers data by pagination
     * @param pageDTO
     * @return
     */
    @PostMapping("/list")
    public ResponseDTO<PageDTO<AttentionDTO>> getAttentionList(@RequestBody PageDTO<AttentionDTO> pageDTO){
        return attentionService.getAttentionList(pageDTO);
    }

    /**
     * Get all following and followers data
     * @param attentionDTO
     * @return
     */
    @PostMapping("/all")
    public ResponseDTO<List<AttentionDTO>> getAllAttentionList(@RequestBody AttentionDTO attentionDTO){
        return attentionService.getAllAttentionList(attentionDTO);
    }
}
