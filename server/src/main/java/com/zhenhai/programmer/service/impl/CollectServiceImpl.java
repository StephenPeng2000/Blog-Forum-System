package com.zhenhai.programmer.service.impl;

import com.zhenhai.programmer.bean.CodeMsg;
import com.zhenhai.programmer.dao.ArticleMapper;
import com.zhenhai.programmer.dao.CollectMapper;
import com.zhenhai.programmer.domain.Article;
import com.zhenhai.programmer.domain.Collect;
import com.zhenhai.programmer.domain.CollectExample;
import com.zhenhai.programmer.dto.CollectDTO;
import com.zhenhai.programmer.dto.ResponseDTO;
import com.zhenhai.programmer.service.ICollectService;
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
public class CollectServiceImpl implements ICollectService {

    @Resource
    private CollectMapper collectMapper;

    @Resource
    private ArticleMapper articleMapper;

    /**
     * Check if article is collected
     * @param collectDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> judgeCollect(CollectDTO collectDTO) {
        if(CommonUtil.isEmpty(collectDTO.getArticleId()) || CommonUtil.isEmpty(collectDTO.getUserId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        Article article = articleMapper.selectByPrimaryKey(collectDTO.getArticleId());
        if(article == null) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_NOT_EXIST);
        }
        CollectExample collectExample = new CollectExample();
        collectExample.createCriteria().andArticleIdEqualTo(collectDTO.getArticleId()).andUserIdEqualTo(collectDTO.getUserId());
        List<Collect> collectList = collectMapper.selectByExample(collectExample);
        if(collectList.size() > 0) {
            return ResponseDTO.success(true);
        } else {
            return ResponseDTO.success(false);
        }
    }

    /**
     * Collect article
     * @param collectDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> addCollect(CollectDTO collectDTO) {
        if(CommonUtil.isEmpty(collectDTO.getArticleId()) || CommonUtil.isEmpty(collectDTO.getUserId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        Article article = articleMapper.selectByPrimaryKey(collectDTO.getArticleId());
        if(article == null) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_NOT_EXIST);
        }
        Collect collect = CopyUtil.copy(collectDTO, Collect.class);
        collect.setId(UuidUtil.getShortUuid());
        collect.setCreateTime(new Date());
        if(collectMapper.insertSelective(collect) == 0 ) {
            return ResponseDTO.errorByMsg(CodeMsg.COLLECT_ADD_ERROR);
        }
        // Update article collection count
        article.setCollectNum(article.getCollectNum() + 1);
        articleMapper.updateByPrimaryKeySelective(article);

        return ResponseDTO.successByMsg(true, "Collection successful");
    }

    /**
     * Remove article collection
     * @param collectDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> removeCollect(CollectDTO collectDTO) {
        if(CommonUtil.isEmpty(collectDTO.getArticleId()) || CommonUtil.isEmpty(collectDTO.getUserId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        Article article = articleMapper.selectByPrimaryKey(collectDTO.getArticleId());
        if(article == null) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_NOT_EXIST);
        }
        CollectExample collectExample = new CollectExample();
        collectExample.createCriteria().andArticleIdEqualTo(collectDTO.getArticleId()).andUserIdEqualTo(collectDTO.getUserId());
        if(collectMapper.deleteByExample(collectExample) == 0 ) {
            return ResponseDTO.errorByMsg(CodeMsg.COLLECT_REMOVE_ERROR);
        }
        // Update article collection count
        article.setCollectNum(article.getCollectNum() - 1);
        articleMapper.updateByPrimaryKeySelective(article);

        return ResponseDTO.successByMsg(true, "Collection removed successfully");
    }
}
