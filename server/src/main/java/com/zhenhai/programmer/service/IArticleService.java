package com.zhenhai.programmer.service;

import com.zhenhai.programmer.dto.ArticleDTO;
import com.zhenhai.programmer.dto.PageDTO;
import com.zhenhai.programmer.dto.ResponseDTO;

import java.util.List;


public interface IArticleService {

    // Save article information
    ResponseDTO<ArticleDTO> saveArticle(ArticleDTO articleDTO);

    // Get paginated article data
    ResponseDTO<PageDTO<ArticleDTO>> getArticleList(PageDTO<ArticleDTO> pageDTO);

    // Get article information by article ID
    ResponseDTO<ArticleDTO> getArticleById(ArticleDTO articleDTO);

    // View article detail information
    ResponseDTO<ArticleDTO> viewArticle(ArticleDTO articleDTO);

    // Query hot articles
    ResponseDTO<List<ArticleDTO>> getHotArticleList(ArticleDTO articleDTO);

    // Update article information
    ResponseDTO<Boolean> updateArticleInfo(ArticleDTO articleDTO);

    // Delete article information
    ResponseDTO<Boolean> deleteArticle(ArticleDTO articleDTO);

    // Query author's other articles
    ResponseDTO<List<ArticleDTO>> getAuthorArticleList(ArticleDTO articleDTO);

    // Get total number of articles
    ResponseDTO<Integer> getArticleTotal(ArticleDTO articleDTO);

    // Get total number of articles by date
    ResponseDTO<List<Integer>> getArticleTotalByDay();
}
