package com.zhenhai.programmer.controller.web;

import com.zhenhai.programmer.dto.ArticleDTO;
import com.zhenhai.programmer.dto.PageDTO;
import com.zhenhai.programmer.dto.ResponseDTO;
import com.zhenhai.programmer.service.IArticleService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;


@RestController("WebArticleController")
@RequestMapping("/web/article")
public class ArticleController {

    @Resource
    private IArticleService articleService;

    /**
     * Save article information
     * @param articleDTO
     * @return
     */
    @PostMapping("/save")
    public ResponseDTO<ArticleDTO> saveArticle(@RequestBody ArticleDTO articleDTO){
        return articleService.saveArticle(articleDTO);
    }

    /**
     * Get article data by pagination
     * @param pageDTO
     * @return
     */
    @PostMapping("/list")
    public ResponseDTO<PageDTO<ArticleDTO>> getArticleList(@RequestBody PageDTO<ArticleDTO> pageDTO){
        return articleService.getArticleList(pageDTO);
    }

    /**
     * View article detail information
     * @param articleDTO
     * @return
     */
    @PostMapping("/view")
    public ResponseDTO<ArticleDTO> viewArticle(@RequestBody ArticleDTO articleDTO){
        return articleService.viewArticle(articleDTO);
    }

    /**
     * Get article detail information
     * @param articleDTO
     * @return
     */
    @PostMapping("/get")
    public ResponseDTO<ArticleDTO> getArticleDetail(@RequestBody ArticleDTO articleDTO){
        return articleService.getArticleById(articleDTO);
    }

    /**
     * Query hot articles
     * @param articleDTO
     * @return
     */
    @PostMapping("/hot")
    public ResponseDTO<List<ArticleDTO>> getHotArticleList(@RequestBody ArticleDTO articleDTO){
        return articleService.getHotArticleList(articleDTO);
    }

    /**
     * Query author's other articles
     * @param articleDTO
     * @return
     */
    @PostMapping("/author")
    public ResponseDTO<List<ArticleDTO>> getAuthorArticleList(@RequestBody ArticleDTO articleDTO){
        return articleService.getAuthorArticleList(articleDTO);
    }

}
