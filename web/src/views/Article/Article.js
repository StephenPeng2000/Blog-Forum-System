                    <div className={articleStyle.articleStatus}>
                        {article.status === 0 && <span className={articleStyle.status}>Pending Review</span>}
                        {article.status === 1 && <span className={articleStyle.status}>Approved</span>}
                        {article.status === 2 && <span className={articleStyle.status}>Rejected</span>}
                        {article.status === 3 && <span className={articleStyle.status}>Draft</span>}
                    </div> 