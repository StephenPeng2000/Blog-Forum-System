package com.zhenhai.programmer.dto;

import java.util.List;

public class PageDTO<T> {

    /**
     * Current page number
     */
    private Integer page;

    /**
     * Items per page
     */
    private Integer size;

    /**
     * Total number of items
     */
    private Long total;

    /**
     * Total number of pages
     */
    private Integer totalPage;

    /**
     * Return data
     */
    private List<T> list;

    /**
     * Request parameters
     */
    private T param;

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public List<T> getList() {
        return list;
    }

    public void setList(List<T> list) {
        this.list = list;
    }

    public Integer getTotalPage() {
        return  Integer.valueOf(String.valueOf((total-1)/size+1));
    }

    public void setTotalPage(Integer totalPage) {
        this.totalPage = totalPage;
    }

    public T getParam() {
        return param;
    }

    public void setParam(T param) {
        this.param = param;
    }

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("PageDto{");
        sb.append("page=").append(page);
        sb.append(", size=").append(size);
        sb.append(", total=").append(total);
        sb.append(", list=").append(list);
        sb.append(", totalPage=").append(totalPage);
        sb.append(", param=").append(param);
        sb.append('}');
        return sb.toString();
    }
}
