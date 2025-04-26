package com.zhenhai.programmer.service;

import com.zhenhai.programmer.dto.CollectDTO;
import com.zhenhai.programmer.dto.ResponseDTO;


public interface ICollectService {

    // Check if article is collected
    ResponseDTO<Boolean> judgeCollect(CollectDTO collectDTO);

    // Collect article
    ResponseDTO<Boolean> addCollect(CollectDTO collectDTO);

    // Remove article collection
    ResponseDTO<Boolean> removeCollect(CollectDTO collectDTO);
}
