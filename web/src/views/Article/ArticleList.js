                    <div className={articleListStyle.articleStatus}>
                        {article.status === 0 && <span className={articleListStyle.status}>Pending Review</span>}
                        {article.status === 1 && <span className={articleListStyle.status}>Approved</span>}
                        {article.status === 2 && <span className={articleListStyle.status}>Rejected</span>}
                        {article.status === 3 && <span className={articleListStyle.status}>Draft</span>}
                    </div> 