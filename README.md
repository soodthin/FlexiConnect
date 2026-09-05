# FlexiConnect

**FlexiConnect** là nền tảng tuyển dụng trực tuyến kết nối **Ứng viên (Candidate)** và **Nhà tuyển dụng (Employer)**, tích hợp AI hỗ trợ phỏng vấn thử và gợi ý CV, cùng hệ thống thanh toán nâng cấp gói dịch vụ qua MoMo.

**Live demo:** [flexiconnectweb.onrender.com](https://flexiconnectweb.onrender.com)

---

## Mục lục

- [Tính năng chính](#tính-năng-chính)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt & chạy dự án](#cài-đặt--chạy-dự-án)
- [Biến môi trường](#biến-môi-trường)
- [Triển khai với Docker](#triển-khai-với-docker)
- [Tác giả](#tác-giả)

---

## Tính năng chính

### Ứng viên (Candidate)
- Đăng ký/đăng nhập, quản lý hồ sơ cá nhân (kỹ năng, học vấn, kinh nghiệm làm việc)
- Tìm kiếm, xem chi tiết và ứng tuyển tin tuyển dụng
- Lưu tin (Saved Jobs), theo dõi nhà tuyển dụng yêu thích
- Theo dõi trạng thái đơn ứng tuyển đã nộp
- **Phỏng vấn thử với AI (Mock Interview)** – sinh câu hỏi và phân tích câu trả lời tự động
- **Gợi ý cải thiện CV bằng AI**
- Nâng cấp gói tài khoản qua thanh toán **MoMo**
- Nhận thông báo real-time (ứng tuyển, lịch phỏng vấn, v.v.)

### Nhà tuyển dụng (Employer)
- Đăng ký/đăng nhập riêng cho doanh nghiệp
- Quản lý hồ sơ công ty, giới thiệu công ty
- Đăng tin tuyển dụng, quản lý danh sách ứng viên đã ứng tuyển
- Xem vị trí công việc trên bản đồ (tích hợp Leaflet/Geocoding)
- Nâng cấp gói dịch vụ qua thanh toán MoMo

### Quản trị viên (Admin)
- Dashboard tổng quan hệ thống
- Quản lý người dùng, nhà tuyển dụng, tin tuyển dụng

---

## Công nghệ sử dụng

### Backend – `FlexiConnectBE`
| Thành phần | Công nghệ |
|---|---|
| Ngôn ngữ / Nền tảng | Java 17, Spring Boot 3.5.5 |
| Xác thực | Spring Security, JWT (Nimbus JOSE) |
| Dữ liệu | Spring Data JPA, MySQL |
| Realtime | Spring WebSocket |
| Tích hợp ngoài | Spring Cloud OpenFeign, n8n (AI webhook), Cloudinary (upload ảnh), MoMo Payment |
| Khác | Thymeleaf, Apache POI (Excel), ModelMapper, Lombok, Spring Mail, spring-dotenv |
| Build / Triển khai | Maven, Docker |

### Frontend – `flexiconnect-fe`
| Thành phần | Công nghệ |
|---|---|
| Framework | React 19 + Vite |
| Định tuyến | React Router DOM v7 |
| Giao diện | Tailwind CSS, Radix UI, Framer Motion, Lucide/Bootstrap Icons |
| Dữ liệu & biểu đồ | Axios, Chart.js (react-chartjs-2) |
| Bản đồ | Leaflet, React-Leaflet |
| Khác | Day.js, Sonner (toast), React Cookies |

---

## Cấu trúc dự án

```
FlexiConnect/
├── FlexiConnectBE/ # Backend (Spring Boot)
│ ├── src/main/java/com/soodthin/
│ │ ├── controllers/ # REST API endpoints
│ │ ├── services/ # Business logic
│ │ ├── entity/ # JPA entities
│ │ ├── repositories/ # Spring Data repositories
│ │ ├── dto/ # Request/Response DTOs (bao gồm AI)
│ │ ├── configs/ # Cấu hình (Security, MoMo, ...)
│ │ └── filters/ # JWT filter, ...
│ ├── Dockerfile
│ └── pom.xml
│
├── flexiconnect-fe/ # Frontend (React + Vite)
│ ├── src/
│ │ ├── pages/
│ │ │ ├── admin/ # Trang quản trị
│ │ │ ├── auth/ # Đăng nhập / Đăng ký
│ │ │ ├── candidate/ # Trang ứng viên
│ │ │ ├── employer/ # Trang nhà tuyển dụng
│ │ │ └── public/ # Trang công khai (danh sách/chi tiết job)
│ │ ├── components/
│ │ ├── layouts/
│ │ └── contexts/
│ └── package.json
│
└── README.md
```

---

## Yêu cầu hệ thống

- **Java 17** trở lên & **Maven**
- **Node.js** ≥ 18 & **Yarn** hoặc **pnpm**
- **MySQL** 8.x
- (Tuỳ chọn) **Docker** nếu muốn chạy backend bằng container

---

## Cài đặt & chạy dự án

### 1. Clone repository
```bash
git clone https://github.com/soodthin/FlexiConnect.git
cd FlexiConnect
```

### 2. Backend
```bash
cd FlexiConnectBE
```
Tạo file cấu hình biến môi trường (xem mục [Biến môi trường](#biến-môi-trường)), sau đó chạy:
```bash
mvn clean install
mvn spring-boot:run
```
Mặc định server chạy tại `http://localhost:8080`.

### 3. Frontend
```bash
cd flexiconnect-fe
yarn install # hoặc: pnpm install
yarn dev # hoặc: pnpm dev
```
Mặc định ứng dụng chạy tại `http://localhost:5173`.

---

## Biến môi trường

Backend đọc cấu hình nhạy cảm từ biến môi trường (qua `spring-dotenv`, file `.env`) thay vì hard-code trong `application.properties`. Cần khai báo tối thiểu:

```env
# Database
DB_URL=
DB_USERNAME=
DB_PASSWORD=

# MoMo Payment (Dev/Prod)
DEV_MOMO_ENDPOINT=
DEV_ACCESS_KEY=
DEV_PARTNER_CODE=
DEV_SECRET_KEY=
DEV_REDIRECT_URL=
DEV_IPN_URL=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# AI (n8n webhook)
ai.n8n.webhook-url=
ai.n8n.analysis-url=
ai.n8n.generate-url=

# Mail
MAIL_USERNAME=
MAIL_PASSWORD=
```

---

## Triển khai với Docker

Backend đã có sẵn `Dockerfile` (multi-stage build với Maven + OpenJDK 17):

```bash
cd FlexiConnectBE
docker build -t flexiconnect-be .
docker run -p 8080:8080 --env-file .env flexiconnect-be
```

---

[@soodthin](https://github.com/soodthin)
