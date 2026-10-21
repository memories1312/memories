# HUTECH University Green Campus

Website truyền thông sinh viên về phân loại rác. Có đầy đủ ảnh, logo, hiệu ứng chuyển động, tra cứu vật dụng, trò chơi 6 câu và thử thách 7 ngày.

**Kho mã nguồn:** https://github.com/memories1312/memories

**Địa chỉ website sau khi bật GitHub Pages:** https://memories1312.github.io/memories/

## Bật website

Trong repository, vào **Settings → Pages → Build and deployment**. Chọn **Deploy from a branch**, nhánh **main**, thư mục **/(root)**, rồi **Save**. Khi lần triển khai thành công, GitHub hiển thị liên kết website ở đầu trang Pages.

Hướng dẫn chính thức: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Chỉnh sửa

- `index.html`: nội dung, logo, ảnh và nguồn bài viết.
- `styles.css`, `motion.css`: giao diện và hiệu ứng.
- `app.js`, `motion.js`: tra cứu, trò chơi, chia sẻ, theo dõi tiến độ và chuyển động.
- `assets/`: ảnh, logo và phông chữ.

Website chạy bằng HTML/CSS/JavaScript, không cần cài thư viện hay đăng nhập để xem. Nút chia sẻ giữ đầy đủ đường dẫn dự án. Tiến độ thử thách và lựa chọn chuyển động lưu riêng trong trình duyệt. Nút “Dừng hiệu ứng” cho phép tắt chuyển động; website cũng tôn trọng tùy chọn giảm chuyển động của thiết bị.

Để kiểm tra trên máy, chạy `python -m http.server 8000` trong thư mục này rồi mở http://localhost:8000/.

## Nguồn ảnh và nội dung

Các ảnh hoạt động lấy từ những bài HUTECH được liên kết dưới từng ảnh trên website. Logo tên dự án được thiết kế theo mẫu người dùng cung cấp. Bộ mã nguồn không tuyên bố cấp lại quyền sử dụng ảnh của bên thứ ba.

- Ngày Chủ Nhật Xanh: https://www.hutech.edu.vn/doantn/doan-thanh-nien-thong-bao-nam-2023-2024/14621325-tuoi-tre-hutech-thuc-hien-ngay-chu-nhat-xanh-lan-thu-155
- Chai nhựa tái sinh: https://www.hutech.edu.vn/homepage/hoat-dong-sinh-vien/14635411-hutech-ers-gop-chai-nhua-gop-them-yeu-thuong-cho-cong-dong
- NextGen Impact: https://www.hutech.edu.vn/khoakhxhqhcc/hoat-dong-sinh-vien/14635413-du-an-nextgen-impact-hanh-trinh-ket-noi-sinh-vien-3-quoc-gia-qua-cac-hoat-dong-phat-trien-ben-vung-d
- Be Vietnam Pro: https://github.com/google/fonts/tree/main/ofl/bevietnampro — giấy phép SIL Open Font License trong `assets/OFL-Be-Vietnam-Pro.txt`.
