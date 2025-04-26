package com.zhenhai.programmer.service;

import com.zhenhai.programmer.dto.LikeDTO;
import com.zhenhai.programmer.dto.ResponseDTO;


public interface ILikeService {

    // Like article
    ResponseDTO<Boolean> likeArticle(LikeDTO likeDTO);

    // Unlike article
    ResponseDTO<Boolean> unlikeArticle(LikeDTO likeDTO);

    // Check if article is liked
    ResponseDTO<Boolean> judgeLike(LikeDTO likeDTO);

}
