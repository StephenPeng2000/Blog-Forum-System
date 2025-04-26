package com.zhenhai.programmer.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.zhenhai.programmer.bean.CodeMsg;
import com.zhenhai.programmer.dao.*;
import com.zhenhai.programmer.dao.*;
import com.zhenhai.programmer.dao.my.MyArticleMapper;
import com.zhenhai.programmer.domain.*;
import com.zhenhai.programmer.dto.*;
import com.zhenhai.programmer.domain.*;
import com.zhenhai.programmer.dto.*;
import com.zhenhai.programmer.enums.ArticleQueryTypeEnum;
import com.zhenhai.programmer.enums.ArticleStateEnum;
import com.zhenhai.programmer.enums.ArticleTypeEnum;
import com.zhenhai.programmer.service.IArticleService;
import com.zhenhai.programmer.service.ITagService;
import com.zhenhai.programmer.utils.CommonUtil;
import com.zhenhai.programmer.utils.CopyUtil;
import com.zhenhai.programmer.utils.UuidUtil;
import com.zhenhai.programmer.utils.ValidateEntityUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;


@Transactional
@Service
public class ArticleServiceImpl implements IArticleService {

    @Resource
    private ArticleMapper articleMapper;

    @Resource
    private ITagService tagService;

    @Resource
    private UserMapper userMapper;

    @Resource
    private LikeMapper likeMapper;

    @Resource
    private CollectMapper collectMapper;

    @Resource
    private MyArticleMapper myArticleMapper;

    @Resource
    private TagItemMapper tagItemMapper;

    @Resource
    private TagMapper tagMapper;

    @Resource
    private CategoryMapper categoryMapper;

    @Resource
    private CommentMapper commentMapper;

    /**
     * Save article information
     * @param articleDTO
     * @return
     */
    @Override
    public ResponseDTO<ArticleDTO> saveArticle(ArticleDTO articleDTO) {
        // Perform unified form validation
        CodeMsg validate = ValidateEntityUtil.validate(articleDTO);
        if (!validate.getCode().equals(CodeMsg.SUCCESS.getCode())) {
            return ResponseDTO.errorByMsg(validate);
        }
        // Get article tags
        if(articleDTO.getTagList() == null || articleDTO.getTagList().length() == 0) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_TAG_EMPTY);
        }
        String[] splitTag = articleDTO.getTagList().split(";");
        if(splitTag.length > 3) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_TAG_OVER);
        }
        TagItemDTO tagItemDTO = new TagItemDTO();
        tagItemDTO.setTagIdList(splitTag);
        Article article = CopyUtil.copy(articleDTO, Article.class);
        if(CommonUtil.isEmpty(article.getId())) {
            // 添加操作
            article.setId(UuidUtil.getShortUuid());
            tagItemDTO.setArticleId(article.getId());
            tagService.saveTagItem(tagItemDTO);
            article.setCreateTime(new Date());
            article.setUpdateTime(new Date());
            if(articleMapper.insertSelective(article) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_ADD_ERROR);
            }
        } else {
            // 修改操作
            tagItemDTO.setArticleId(article.getId());
            tagService.saveTagItem(tagItemDTO);
            article.setUpdateTime(new Date());
            if(articleMapper.updateByPrimaryKeySelective(article) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_EDIT_ERROR);
            }
        }
        ResponseDTO<ArticleDTO> responseDTO = getArticleById(CopyUtil.copy(article, ArticleDTO.class));
        if(!CodeMsg.SUCCESS.getCode().equals(responseDTO.getCode())) {
            return responseDTO;
        } else {
            return ResponseDTO.successByMsg(CopyUtil.copy(responseDTO.getData(), ArticleDTO.class), "Article information saved successfully!");
        }
    }

    /**
     * Get paginated article data
     * @param pageDTO
     * @return
     */
    @Override
    public ResponseDTO<PageDTO<ArticleDTO>> getArticleList(PageDTO<ArticleDTO> pageDTO) {
        ArticleExample articleExample = new ArticleExample();
        // If current page is unknown, default to first page
        if(pageDTO.getPage() == null){
            pageDTO.setPage(1);
        }
        // If page size is unknown, default to 5 records per page
        if(pageDTO.getSize() == null){
            pageDTO.setSize(5);
        }
        ArticleExample.Criteria c1 = articleExample.createCriteria();
        if(pageDTO.getParam() != null) {
            ArticleDTO articleDTO = pageDTO.getParam();
            if(!CommonUtil.isEmpty(articleDTO.getCategoryId()) && !"0".equals(articleDTO.getCategoryId())) {
                c1.andCategoryIdEqualTo(articleDTO.getCategoryId());
            }
            if(!CommonUtil.isEmpty(articleDTO.getTitle())) {
                c1.andTitleLike("%" + articleDTO.getTitle() + "%");
            }
            if(articleDTO.getType() != null && articleDTO.getType() != 0) {
                c1.andTypeEqualTo(articleDTO.getType());
            }
            if(articleDTO.getState() != null && articleDTO.getState() != 0) {
                c1.andStateEqualTo(articleDTO.getState());
            }
            if(articleDTO.getState() == null) {
                List<Integer> stateList = new ArrayList<>();
                stateList.add(ArticleStateEnum.WAIT.getCode());
                stateList.add(ArticleStateEnum.DRAFT.getCode());
                stateList.add(ArticleStateEnum.FAIL.getCode());
                c1.andStateNotIn(stateList);
            }
            if(!CommonUtil.isEmpty(articleDTO.getUserId())
                    && !ArticleQueryTypeEnum.LIKE.getCode().equals(articleDTO.getQueryType())
                    && !ArticleQueryTypeEnum.COLLECT.getCode().equals(articleDTO.getQueryType())) {
                c1.andUserIdEqualTo(articleDTO.getUserId());
            }
            if(ArticleQueryTypeEnum.BLOG.getCode().equals(articleDTO.getQueryType())) {
                c1.andTypeEqualTo(ArticleTypeEnum.BLOG.getCode());
            }
            if(ArticleQueryTypeEnum.FORUM.getCode().equals(articleDTO.getQueryType())) {
                c1.andTypeEqualTo(ArticleTypeEnum.FORUM.getCode());
            }
            if(ArticleQueryTypeEnum.LIKE.getCode().equals(articleDTO.getQueryType())) {
                LikeExample likeExample = new LikeExample();
                likeExample.createCriteria().andUserIdEqualTo(articleDTO.getUserId());
                List<Like> likeList = likeMapper.selectByExample(likeExample);
                List<String> articleIdList = likeList.stream().map(Like::getArticleId).collect(Collectors.toList());
                if(articleIdList.size() == 0) {
                    articleIdList.add("-1");
                }
                c1.andIdIn(articleIdList);
            }
            if(ArticleQueryTypeEnum.COLLECT.getCode().equals(articleDTO.getQueryType())) {
                CollectExample collectExample = new CollectExample();
                collectExample.createCriteria().andUserIdEqualTo(articleDTO.getUserId());
                List<Collect> collectList = collectMapper.selectByExample(collectExample);
                List<String> articleIdList = collectList.stream().map(Collect::getArticleId).collect(Collectors.toList());
                if(articleIdList.size() == 0) {
                    articleIdList.add("-1");
                }
                c1.andIdIn(articleIdList);
            }
        }
        articleExample.setOrderByClause("top desc, essence desc, official desc, create_time desc");
        PageHelper.startPage(pageDTO.getPage(), pageDTO.getSize());
        // Get paginated article data
        List<Article> articleList = articleMapper.selectByExample(articleExample);
        PageInfo<Article> pageInfo = new PageInfo<>(articleList);
        // Get total number of records
        pageDTO.setTotal(pageInfo.getTotal());
        // Convert domain type data to DTO type data
        List<ArticleDTO> articleDTOList = CopyUtil.copyList(articleList, ArticleDTO.class);
        for(ArticleDTO articleDTO : articleDTOList) {
            // Get article's user information
            User user = userMapper.selectByPrimaryKey(articleDTO.getUserId());
            articleDTO.setUserDTO(CopyUtil.copy(user, UserDTO.class));
            // Get article's tag information
            TagItemExample tagItemExample = new TagItemExample();
            tagItemExample.createCriteria().andArticleIdEqualTo(articleDTO.getId());
            List<TagItem> tagItemList = tagItemMapper.selectByExample(tagItemExample);
            List<String> tagIdList = tagItemList.stream().map(TagItem::getTagId).collect(Collectors.toList());
            List<Tag> tagList;
            if(tagIdList.size() == 0) {
                tagList = new ArrayList<>();
            } else {
                TagExample tagExample = new TagExample();
                tagExample.createCriteria().andIdIn(tagIdList);
                tagList = tagMapper.selectByExample(tagExample);
            }
            articleDTO.setTagDTOList(CopyUtil.copyList(tagList, TagDTO.class));
            // Get article's category information
            Category category = categoryMapper.selectByPrimaryKey(articleDTO.getCategoryId());
            if(category == null) {
                articleDTO.setCategoryDTO(CopyUtil.copy(new Category(), CategoryDTO.class));
            } else {
                articleDTO.setCategoryDTO(CopyUtil.copy(category, CategoryDTO.class));
            }
        }
        pageDTO.setList(articleDTOList);
        return ResponseDTO.success(pageDTO);
    }

    /**
     * Get article information by article ID
     * @param articleDTO
     * @return
     */
    @Override
    public ResponseDTO<ArticleDTO> getArticleById(ArticleDTO articleDTO) {
        if(CommonUtil.isEmpty(articleDTO.getId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        Article article = articleMapper.selectByPrimaryKey(articleDTO.getId());
        if(article == null) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_NOT_EXIST);
        }
        ArticleDTO articleDTODB = CopyUtil.copy(article, ArticleDTO.class);
        // Get article's user information
        User user = userMapper.selectByPrimaryKey(articleDTODB.getUserId());
        articleDTODB.setUserDTO(CopyUtil.copy(user, UserDTO.class));
        // Get article's tag information
        TagItemExample tagItemExample = new TagItemExample();
        tagItemExample.createCriteria().andArticleIdEqualTo(articleDTODB.getId());
        List<TagItem> tagItemList = tagItemMapper.selectByExample(tagItemExample);
        List<String> tagIdList = tagItemList.stream().map(TagItem::getTagId).collect(Collectors.toList());
        List<Tag> tagList = new ArrayList<>();
        if(tagItemList.size() > 0) {
            TagExample tagExample = new TagExample();
            tagExample.createCriteria().andIdIn(tagIdList);
            tagList = tagMapper.selectByExample(tagExample);
        }
        articleDTODB.setTagDTOList(CopyUtil.copyList(tagList, TagDTO.class));
        // Get article's category information
        Category category = categoryMapper.selectByPrimaryKey(articleDTODB.getCategoryId());
        if(category == null) {
            articleDTODB.setCategoryDTO(CopyUtil.copy(new Category(), CategoryDTO.class));
        } else {
            articleDTODB.setCategoryDTO(CopyUtil.copy(category, CategoryDTO.class));
        }
        return ResponseDTO.success(articleDTODB);
    }

    /**
     * View article details
     * @param articleDTO
     * @return
     */
    @Override
    public ResponseDTO<ArticleDTO> viewArticle(ArticleDTO articleDTO) {
        // Increase article view count
        Article article = articleMapper.selectByPrimaryKey(articleDTO.getId());
        article.setViewNum(article.getViewNum() + 1);
        articleMapper.updateByPrimaryKeySelective(article);
        ResponseDTO<ArticleDTO> responseDTO = getArticleById(articleDTO);
        return responseDTO;
    }

    /**
     * Query hot articles
     * @param articleDTO
     * @return
     */
    @Override
    public ResponseDTO<List<ArticleDTO>> getHotArticleList(ArticleDTO articleDTO) {
        ArticleExample articleExample = new ArticleExample();
        List<Integer> stateList = new ArrayList<>();
        stateList.add(ArticleStateEnum.WAIT.getCode());
        stateList.add(ArticleStateEnum.DRAFT.getCode());
        stateList.add(ArticleStateEnum.FAIL.getCode());
        if(articleDTO.getType() != null) {
            articleExample.createCriteria().andTypeEqualTo(articleDTO.getType()).andStateNotIn(stateList);
        } else {
            articleExample.createCriteria().andStateNotIn(stateList);
        }
        articleExample.setOrderByClause("view_num desc, like_num desc, comment_num desc");
        PageHelper.startPage(1, 5);
        List<Article> articleList = articleMapper.selectByExample(articleExample);
        List<ArticleDTO> articleDTOList = CopyUtil.copyList(articleList, ArticleDTO.class);
        return ResponseDTO.success(articleDTOList);
    }

    /**
     * Update article information
     * @param articleDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> updateArticleInfo(ArticleDTO articleDTO) {
        if(CommonUtil.isEmpty(articleDTO.getId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        Article article = CopyUtil.copy(articleDTO,  Article.class);
        if(articleMapper.updateByPrimaryKeySelective(article) == 0) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_EDIT_ERROR);
        }
        return ResponseDTO.successByMsg(true, "Article information updated successfully!");
    }

    /**
     * Delete article information
     * @param articleDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> deleteArticle(ArticleDTO articleDTO) {
        if(CommonUtil.isEmpty(articleDTO.getId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        String[] ids = articleDTO.getId().split(",");
        for(String id : ids) {
            // Delete tag detail information
            TagItemExample tagItemExample = new TagItemExample();
            tagItemExample.createCriteria().andArticleIdEqualTo(articleDTO.getId());
            tagItemMapper.deleteByExample(tagItemExample);
            // Delete this article's comment information
            CommentExample commentExample = new CommentExample();
            commentExample.createCriteria().andArticleIdEqualTo(articleDTO.getId());
            commentMapper.deleteByExample(commentExample);
            // Delete likes related to this article
            LikeExample likeExample = new LikeExample();
            likeExample.createCriteria().andArticleIdEqualTo(articleDTO.getId());
            likeMapper.deleteByExample(likeExample);
            // Delete collections related to this article
            CollectExample collectExample = new CollectExample();
            collectExample.createCriteria().andArticleIdEqualTo(articleDTO.getId());
            collectMapper.deleteByExample(collectExample);
            // Delete article information
            if(articleMapper.deleteByPrimaryKey(id) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_DELETE_ERROR);
            }
        }
        return ResponseDTO.successByMsg(true, "Article information deleted successfully!");
    }

    /**
     * Query author's other articles
     * @param articleDTO
     * @return
     */
    @Override
    public ResponseDTO<List<ArticleDTO>> getAuthorArticleList(ArticleDTO articleDTO) {
        if(CommonUtil.isEmpty(articleDTO.getId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        Article article = articleMapper.selectByPrimaryKey(articleDTO.getId());
        ArticleExample articleExample = new ArticleExample();
        List<Integer> stateList = new ArrayList<>();
        stateList.add(ArticleStateEnum.WAIT.getCode());
        stateList.add(ArticleStateEnum.DRAFT.getCode());
        stateList.add(ArticleStateEnum.FAIL.getCode());
        articleExample.createCriteria().andUserIdEqualTo(article.getUserId()).andStateNotIn(stateList);
        PageHelper.startPage(1, 5);
        List<Article> articleList = articleMapper.selectByExample(articleExample);
        List<ArticleDTO> articleDTOList = CopyUtil.copyList(articleList, ArticleDTO.class);
        return ResponseDTO.success(articleDTOList);
    }

    /**
     * Get total number of articles
     * @param articleDTO
     * @return
     */
    @Override
    public ResponseDTO<Integer> getArticleTotal(ArticleDTO articleDTO) {
        ArticleExample articleExample = new ArticleExample();
        if(articleDTO.getType() != null) {
            articleExample.createCriteria().andTypeEqualTo(articleDTO.getType());
        }
        return ResponseDTO.success(articleMapper.countByExample(articleExample));
    }

    /**
     * Get total number of articles by date
     * @return
     */
    @Override
    public ResponseDTO<List<Integer>> getArticleTotalByDay() {
        List<Integer> totalList = new ArrayList<>();
        Map<String, Object> queryMap = new HashMap<>();
        // Get number of completed earnings from the day before yesterday
        queryMap.put("start", 2);
        queryMap.put("end", 1);
        totalList.add(myArticleMapper.getArticleTotalByDate(queryMap));
        // Get number of completed earnings from yesterday
        queryMap.put("start", 1);
        queryMap.put("end", 0);
        totalList.add(myArticleMapper.getArticleTotalByDate(queryMap));
        // Get number of completed earnings from today
        queryMap.put("start", 0);
        queryMap.put("end", -1);
        totalList.add(myArticleMapper.getArticleTotalByDate(queryMap));
        return ResponseDTO.success(totalList);
    }

}
