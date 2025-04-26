package com.zhenhai.programmer.controller.web;

import com.zhenhai.programmer.dto.CollectDTO;
import com.zhenhai.programmer.dto.ResponseDTO;
import com.zhenhai.programmer.service.ICollectService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;


@RestController("WebCollectController")
@RequestMapping("/web/collect")
public class CollectController {

    @Resource
    private ICollectService collectService;

    /**
     * Check if article is collected
     * @param collectDTO
     * @return
     */
    @PostMapping("/judge")
    public ResponseDTO<Boolean> judgeCollect(@RequestBody CollectDTO collectDTO){
        return collectService.judgeCollect(collectDTO);
    }

    /**
     * Collect article
     * @param collectDTO
     * @return
     */
    @PostMapping("/add")
    public ResponseDTO<Boolean> addCollect(@RequestBody CollectDTO collectDTO){
        return collectService.addCollect(collectDTO);
    }

    /**
     * Remove article collection
     * @param collectDTO
     * @return
     */
    @PostMapping("/remove")
    public ResponseDTO<Boolean> removeCollect(@RequestBody CollectDTO collectDTO){
        return collectService.removeCollect(collectDTO);
    }


}
