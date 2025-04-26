package com.zhenhai.programmer.controller.admin;

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

@RestController("AdminArticleController")
@RequestMapping("/admin/article")
public class ArticleController {

    @Resource
    private IArticleService articleService;

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
     * Update article information
     * @param articleDTO
     * @return
     */
    @PostMapping("/update")
    public ResponseDTO<Boolean> updateArticleInfo(@RequestBody ArticleDTO articleDTO){
        return articleService.updateArticleInfo(articleDTO);
    }

    /**
     * Delete article information
     * @param articleDTO
     * @return
     */
    @PostMapping("/delete")
    public ResponseDTO<Boolean> deleteArticle(@RequestBody ArticleDTO articleDTO){
        return articleService.deleteArticle(articleDTO);
    }

    /**
     * Get total number of articles
     * @param articleDTO
     * @return
     */
    @PostMapping("/total")
    public ResponseDTO<Integer> getArticleTotal(@RequestBody ArticleDTO articleDTO){
        return articleService.getArticleTotal(articleDTO);
    }

    /**
     * Get total number of articles by date
     * @return
     */
    @PostMapping("/total_day")
    public ResponseDTO<List<Integer>> getArticleTotalByDay(){
        return articleService.getArticleTotalByDay();
    }

}
