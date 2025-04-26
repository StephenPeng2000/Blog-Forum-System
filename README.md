# Blog-Forum-System

```mermaid
erDiagram

user {
    CHAR id PK "User ID"
    VARCHAR username "User nickname"
    VARCHAR password "User password"
    INT role_id "Role ID"
    DATETIME register_time "Registration time"
    INT sex "Gender"
    VARCHAR head_pic "Avatar"
    CHAR phone "Phone number"
    VARCHAR info "Introduction"
}

article {
    CHAR id PK "Article ID"
    VARCHAR title "Title"
    CHAR user_id FK "Author User ID"
    VARCHAR summary "Summary"
    LONGTEXT content_html "Content (HTML)"
    LONGTEXT content_markdown "Content (Markdown)"
    DATETIME create_time "Creation time"
    DATETIME update_time "Update time"
    INT type "Type"
    INT view_num "Views"
    INT collect_num "Collects"
    INT like_num "Likes"
    INT comment_num "Comments"
    INT state "Status"
    CHAR category_id FK "Category ID"
    INT top "Is pinned"
    INT official "Is official"
    INT essence "Is featured"
}

category {
    CHAR id PK "Category ID"
    VARCHAR name "Category name"
    INT sort "Sort order"
}

tag {
    CHAR id PK "Tag ID"
    VARCHAR name "Tag name"
}

tag_item {
    CHAR id PK "Tag item ID"
    CHAR tag_id FK "Tag ID"
    CHAR article_id FK "Article ID"
}

attention {
    CHAR id PK "Follow record ID"
    CHAR from_id FK "Follower User ID"
    CHAR to_id FK "Followed User ID"
    DATETIME create_time "Follow time"
}

collect {
    CHAR id PK "Collect record ID"
    CHAR user_id FK "Collector User ID"
    CHAR article_id FK "Collected Article ID"
    DATETIME create_time "Collect time"
}

comment {
    CHAR id PK "Comment ID"
    CHAR from_id FK "Commenter User ID"
    CHAR to_id FK "Replied User ID"
    CHAR parent_id FK "Parent Comment ID"
    CHAR article_id FK "Commented Article ID"
    VARCHAR content "Content"
    INT type "Type"
    INT pick "Is accepted"
    DATETIME create_time "Comment time"
}

likes {
    CHAR id PK "Like ID"
    CHAR user_id FK "User ID"
    CHAR article_id FK "Liked Article ID"
    DATETIME create_time "Like time"
}

user ||--o{ article : writes
user ||--o{ collect : collects
user ||--o{ likes : likes
user ||--o{ comment : comments
user ||--o{ attention : follows

category ||--o{ article : categorizes

article ||--o{ collect : collected
article ||--o{ likes : liked
article ||--o{ comment : commented
article ||--o{ tag_item : tagged

tag ||--o{ tag_item : tags

comment ||--o{ comment : replies
```
