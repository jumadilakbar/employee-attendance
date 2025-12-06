# ERD -- Employee Management System

``` mermaid
erDiagram
    USERS ||--|{ EMPLOYEES : has
    EMPLOYEES ||--|{ ATTENDANCE : records

    USERS {
        UUID id PK
        VARCHAR username
        VARCHAR email
        VARCHAR password
        ENUM role
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    EMPLOYEES {
        UUID id PK
        UUID user_id FK
        VARCHAR full_name
        INT age
        VARCHAR class
        JSON subjects
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    ATTENDANCE {
        UUID id PK
        UUID employee_id FK
        DATE date
        ENUM status
        VARCHAR note
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
```

## Relationships

-   **Users 1 --- 1 Employees**\
-   **Employees 1 --- ∞ Attendance**