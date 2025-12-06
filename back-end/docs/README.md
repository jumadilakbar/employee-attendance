# API Documentation

Dokumentasi lengkap untuk Employee Management GraphQL API.

## Files

1. **Employee-Management-API.postman_collection.json** - Postman collection yang bisa di-import langsung
2. **API-Documentation.md** - Dokumentasi lengkap dalam format Markdown

## Quick Start

### Import ke Postman

1. Buka Postman
2. Klik **Import** di kiri atas
3. Pilih file `Employee-Management-API.postman_collection.json`
4. Collection akan muncul di sidebar

### Setup Environment

1. Di Postman, klik **Environments** di sidebar
2. Buat environment baru atau gunakan default
3. Tambahkan variables:
   - `base_url`: `http://localhost:9100`
   - `access_token`: (akan di-set otomatis setelah login)

### Menggunakan Collection

1. **Login** terlebih dahulu untuk mendapatkan access token
2. Token akan otomatis disimpan ke environment variable `access_token`
3. Semua request berikutnya akan menggunakan token tersebut

## Endpoints

### Authentication
- Login
- Register (optional)

### Employees
- List Employees
- List Employees with Filter/Sort/Pagination
- Get Employee by ID
- Create Employee (Admin only)
- Update Employee (Admin only)
- Delete Employee (Admin only)

### Health Check
- GET /health

## GraphQL Playground

Akses GraphQL Playground untuk interactive testing:
```
http://localhost:9100/graphql
```

## Default Credentials

Setelah menjalankan seeder:
- **Admin**: `admin@company.com` / `password123`
- **Employee**: `employee@company.com` / `password123`

