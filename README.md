# TNH Procurement System
## Hệ thống Quản trị Mua sắm — Tập đoàn Bệnh viện TNH

Ứng dụng quản trị mua sắm tập trung cho 4 bệnh viện tư nhân, xây dựng theo tài liệu **TNH-PS-OV-001 v0.9**, giao diện UI/UX phong cách Odoo.

### Tính năng chính

| Module | Mô tả |
|--------|-------|
| **18 phân hệ** | MD, PR, RV, SRC, RFQ, QTN, TEC, CMP, AWD, APR, PO, CTR, RCV, ACC, INV, VEN, RPT, SYS |
| **Đấu thầu (BID)** | Tạo gói thầu, mời NCC, niêm phong hồ sơ, so sánh tự động, chấm điểm theo trọng số |
| **Cổng NCC (Portal)** | 9 tab: Trang chủ, RFQ, Đấu thầu, Báo giá, PO, Giao hàng, Hóa đơn, Hồ sơ, Đánh giá |
| **Bảo trì & Bảo hành (MNT)** | Quản lý thiết bị, lịch bảo trì, lệnh công việc, theo dõi bảo hành, tổng quan tài sản |
| **Dashboard** | Bảng điều hành tổng quan 4 bệnh viện |

### Công nghệ

- React 19 + Vite
- Lucide React (icons)
- GitHub Pages (deployment)

### Cài đặt

```bash
npm install
npm run dev
```

### Build & Deploy

```bash
npm run build
```

Push lên GitHub → GitHub Actions tự động deploy lên GitHub Pages.

---

*Tập đoàn Bệnh viện TNH — Phòng Mua sắm Tập đoàn*
