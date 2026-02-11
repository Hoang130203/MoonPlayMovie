# **OPhim API Documentation**

Tài liệu này cung cấp chi tiết các điểm cuối (endpoints), tham số yêu cầu và cấu trúc dữ liệu phản hồi của hệ thống API OPhim.

**Base URL:** https://ophim1.com/api (Hoặc domain cắm API riêng của bạn)

## ---

**1\. Danh sách phim mới cập nhật**

Lấy danh sách các bộ phim vừa được cập nhật trên hệ thống, thường dùng cho trang chủ.

* **Endpoint:** GET /danh-sach/phim-moi-cap-nhat  
* **Tham số (Query Params):**

| Tham số | Kiểu | Mặc định | Mô tả |
| :---- | :---- | :---- | :---- |
| page | Integer | 1 | Số trang cần lấy dữ liệu |

* **Cấu trúc phản hồi (Response):**

JSON

{  
  "status": true,  
  "items": \[... \],  
  "pagination": {  
    "totalItems": 1000,  
    "totalItemsPerPage": 10,  
    "currentPage": 1,  
    "totalPages": 100  
  }  
}

## ---

**2\. Chi tiết bộ phim và tập phim**

Lấy toàn bộ thông tin chi tiết của một bộ phim bao gồm mô tả, thông tin kỹ thuật và các đường dẫn tập phim (streaming links).

* **Endpoint:** GET /phim/{slug}  
* **Tham số đường dẫn (Path Params):**

| Tham số | Kiểu | Yêu cầu | Mô tả |
| :---- | :---- | :---- | :---- |
| {slug} | String | Bắt buộc | Định danh duy nhất của phim |

* **Cấu trúc phản hồi (Response):**

JSON

{  
  "status": true,  
  "movie": {  
    "name": "Tên phim",  
    "content": "Mô tả nội dung",  
    "thumb\_url": "...",  
    "poster\_url": "...",  
    "episode\_current": "Tập 10",  
    "category": \[{"name": "Hành động"}\],  
    "country": \[{"name": "Hàn Quốc"}\]  
  },  
  "episodes": \[  
    {  
      "server\_name": "Vietsub \#1",  
      "server\_data": \[  
        { "name": "1", "slug": "1", "link\_embed": "...", "link\_m3u8": "..." }  
      \]  
    }  
  \]  
}

## ---

**3\. Tìm kiếm phim**

Endpoint này cho phép tìm kiếm phim theo từ khóa (tên phim hoặc tên gốc).

* **Endpoint:** GET /v1/api/tim-kiem  
* **Tham số (Query Params):**

| Tham số | Kiểu | Yêu cầu | Mô tả |
| :---- | :---- | :---- | :---- |
| keyword | String | Bắt buộc | Từ khóa tìm kiếm (Ví dụ: keyword=one+piece) |
| page | Integer | Tùy chọn | Số trang kết quả (Mặc định là 1\) |

* **Cấu trúc phản hồi:** Tương tự như danh sách phim mới, trả về mảng items chứa các phim khớp với từ khóa tìm kiếm.

## ---

**4\. Danh mục bổ trợ (Thể loại & Quốc gia)**

Lấy danh sách các thể loại và quốc gia hiện có trên hệ thống để xây dựng menu lọc.

### **4.1. Danh sách thể loại**

* **Endpoint:** GET /the-loai  
* **Phản hồi:** Mảng các đối tượng chứa name và slug của thể loại.

### **4.2. Danh sách quốc gia**

* **Endpoint:** GET /quoc-gia  
* **Phản hồi:** Mảng các đối tượng chứa name và slug của quốc gia.

## ---

**5\. Lọc phim theo danh mục**

Truy xuất danh sách phim dựa trên thể loại, quốc gia hoặc loại phim cụ thể.

* **Endpoint:** GET /v1/api/danh-sach/{category\_slug}  
* **Tham số (Query Params):**

| Tham số | Kiểu | Mặc định | Mô tả |
| :---- | :---- | :---- | :---- |
| page | Integer | 1 | Số trang cần lấy dữ liệu |

* **Các category\_slug phổ biến:** phim-bo, phim-le, hoat-hinh, tv-shows hoặc các slug thể loại/quốc gia. 1

## ---

**6\. Các mã trạng thái lỗi thường gặp**

Hệ thống sử dụng các mã trạng thái HTTP tiêu chuẩn:

* 200 OK: Yêu cầu thành công.  
* 404 Not Found: Không tìm thấy nội dung.  
* 500 Internal Server Error: Lỗi hệ thống hoặc domain cào phim gặp sự cố. 2

---

**Lưu ý kỹ thuật:**

* URL tìm kiếm sử dụng prefix /v1/api/ thay vì /api/ như các endpoint cũ.  
* Khi thực hiện tìm kiếm, từ khóa nên được mã hóa URL (URL Encoding) để tránh lỗi với các ký tự tiếng Việt có dấu hoặc khoảng trắng.

#### **Nguồn trích dẫn**

1. ophim-js CDN by jsDelivr \- A CDN for npm and GitHub, truy cập vào tháng 2 11, 2026, [https://www.jsdelivr.com/package/npm/ophim-js](https://www.jsdelivr.com/package/npm/ophim-js)  
2. hacoidev/ophim-core \- GitHub, truy cập vào tháng 2 11, 2026, [https://github.com/hacoidev/ophim-core](https://github.com/hacoidev/ophim-core)