package com.zhenhai.programmer.service.impl;

import com.zhenhai.programmer.bean.CodeMsg;
import com.zhenhai.programmer.dao.ArticleMapper;
import com.zhenhai.programmer.dao.LikeMapper;
import com.zhenhai.programmer.domain.Article;
import com.zhenhai.programmer.domain.Like;
import com.zhenhai.programmer.domain.LikeExample;
import com.zhenhai.programmer.dto.LikeDTO;
import com.zhenhai.programmer.dto.ResponseDTO;
import com.zhenhai.programmer.service.ILikeService;
import com.zhenhai.programmer.utils.CommonUtil;
import com.zhenhai.programmer.utils.CopyUtil;
import com.zhenhai.programmer.utils.UuidUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;


@Service
@Transactional
public class LikeServiceImpl implements ILikeService {

    @Resource
    private LikeMapper likeMapper;

    @Resource
    private ArticleMapper articleMapper;

    /**
     * Like article
     * @param likeDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> likeArticle(LikeDTO likeDTO) {
        if(CommonUtil.isEmpty(likeDTO.getArticleId()) || CommonUtil.isEmpty(likeDTO.getUserId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        Article article = articleMapper.selectByPrimaryKey(likeDTO.getArticleId());
        if(article == null) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_NOT_EXIST);
        }
        Like like = CopyUtil.copy(likeDTO, Like.class);
        like.setId(UuidUtil.getShortUuid());
        like.setCreateTime(new Date());
        if(likeMapper.insertSelective(like) == 0 ) {
            return ResponseDTO.errorByMsg(CodeMsg.LIKE_ERROR);
        }
        // Update article like count
        article.setLikeNum(article.getLikeNum() + 1);
        articleMapper.updateByPrimaryKeySelective(article);

        return ResponseDTO.successByMsg(true, "Like successful");
    }

    /**
     * Unlike article
     * @param likeDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> unlikeArticle(LikeDTO likeDTO) {
        if(CommonUtil.isEmpty(likeDTO.getArticleId()) || CommonUtil.isEmpty(likeDTO.getUserId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        Article article = articleMapper.selectByPrimaryKey(likeDTO.getArticleId());
        if(article == null) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_NOT_EXIST);
        }
        LikeExample likeExample = new LikeExample();
        likeExample.createCriteria().andArticleIdEqualTo(likeDTO.getArticleId()).andUserIdEqualTo(likeDTO.getUserId());
        if(likeMapper.deleteByExample(likeExample) == 0 ) {
            return ResponseDTO.errorByMsg(CodeMsg.UNLIKE_ERROR);
        }
        // Update article like count
        article.setLikeNum(article.getLikeNum() - 1);
        articleMapper.updateByPrimaryKeySelective(article);

        return ResponseDTO.successByMsg(true, "Unlike successful");
    }

    /**
     * Check if article is liked
     * @param likeDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> judgeLike(LikeDTO likeDTO) {
        if(CommonUtil.isEmpty(likeDTO.getArticleId()) || CommonUtil.isEmpty(likeDTO.getUserId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        Article article = articleMapper.selectByPrimaryKey(likeDTO.getArticleId());
        if(article == null) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_NOT_EXIST);
        }
        LikeExample likeExample = new LikeExample();
        likeExample.createCriteria().andArticleIdEqualTo(likeDTO.getArticleId()).andUserIdEqualTo(likeDTO.getUserId());
        List<Like> likeList = likeMapper.selectByExample(likeExample);
        if(likeList.size() > 0) {
            return ResponseDTO.success(true);
        } else {
            return ResponseDTO.success(false);
        }
    }
}
