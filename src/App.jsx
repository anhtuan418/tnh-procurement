import { useState, useCallback, useMemo, useRef } from "react";
import { Search, Bell, ChevronDown, ChevronRight, Menu, X, Plus, Filter, LayoutGrid, List, MoreVertical, ArrowLeft, Paperclip, Send, Clock, CheckCircle2, AlertCircle, FileText, Users, ShoppingCart, ClipboardCheck, Truck, Package, BarChart3, Settings, Building2, Star, Eye, Edit3, Trash2, Download, Upload, MessageSquare, Activity, Globe, Shield, TrendingUp, TrendingDown, DollarSign, Calendar, Hash, Tag, Layers, RefreshCw, ExternalLink, Home, ChevronLeft, UserCheck, Award, Scale, Gavel, Receipt, Warehouse, BadgeCheck, Boxes, CircleDot, Zap, Wrench, Hammer, ThermometerSun, Timer, AlertTriangle, Target, PieChart, ArrowUpDown, Lock, Unlock, Copy, Share2, Printer, RotateCcw, PlayCircle, PauseCircle, StopCircle, MapPin, Phone, Mail, Link2, Info, HelpCircle, Maximize2, Minimize2, GripVertical, Move } from "lucide-react";

const HOSPITALS = ["BV TNH Thái Nguyên", "BV TNH Phổ Yên", "BV TNH Việt Yên", "BV TNH Lạng Sơn"];
const H_CODES = { "BV TNH Thái Nguyên": "TN", "BV TNH Phổ Yên": "PY", "BV TNH Việt Yên": "VY", "BV TNH Lạng Sơn": "LS" };

const MENU_GROUPS = [
  { label: "MUA SẮM", items: ["PR","RV","SRC","RFQ","QTN"] },
  { label: "ĐẤU GIÁ & LỰA CHỌN", items: ["BID","TEC","CMP","AWD","APR"] },
  { label: "THỰC HIỆN", items: ["PO","CTR","RCV","ACC","INV"] },
  { label: "QUẢN TRỊ", items: ["MD","VEN","MNT","RPT","SYS"] },
  { label: "CỔNG NCC", items: ["PORTAL"] },
];

const MODULES = {
  dashboard:{ name:"Tổng quan", icon: Home, color:"#714B67" },
  MD:{ name:"Dữ liệu chủ", icon: Layers, color:"#714B67" },
  PR:{ name:"Yêu cầu mua", icon: FileText, color:"#017E84" },
  RV:{ name:"Thẩm định", icon: ClipboardCheck, color:"#017E84" },
  SRC:{ name:"Tìm nguồn", icon: Search, color:"#E9573F" },
  RFQ:{ name:"Yêu cầu báo giá", icon: Send, color:"#E9573F" },
  QTN:{ name:"Báo giá NCC", icon: Receipt, color:"#E9573F" },
  BID:{ name:"Đấu thầu / Bidding", icon: Gavel, color:"#9b59b6" },
  TEC:{ name:"Đánh giá kỹ thuật", icon: BadgeCheck, color:"#F6BB42" },
  CMP:{ name:"So sánh tự động", icon: Scale, color:"#F6BB42" },
  AWD:{ name:"Lựa chọn NCC", icon: Award, color:"#F6BB42" },
  APR:{ name:"Phê duyệt", icon: CheckCircle2, color:"#8CC152" },
  PO:{ name:"Đơn đặt hàng", icon: ShoppingCart, color:"#3BAFDA" },
  CTR:{ name:"Hợp đồng", icon: Scale, color:"#3BAFDA" },
  RCV:{ name:"Giao nhận", icon: Truck, color:"#967ADC" },
  ACC:{ name:"Nghiệm thu", icon: UserCheck, color:"#967ADC" },
  INV:{ name:"Hóa đơn", icon: DollarSign, color:"#DA4453" },
  VEN:{ name:"Nhà cung cấp", icon: Building2, color:"#37BC9B" },
  MNT:{ name:"Bảo trì & Bảo hành", icon: Wrench, color:"#E67E22" },
  RPT:{ name:"Báo cáo", icon: BarChart3, color:"#4A89DC" },
  SYS:{ name:"Cấu hình", icon: Settings, color:"#656D78" },
  PORTAL:{ name:"Cổng NCC", icon: Globe, color:"#E9573F" },
};

const MODULE_STATUSES = {
  PR: ["Đang soạn","Chờ xác nhận","Đã xác nhận","Đang thẩm định","Đang xử lý","Hoàn tất"],
  RV: ["Đang soạn","Đang thẩm định","Đạt","Không đạt"],
  SRC: ["Đang soạn","Đang tìm nguồn","Có NCC","Hoàn tất"],
  RFQ: ["Đang soạn","Đã gửi","Đang nhận báo giá","Đã đóng","Hoàn tất"],
  QTN: ["Đang soạn","Đã gửi","Đang đánh giá","Chấp nhận","Từ chối"],
  BID: ["Đang soạn","Đang đấu thầu","Chờ mở thầu","Đã mở","Đã chấm","Đã duyệt"],
  TEC: ["Đang soạn","Đang đánh giá","Đạt","Không đạt"],
  CMP: ["Đang soạn","Đang so sánh","Hoàn tất"],
  AWD: ["Đang soạn","Chờ duyệt","Đã duyệt","Đã tạo PO"],
  APR: ["Chờ duyệt","Đang duyệt","Đã duyệt","Từ chối","Trả lại"],
  PO: ["Đang soạn","Chờ kiểm tra","Sẵn sàng","Đã phát hành","NCC xác nhận","Giao một phần","Nhận đủ","Đã đóng"],
  CTR: ["Đang soạn","Chờ ký","Hiệu lực","Hết hạn","Đã đóng"],
  RCV: ["Đang soạn","Đang giao","Nhận một phần","Nhận đủ"],
  ACC: ["Đang soạn","Đang nghiệm thu","Đạt","Không đạt","Đạt có điều kiện"],
  INV: ["Đang soạn","Đang đối chiếu","Đủ hồ sơ","Chờ thanh toán","Đã thanh toán"],
  VEN: ["Đang đăng ký","Chờ thẩm định","Hoạt động","Có điều kiện","Tạm ngừng","Khóa"],
};

const SC = {
  "Đang soạn":"#94a3b8","Chờ xác nhận":"#f59e0b","Đã xác nhận":"#22c55e","Đang thẩm định":"#3b82f6",
  "Đang xử lý":"#3b82f6","Hoàn tất":"#16a34a","Đã hủy":"#ef4444","Đã phát hành":"#22c55e",
  "Chờ duyệt":"#f97316","Đã duyệt":"#16a34a","NCC xác nhận":"#06b6d4","Hiệu lực":"#22c55e",
  "Hoạt động":"#22c55e","Đã gửi":"#8b5cf6","Sẵn sàng":"#14b8a6","Đang nhận báo giá":"#3b82f6",
  "Niêm phong":"#6366f1","Đã mở":"#f59e0b","Đang đấu thầu":"#9b59b6","Chờ mở thầu":"#e67e22",
  "Đã chấm":"#22c55e","Từ chối":"#ef4444","Trả lại":"#f97316","Có điều kiện":"#f59e0b",
  "Tạm ngừng":"#ef4444","Đang bảo trì":"#e67e22","Hết bảo hành":"#ef4444","Còn bảo hành":"#22c55e",
  "Quá hạn":"#ef4444","Lên kế hoạch":"#3b82f6","Đang thực hiện":"#f59e0b",
  "Đạt":"#22c55e","Không đạt":"#ef4444","Đạt có điều kiện":"#f59e0b",
  "Đang tìm nguồn":"#3b82f6","Có NCC":"#22c55e","Đang đánh giá":"#3b82f6",
  "Chấp nhận":"#22c55e","Đang so sánh":"#3b82f6","Đã tạo PO":"#16a34a",
  "Đang duyệt":"#3b82f6","Chờ ký":"#f59e0b","Hết hạn":"#ef4444","Đã đóng":"#94a3b8",
  "Đang giao":"#3b82f6","Nhận một phần":"#f59e0b","Nhận đủ":"#22c55e",
  "Đang nghiệm thu":"#3b82f6","Đang đối chiếu":"#3b82f6","Đủ hồ sơ":"#22c55e",
  "Chờ thanh toán":"#f59e0b","Đã thanh toán":"#16a34a","Giao một phần":"#f59e0b",
  "Đang đăng ký":"#94a3b8","Chờ thẩm định":"#f59e0b","Khóa":"#ef4444",
  "Chờ giao":"#f59e0b",
};
const Badge = ({s,size="sm"}) => {
  const c = SC[s]||"#94a3b8";
  const p = size==="xs" ? "1px 6px" : "2px 10px";
  const f = size==="xs" ? "10px" : "11px";
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:p,borderRadius:12,fontSize:f,fontWeight:500,background:`${c}18`,color:c,border:`1px solid ${c}40`,whiteSpace:"nowrap"}}><span style={{width:6,height:6,borderRadius:"50%",background:c}}/>{s}</span>;
};

// ========== INITIAL SAMPLE DATA ==========
const INITIAL_VENDORS = [
  {id:"NCC-001",name:"Công ty CP Dược phẩm Hà Nội",tax:"0100107518",status:"Hoạt động",group:"Dược phẩm",rating:4.2,contracts:3,pos:12,email:"lienhe@duocphamhn.vn",phone:"024-3851-2345",addr:"170 La Thành, Đống Đa, HN",portal:true},
  {id:"NCC-002",name:"Công ty TNHH TBYT Quốc Tế Medic",tax:"0312456789",status:"Hoạt động",group:"TBYT",rating:3.8,contracts:1,pos:5,email:"sales@medic-intl.vn",phone:"028-3845-6789",addr:"45 Nguyễn Thị Minh Khai, Q1, HCM",portal:true},
  {id:"NCC-003",name:"Công ty CP Hóa chất Việt Nam",tax:"0100234567",status:"Có điều kiện",group:"Hóa chất",rating:3.5,contracts:2,pos:8,email:"info@vietcochemical.vn",phone:"024-3942-1111",addr:"23 Lạc Long Quân, Tây Hồ, HN",portal:true},
  {id:"NCC-004",name:"Công ty TNHH Vật tư Y tế Sài Gòn",tax:"0309876543",status:"Hoạt động",group:"Vật tư",rating:4.5,contracts:4,pos:20,email:"sg.medical@gmail.com",phone:"028-3921-7777",addr:"88 Trần Hưng Đạo, Q5, HCM",portal:false},
  {id:"NCC-005",name:"Công ty CP Thiết bị Đông Á",tax:"0100998877",status:"Hoạt động",group:"TBYT",rating:4.0,contracts:2,pos:9,email:"dongamedical@vn.com",phone:"024-3755-4321",addr:"12 Phạm Hùng, Nam Từ Liêm, HN",portal:true},
];

const INITIAL_PRS = [
  {id:"PR-TN-2026-000045",name:"Dự trù thuốc tháng 9/2026",hospital:"BV TNH Thái Nguyên",dept:"Khoa Dược",requester:"Nguyễn Thị Hoa",date:"25/08/2026",status:"Đang thẩm định",priority:"Cao",lines:24,amount:"245.000.000",rfqIds:["RFQ-TN-2026-0001"],purpose:"Phục vụ KCB"},
  {id:"PR-PY-2026-000032",name:"Vật tư tiêu hao Q4/2026",hospital:"BV TNH Phổ Yên",dept:"Phòng Vật tư",requester:"Trần Văn Minh",date:"24/08/2026",status:"Chờ xác nhận",priority:"Trung bình",lines:18,amount:"89.500.000",rfqIds:[],purpose:"Phục vụ KCB"},
  {id:"PR-VY-2026-000028",name:"TBYT phòng mổ bổ sung",hospital:"BV TNH Việt Yên",dept:"Khoa Ngoại",requester:"Lê Thị Lan",date:"23/08/2026",status:"Đã xác nhận",priority:"Cao",lines:5,amount:"1.250.000.000",rfqIds:["RFQ-VY-2026-0001"],purpose:"Đầu tư trang thiết bị"},
  {id:"PR-LS-2026-000019",name:"Hóa chất xét nghiệm tháng 10",hospital:"BV TNH Lạng Sơn",dept:"Khoa Xét nghiệm",requester:"Phạm Đức Anh",date:"22/08/2026",status:"Đang soạn",priority:"Trung bình",lines:12,amount:"156.000.000",rfqIds:[],purpose:"Phục vụ KCB"},
  {id:"PR-TN-2026-000044",name:"Thuốc cấp cứu bổ sung khẩn",hospital:"BV TNH Thái Nguyên",dept:"Khoa Cấp cứu",requester:"Vũ Minh Tuấn",date:"21/08/2026",status:"Đang xử lý",priority:"Khẩn",lines:8,amount:"67.800.000",rfqIds:[],purpose:"Phục vụ cấp cứu"},
  {id:"PR-PY-2026-000031",name:"Găng tay y tế tháng 9",hospital:"BV TNH Phổ Yên",dept:"Phòng Vật tư",requester:"Trần Văn Minh",date:"20/08/2026",status:"Hoàn tất",priority:"Thấp",lines:3,amount:"45.000.000",rfqIds:[],purpose:"Phục vụ KCB"},
];

const INITIAL_RVS = [
  {id:"RV-TN-2026-0001",name:"Thẩm định PR thuốc tháng 9",prId:"PR-TN-2026-000045",hospital:"BV TNH Thái Nguyên",reviewer:"Trần Thị Mai",date:"26/08/2026",status:"Đang thẩm định",result:"",notes:"Kiểm tra đơn giá so với giá trúng thầu kỳ trước",category:"Dược phẩm",amount:"245.000.000"},
  {id:"RV-VY-2026-0001",name:"Thẩm định TBYT phòng mổ",prId:"PR-VY-2026-000028",hospital:"BV TNH Việt Yên",reviewer:"Nguyễn Văn Đức",date:"24/08/2026",status:"Đạt",result:"Đạt yêu cầu kỹ thuật và ngân sách",notes:"Thiết bị nằm trong danh mục đầu tư 2026",category:"TBYT",amount:"1.250.000.000"},
  {id:"RV-PY-2026-0001",name:"Thẩm định vật tư tiêu hao Q4",prId:"PR-PY-2026-000032",hospital:"BV TNH Phổ Yên",reviewer:"Lê Hoàng Nam",date:"25/08/2026",status:"Đang soạn",result:"",notes:"Chờ bổ sung bảng so sánh giá",category:"Vật tư",amount:"89.500.000"},
  {id:"RV-TN-2026-0002",name:"Thẩm định thuốc cấp cứu khẩn",prId:"PR-TN-2026-000044",hospital:"BV TNH Thái Nguyên",reviewer:"Trần Thị Mai",date:"22/08/2026",status:"Đạt",result:"Đạt — mua khẩn cấp",notes:"Phê duyệt mua khẩn theo quy trình rút gọn",category:"Dược phẩm",amount:"67.800.000"},
];

const INITIAL_SRCS = [
  {id:"SRC-VY-2026-0001",name:"Tìm NCC thiết bị phòng mổ",prId:"PR-VY-2026-000028",hospital:"BV TNH Việt Yên",buyer:"Nguyễn An",date:"24/08/2026",status:"Có NCC",category:"TBYT",vendorsFound:3,vendorIds:["NCC-002","NCC-005"],notes:"Đã xác định 2 NCC đủ điều kiện cung cấp"},
  {id:"SRC-TN-2026-0001",name:"Tìm NCC thuốc kháng sinh",prId:"PR-TN-2026-000045",hospital:"BV TNH Thái Nguyên",buyer:"Nguyễn An",date:"25/08/2026",status:"Hoàn tất",category:"Dược phẩm",vendorsFound:3,vendorIds:["NCC-001","NCC-003","NCC-005"],notes:"Đã gửi RFQ cho 3 NCC"},
  {id:"SRC-LS-2026-0001",name:"Tìm NCC hóa chất xét nghiệm",prId:"PR-LS-2026-000019",hospital:"BV TNH Lạng Sơn",buyer:"Phạm Hương",date:"23/08/2026",status:"Đang tìm nguồn",category:"Hóa chất",vendorsFound:1,vendorIds:["NCC-003"],notes:"Đang liên hệ thêm NCC chuyên hóa chất"},
  {id:"SRC-PY-2026-0001",name:"Tìm NCC vật tư tiêu hao",prId:"PR-PY-2026-000032",hospital:"BV TNH Phổ Yên",buyer:"Nguyễn An",date:"24/08/2026",status:"Đang soạn",category:"Vật tư",vendorsFound:0,vendorIds:[],notes:""},
];

const INITIAL_RFQS = [
  {id:"RFQ-TN-2026-0001",name:"RFQ thuốc kháng sinh Q4/2026",prId:"PR-TN-2026-000045",hospital:"BV TNH Thái Nguyên",buyer:"Nguyễn An",date:"26/08/2026",deadline:"05/09/2026",status:"Đang nhận báo giá",vendorIds:["NCC-001","NCC-003","NCC-005"],qtnIds:["QTN-TN-2026-0001","QTN-TN-2026-0002"],bidId:"BID-2026-0012",lines:15,amount:"245.000.000"},
  {id:"RFQ-VY-2026-0001",name:"RFQ thiết bị phòng mổ",prId:"PR-VY-2026-000028",hospital:"BV TNH Việt Yên",buyer:"Nguyễn An",date:"24/08/2026",deadline:"03/09/2026",status:"Đã gửi",vendorIds:["NCC-002","NCC-005"],qtnIds:["QTN-VY-2026-0001"],bidId:"",lines:5,amount:"1.250.000.000"},
  {id:"RFQ-PY-2026-0001",name:"RFQ vật tư tiêu hao Q4",prId:"",hospital:"BV TNH Phổ Yên",buyer:"Phạm Hương",date:"20/08/2026",deadline:"30/08/2026",status:"Đã đóng",vendorIds:["NCC-001","NCC-004"],qtnIds:["QTN-PY-2026-0001","QTN-PY-2026-0002"],bidId:"",lines:8,amount:"89.500.000"},
  {id:"RFQ-LS-2026-0001",name:"RFQ hóa chất xét nghiệm",prId:"PR-LS-2026-000019",hospital:"BV TNH Lạng Sơn",buyer:"Phạm Hương",date:"18/08/2026",deadline:"28/08/2026",status:"Hoàn tất",vendorIds:["NCC-003"],qtnIds:["QTN-LS-2026-0001"],bidId:"BID-2026-0009",lines:18,amount:"156.000.000"},
];

const INITIAL_QTNS = [
  {id:"QTN-TN-2026-0001",name:"Báo giá thuốc kháng sinh — Dược phẩm HN",rfqId:"RFQ-TN-2026-0001",vendorId:"NCC-001",vendorName:"Công ty CP Dược phẩm Hà Nội",date:"28/08/2026",validity:"27/09/2026",status:"Đã gửi",amount:"210.000.000",lines:15,discount:"3%",delivery:14,notes:""},
  {id:"QTN-TN-2026-0002",name:"Báo giá thuốc kháng sinh — Hóa chất VN",rfqId:"RFQ-TN-2026-0001",vendorId:"NCC-003",vendorName:"Công ty CP Hóa chất Việt Nam",date:"27/08/2026",validity:"26/09/2026",status:"Đã gửi",amount:"225.000.000",lines:15,discount:"2%",delivery:21,notes:""},
  {id:"QTN-VY-2026-0001",name:"Báo giá TBYT phòng mổ — TBYT Medic",rfqId:"RFQ-VY-2026-0001",vendorId:"NCC-002",vendorName:"Công ty TNHH TBYT Quốc Tế Medic",date:"26/08/2026",validity:"25/09/2026",status:"Đang đánh giá",amount:"1.180.000.000",lines:5,discount:"5%",delivery:30,notes:"Bao gồm lắp đặt và đào tạo"},
  {id:"QTN-PY-2026-0001",name:"Báo giá vật tư — Dược phẩm HN",rfqId:"RFQ-PY-2026-0001",vendorId:"NCC-001",vendorName:"Công ty CP Dược phẩm Hà Nội",date:"22/08/2026",validity:"21/09/2026",status:"Chấp nhận",amount:"85.200.000",lines:8,discount:"4%",delivery:10,notes:""},
  {id:"QTN-PY-2026-0002",name:"Báo giá vật tư — VTYT Sài Gòn",rfqId:"RFQ-PY-2026-0001",vendorId:"NCC-004",vendorName:"Công ty TNHH Vật tư Y tế Sài Gòn",date:"23/08/2026",validity:"22/09/2026",status:"Từ chối",amount:"92.100.000",lines:8,discount:"2%",delivery:15,notes:"Giá cao hơn"},
  {id:"QTN-LS-2026-0001",name:"Báo giá hóa chất XN — Hóa chất VN",rfqId:"RFQ-LS-2026-0001",vendorId:"NCC-003",vendorName:"Công ty CP Hóa chất Việt Nam",date:"20/08/2026",validity:"19/09/2026",status:"Chấp nhận",amount:"148.500.000",lines:18,discount:"3%",delivery:14,notes:""},
];

const INITIAL_BIDS = [
  {id:"BID-2026-0012",name:"Đấu thầu thuốc kháng sinh Q4/2026",type:"Đấu thầu rộng rãi",status:"Đang đấu thầu",hospital:"Tập trung 4 BV",openDate:"01/09/2026",closeDate:"15/09/2026",budget:"2.500.000.000",vendors:["NCC-001","NCC-003","NCC-005"],rfqId:"RFQ-TN-2026-0001",awdId:"",lines:32,bidsReceived:2,method:"Niêm phong"},
  {id:"BID-2026-0011",name:"Thiết bị siêu âm Doppler màu",type:"Chào giá cạnh tranh",status:"Đã chấm",hospital:"BV TNH Thái Nguyên",openDate:"10/08/2026",closeDate:"25/08/2026",budget:"850.000.000",vendors:["NCC-002","NCC-005"],rfqId:"",awdId:"AWD-2026-0001",lines:3,bidsReceived:2,method:"Niêm phong",winner:"NCC-002"},
  {id:"BID-2026-0010",name:"Vật tư tiêu hao theo hợp đồng khung",type:"Hợp đồng khung",status:"Chờ mở thầu",hospital:"Tập trung 4 BV",openDate:"28/08/2026",closeDate:"10/09/2026",budget:"1.200.000.000",vendors:["NCC-001","NCC-003","NCC-004"],rfqId:"",awdId:"",lines:45,bidsReceived:3,method:"Niêm phong"},
  {id:"BID-2026-0009",name:"Hóa chất xét nghiệm chuyên dụng",type:"Đấu thầu hạn chế",status:"Đã duyệt",hospital:"BV TNH Việt Yên",openDate:"01/08/2026",closeDate:"15/08/2026",budget:"560.000.000",vendors:["NCC-003"],rfqId:"RFQ-LS-2026-0001",awdId:"AWD-2026-0003",lines:18,bidsReceived:1,method:"Mở ngay",winner:"NCC-003"},
];

const BID_COMPARISON = {
  items:[
    {name:"Amoxicillin 500mg",unit:"Hộp/100v",qty:5000},
    {name:"Cefuroxime 750mg",unit:"Lọ",qty:3000},
    {name:"Metronidazol 500mg",unit:"Hộp/50v",qty:2000},
  ],
  vendors:[
    {id:"NCC-001",name:"Dược phẩm Hà Nội",prices:[42000,185000,38000],delivery:14,warranty:12,tecScore:92,discount:"3%",payment:"30 ngày"},
    {id:"NCC-003",name:"Hóa chất Việt Nam",prices:[45000,178000,41000],delivery:21,warranty:12,tecScore:85,discount:"2%",payment:"45 ngày"},
    {id:"NCC-005",name:"Thiết bị Đông Á",prices:[44500,192000,36500],delivery:10,warranty:18,tecScore:88,discount:"5%",payment:"30 ngày"},
  ],
  weights:{price:40,delivery:20,tecScore:25,warranty:10,discount:5},
};

const INITIAL_TECS = [
  {id:"TEC-2026-0001",name:"Đánh giá KT siêu âm Doppler",bidId:"BID-2026-0011",rfqId:"",hospital:"BV TNH Thái Nguyên",evaluator:"PGS.TS Nguyễn Văn Hùng",date:"20/08/2026",status:"Đạt",category:"TBYT",vendorId:"NCC-002",vendorName:"TBYT Quốc Tế Medic",score:92,maxScore:100,criteria:"Thông số kỹ thuật, tính năng, bảo hành",notes:"Đạt tất cả tiêu chí kỹ thuật bắt buộc"},
  {id:"TEC-2026-0002",name:"Đánh giá KT siêu âm — Đông Á",bidId:"BID-2026-0011",rfqId:"",hospital:"BV TNH Thái Nguyên",evaluator:"PGS.TS Nguyễn Văn Hùng",date:"20/08/2026",status:"Đạt",category:"TBYT",vendorId:"NCC-005",vendorName:"Thiết bị Đông Á",score:85,maxScore:100,criteria:"Thông số kỹ thuật, tính năng, bảo hành",notes:"Đạt nhưng thiếu một số tính năng nâng cao"},
  {id:"TEC-2026-0003",name:"Đánh giá KT hóa chất XN",bidId:"BID-2026-0009",rfqId:"RFQ-LS-2026-0001",hospital:"BV TNH Việt Yên",evaluator:"ThS. Lê Thị Hoa",date:"12/08/2026",status:"Đạt",category:"Hóa chất",vendorId:"NCC-003",vendorName:"Hóa chất Việt Nam",score:88,maxScore:100,criteria:"Chất lượng, tương thích máy, hạn sử dụng",notes:"Hóa chất tương thích với hệ thống Beckman"},
  {id:"TEC-2026-0004",name:"Đánh giá KT thuốc kháng sinh",bidId:"BID-2026-0012",rfqId:"RFQ-TN-2026-0001",hospital:"Tập trung 4 BV",evaluator:"DS. Phạm Minh Châu",date:"28/08/2026",status:"Đang đánh giá",category:"Dược phẩm",vendorId:"NCC-001",vendorName:"Dược phẩm Hà Nội",score:0,maxScore:100,criteria:"Nguồn gốc, GMP, bioequivalence",notes:"Đang chờ kết quả kiểm nghiệm mẫu"},
];

const INITIAL_CMPS = [
  {id:"CMP-2026-0001",name:"So sánh giá siêu âm Doppler",bidId:"BID-2026-0011",rfqId:"",hospital:"BV TNH Thái Nguyên",date:"22/08/2026",status:"Hoàn tất",vendorCount:2,itemCount:3,result:"NCC-002 đạt tổng điểm cao nhất",recommendedVendor:"NCC-002",recommendedVendorName:"TBYT Quốc Tế Medic",totalValue:"850.000.000"},
  {id:"CMP-2026-0002",name:"So sánh giá hóa chất XN",bidId:"BID-2026-0009",rfqId:"RFQ-LS-2026-0001",hospital:"BV TNH Việt Yên",date:"14/08/2026",status:"Hoàn tất",vendorCount:1,itemCount:18,result:"NCC-003 duy nhất đạt yêu cầu",recommendedVendor:"NCC-003",recommendedVendorName:"Hóa chất Việt Nam",totalValue:"560.000.000"},
  {id:"CMP-2026-0003",name:"So sánh giá vật tư tiêu hao",bidId:"",rfqId:"RFQ-PY-2026-0001",hospital:"BV TNH Phổ Yên",date:"25/08/2026",status:"Hoàn tất",vendorCount:2,itemCount:8,result:"NCC-001 giá tốt hơn 8%",recommendedVendor:"NCC-001",recommendedVendorName:"Dược phẩm Hà Nội",totalValue:"85.200.000"},
  {id:"CMP-2026-0004",name:"So sánh giá thuốc kháng sinh Q4",bidId:"BID-2026-0012",rfqId:"RFQ-TN-2026-0001",hospital:"Tập trung 4 BV",date:"28/08/2026",status:"Đang so sánh",vendorCount:3,itemCount:32,result:"",recommendedVendor:"",recommendedVendorName:"",totalValue:"2.500.000.000"},
];

const INITIAL_AWDS = [
  {id:"AWD-2026-0001",name:"Lựa chọn NCC siêu âm Doppler",bidId:"BID-2026-0011",aprId:"APR-2026-0001",vendorId:"NCC-002",vendorName:"Công ty TNHH TBYT Quốc Tế Medic",hospital:"BV TNH Thái Nguyên",date:"23/08/2026",status:"Đã duyệt",amount:"820.000.000",reason:"Đạt điểm kỹ thuật cao nhất (92/100), giá hợp lý",approver:"Giám đốc Nguyễn Minh"},
  {id:"AWD-2026-0002",name:"Lựa chọn NCC vật tư tiêu hao",bidId:"",aprId:"APR-2026-0002",vendorId:"NCC-001",vendorName:"Công ty CP Dược phẩm Hà Nội",hospital:"BV TNH Phổ Yên",date:"26/08/2026",status:"Đã tạo PO",amount:"85.200.000",reason:"Giá tốt nhất, giao hàng nhanh (10 ngày)",approver:"Giám đốc Nguyễn Minh"},
  {id:"AWD-2026-0003",name:"Lựa chọn NCC hóa chất XN",bidId:"BID-2026-0009",aprId:"APR-2026-0003",vendorId:"NCC-003",vendorName:"Công ty CP Hóa chất Việt Nam",hospital:"BV TNH Việt Yên",date:"16/08/2026",status:"Đã tạo PO",amount:"148.500.000",reason:"NCC duy nhất đạt yêu cầu tương thích máy",approver:"Giám đốc Trần Đức"},
];

const INITIAL_APRS = [
  {id:"APR-2026-0001",name:"Phê duyệt chọn NCC siêu âm",sourceType:"AWD",sourceId:"AWD-2026-0001",poId:"PO-TN-2026-000123",hospital:"BV TNH Thái Nguyên",requester:"Nguyễn An",approver:"Giám đốc Nguyễn Minh",date:"23/08/2026",status:"Đã duyệt",amount:"820.000.000",notes:"Đã xác nhận ngân sách và quy trình",level:"Giám đốc",dueDate:"25/08/2026"},
  {id:"APR-2026-0002",name:"Phê duyệt chọn NCC vật tư",sourceType:"AWD",sourceId:"AWD-2026-0002",poId:"",hospital:"BV TNH Phổ Yên",requester:"Nguyễn An",approver:"Trưởng phòng Lê Hải",date:"27/08/2026",status:"Đã duyệt",amount:"85.200.000",notes:"Trong ngân sách, phê duyệt cấp phòng",level:"Trưởng phòng",dueDate:"28/08/2026"},
  {id:"APR-2026-0003",name:"Phê duyệt chọn NCC hóa chất",sourceType:"AWD",sourceId:"AWD-2026-0003",poId:"PO-LS-2026-000075",hospital:"BV TNH Việt Yên",requester:"Phạm Hương",approver:"Giám đốc Trần Đức",date:"17/08/2026",status:"Đã duyệt",amount:"148.500.000",notes:"Phê duyệt theo quy trình đấu thầu hạn chế",level:"Giám đốc",dueDate:"18/08/2026"},
  {id:"APR-2026-0004",name:"Phê duyệt PO thiết bị siêu âm",sourceType:"PO",sourceId:"PO-TN-2026-000123",poId:"PO-TN-2026-000123",hospital:"BV TNH Thái Nguyên",requester:"Nguyễn An",approver:"Giám đốc Nguyễn Minh",date:"20/08/2026",status:"Đã duyệt",amount:"189.500.000",notes:"PO phát hành sau khi GĐ ký",level:"Giám đốc",dueDate:"21/08/2026"},
];

const INITIAL_POS = [
  {id:"PO-TN-2026-000123",vendor:"Công ty CP Dược phẩm Hà Nội",vendorId:"NCC-001",hospital:"BV TNH Thái Nguyên",date:"20/08/2026",status:"NCC xác nhận",amount:"189.500.000",source:"AWD",awdId:"AWD-2026-0001",aprId:"APR-2026-0001",ctrId:"",rcvIds:["RCV-TN-2026-0001"],invIds:["INV-TN-2026-0001"],lines:15},
  {id:"PO-PY-2026-000098",vendor:"Công ty TNHH TBYT Quốc Tế Medic",vendorId:"NCC-002",hospital:"BV TNH Phổ Yên",date:"18/08/2026",status:"Đã phát hành",amount:"456.000.000",source:"CTR",awdId:"",aprId:"",ctrId:"CTR-2026-0001",rcvIds:[],invIds:[],lines:8},
  {id:"PO-VY-2026-000087",vendor:"Công ty CP Hóa chất Việt Nam",vendorId:"NCC-003",hospital:"BV TNH Việt Yên",date:"15/08/2026",status:"Đang soạn",amount:"78.200.000",source:"AWD",awdId:"",aprId:"",ctrId:"",rcvIds:[],invIds:[],lines:6},
  {id:"PO-LS-2026-000075",vendor:"Công ty TNHH Vật tư Y tế Sài Gòn",vendorId:"NCC-004",hospital:"BV TNH Lạng Sơn",date:"12/08/2026",status:"Hoàn tất",amount:"234.000.000",source:"BID",awdId:"AWD-2026-0003",aprId:"APR-2026-0003",ctrId:"",rcvIds:["RCV-LS-2026-0001"],invIds:["INV-LS-2026-0001"],lines:10},
];

const INITIAL_CTRS = [
  {id:"CTR-2026-0001",name:"Hợp đồng cung cấp TBYT 2026",vendorId:"NCC-002",vendorName:"Công ty TNHH TBYT Quốc Tế Medic",hospital:"BV TNH Phổ Yên",signDate:"01/01/2026",startDate:"01/01/2026",endDate:"31/12/2026",status:"Hiệu lực",amount:"2.500.000.000",poIds:["PO-PY-2026-000098"],type:"Hợp đồng khung",terms:"Thanh toán 30 ngày sau giao hàng",notes:"HĐ khung cung cấp TBYT cho BV Phổ Yên"},
  {id:"CTR-2026-0002",name:"Hợp đồng dược phẩm 2026",vendorId:"NCC-001",vendorName:"Công ty CP Dược phẩm Hà Nội",hospital:"Tập trung 4 BV",signDate:"15/01/2026",startDate:"15/01/2026",endDate:"14/01/2027",status:"Hiệu lực",amount:"5.000.000.000",poIds:["PO-TN-2026-000123"],type:"Hợp đồng khung",terms:"Thanh toán 45 ngày",notes:"HĐ khung dược phẩm cho 4 BV"},
  {id:"CTR-2025-0008",name:"Hợp đồng bảo trì TBYT 2025",vendorId:"NCC-005",vendorName:"Công ty CP Thiết bị Đông Á",hospital:"Tập trung 4 BV",signDate:"01/06/2025",startDate:"01/06/2025",endDate:"31/05/2026",status:"Hết hạn",amount:"800.000.000",poIds:[],type:"Hợp đồng dịch vụ",terms:"Thanh toán theo đợt bảo trì",notes:"HĐ bảo trì thiết bị y tế"},
  {id:"CTR-2026-0003",name:"Hợp đồng vật tư tiêu hao",vendorId:"NCC-004",vendorName:"Công ty TNHH Vật tư Y tế Sài Gòn",hospital:"BV TNH Lạng Sơn",signDate:"01/03/2026",startDate:"01/03/2026",endDate:"28/02/2027",status:"Hiệu lực",amount:"1.200.000.000",poIds:["PO-LS-2026-000075"],type:"Hợp đồng khung",terms:"Thanh toán 30 ngày",notes:""},
];

const INITIAL_RCVS = [
  {id:"RCV-TN-2026-0001",name:"Nhận hàng PO thuốc — BV TN",poId:"PO-TN-2026-000123",hospital:"BV TNH Thái Nguyên",receiver:"Nguyễn Thị Hoa",date:"28/08/2026",status:"Nhận đủ",lines:15,receivedLines:15,notes:"Đã kiểm đếm đầy đủ, chuyển nghiệm thu",accId:"ACC-TN-2026-0001",warehouse:"Kho Dược BV Thái Nguyên"},
  {id:"RCV-LS-2026-0001",name:"Nhận hàng PO vật tư — BV LS",poId:"PO-LS-2026-000075",hospital:"BV TNH Lạng Sơn",receiver:"Trần Văn Hùng",date:"20/08/2026",status:"Nhận đủ",lines:10,receivedLines:10,notes:"Nhận đủ 10/10 dòng, chất lượng đạt",accId:"ACC-LS-2026-0001",warehouse:"Kho Vật tư BV Lạng Sơn"},
  {id:"RCV-PY-2026-0001",name:"Nhận hàng đợt 1 TBYT — BV PY",poId:"PO-PY-2026-000098",hospital:"BV TNH Phổ Yên",receiver:"Lê Minh Đức",date:"25/08/2026",status:"Nhận một phần",lines:8,receivedLines:5,notes:"Đã nhận 5/8 dòng, chờ đợt 2",accId:"",warehouse:"Kho TBYT BV Phổ Yên"},
];

const INITIAL_ACCS = [
  {id:"ACC-TN-2026-0001",name:"Nghiệm thu thuốc — BV TN",rcvId:"RCV-TN-2026-0001",poId:"PO-TN-2026-000123",hospital:"BV TNH Thái Nguyên",inspector:"DS. Phạm Minh Châu",date:"28/08/2026",status:"Đạt",result:"Đạt 100% tiêu chí",lines:15,passedLines:15,notes:"Thuốc đạt tiêu chuẩn, đủ hạn sử dụng",invId:"INV-TN-2026-0001"},
  {id:"ACC-LS-2026-0001",name:"Nghiệm thu vật tư — BV LS",rcvId:"RCV-LS-2026-0001",poId:"PO-LS-2026-000075",hospital:"BV TNH Lạng Sơn",inspector:"KTV Nguyễn Hải",date:"22/08/2026",status:"Đạt",result:"Đạt yêu cầu chất lượng",lines:10,passedLines:10,notes:"Vật tư đạt tiêu chuẩn ISO",invId:"INV-LS-2026-0001"},
  {id:"ACC-VY-2026-0001",name:"Nghiệm thu hóa chất — BV VY",rcvId:"",poId:"PO-VY-2026-000087",hospital:"BV TNH Việt Yên",inspector:"ThS. Lê Thị Hoa",date:"26/08/2026",status:"Đang nghiệm thu",result:"",lines:6,passedLines:0,notes:"Đang kiểm tra tương thích với máy XN",invId:""},
];

const INITIAL_INVS = [
  {id:"INV-TN-2026-0001",name:"Hóa đơn thuốc — Dược phẩm HN",poId:"PO-TN-2026-000123",rcvId:"RCV-TN-2026-0001",accId:"ACC-TN-2026-0001",vendorId:"NCC-001",vendorName:"Công ty CP Dược phẩm Hà Nội",hospital:"BV TNH Thái Nguyên",invoiceNo:"HD-2026-0089",date:"28/08/2026",status:"Đang đối chiếu",amount:"170.454.545",vat:"19.045.455",total:"189.500.000",matchPO:true,matchRCV:true,matchACC:true,paymentDate:"",notes:""},
  {id:"INV-LS-2026-0001",name:"Hóa đơn vật tư — VTYT SG",poId:"PO-LS-2026-000075",rcvId:"RCV-LS-2026-0001",accId:"ACC-LS-2026-0001",vendorId:"NCC-004",vendorName:"Công ty TNHH Vật tư Y tế Sài Gòn",hospital:"BV TNH Lạng Sơn",invoiceNo:"HD-2026-0082",date:"22/08/2026",status:"Đã thanh toán",amount:"212.727.273",vat:"21.272.727",total:"234.000.000",matchPO:true,matchRCV:true,matchACC:true,paymentDate:"25/08/2026",notes:"Đã thanh toán chuyển khoản"},
  {id:"INV-PY-2026-0001",name:"Hóa đơn TBYT đợt 1 — Medic",poId:"PO-PY-2026-000098",rcvId:"RCV-PY-2026-0001",accId:"",vendorId:"NCC-002",vendorName:"Công ty TNHH TBYT Quốc Tế Medic",hospital:"BV TNH Phổ Yên",invoiceNo:"HD-2026-0091",date:"27/08/2026",status:"Đang đối chiếu",amount:"280.000.000",vat:"28.000.000",total:"308.000.000",matchPO:true,matchRCV:true,matchACC:false,paymentDate:"",notes:"Chờ nghiệm thu hoàn tất"},
];

const INITIAL_MAINTENANCE = [
  {id:"MNT-TN-001",name:"Máy siêu âm GE Logiq P9",serial:"SN-2024-GE-0091",hospital:"BV TNH Thái Nguyên",dept:"Khoa Chẩn đoán hình ảnh",type:"TBYT",category:"Chẩn đoán",status:"Còn bảo hành",warrantyEnd:"15/03/2027",lastMaint:"01/07/2026",nextMaint:"01/10/2026",maintCycle:90,vendor:"NCC-002",purchaseDate:"15/03/2025",value:"1.200.000.000",condition:"Tốt"},
  {id:"MNT-PY-002",name:"Máy xét nghiệm sinh hóa Beckman AU680",serial:"SN-2023-BK-0045",hospital:"BV TNH Phổ Yên",dept:"Khoa Xét nghiệm",type:"TBYT",category:"Xét nghiệm",status:"Đang bảo trì",warrantyEnd:"20/12/2025",lastMaint:"15/08/2026",nextMaint:"15/11/2026",maintCycle:90,vendor:"NCC-005",purchaseDate:"20/12/2023",value:"2.800.000.000",condition:"Cần sửa chữa"},
  {id:"MNT-VY-003",name:"Máy thở Dräger Savina 300",serial:"SN-2024-DR-0023",hospital:"BV TNH Việt Yên",dept:"Khoa Hồi sức",type:"TBYT",category:"Hồi sức",status:"Còn bảo hành",warrantyEnd:"10/06/2027",lastMaint:"20/06/2026",nextMaint:"20/09/2026",maintCycle:90,vendor:"NCC-002",purchaseDate:"10/06/2025",value:"680.000.000",condition:"Tốt"},
  {id:"MNT-LS-004",name:"Bàn mổ Maquet Magnus",serial:"SN-2022-MQ-0012",hospital:"BV TNH Lạng Sơn",dept:"Khoa Ngoại",type:"TBYT",category:"Phẫu thuật",status:"Hết bảo hành",warrantyEnd:"05/01/2025",lastMaint:"10/05/2026",nextMaint:"10/08/2026",maintCycle:90,vendor:"NCC-005",purchaseDate:"05/01/2023",value:"950.000.000",condition:"Trung bình"},
  {id:"MNT-TN-005",name:"Máy CT Scanner 64 lát cắt",serial:"SN-2023-SI-0008",hospital:"BV TNH Thái Nguyên",dept:"Khoa CĐHA",type:"TBYT",category:"Chẩn đoán",status:"Lên kế hoạch",warrantyEnd:"01/11/2026",lastMaint:"01/03/2026",nextMaint:"01/09/2026",maintCycle:180,vendor:"NCC-002",purchaseDate:"01/11/2023",value:"15.500.000.000",condition:"Tốt"},
  {id:"MNT-PY-006",name:"Hệ thống lọc nước RO",serial:"SN-2024-RO-0003",hospital:"BV TNH Phổ Yên",dept:"Khoa Thận nhân tạo",type:"Hạ tầng",category:"Hạ tầng",status:"Quá hạn",warrantyEnd:"30/06/2026",lastMaint:"15/02/2026",nextMaint:"15/05/2026",maintCycle:90,vendor:"NCC-004",purchaseDate:"01/01/2024",value:"450.000.000",condition:"Cần thay linh kiện"},
];

const INITIAL_MAINT_ORDERS = [
  {id:"WO-2026-031",asset:"MNT-PY-002",name:"Bảo trì định kỳ Beckman AU680",type:"Định kỳ",status:"Đang thực hiện",assignee:"Kỹ thuật viên NCC-005",date:"15/08/2026",priority:"Cao"},
  {id:"WO-2026-030",asset:"MNT-TN-005",name:"Bảo dưỡng CT Scanner 64 lát cắt",type:"Định kỳ",status:"Lên kế hoạch",assignee:"Kỹ thuật viên NCC-002",date:"01/09/2026",priority:"Cao"},
  {id:"WO-2026-029",asset:"MNT-PY-006",name:"Thay màng lọc RO + vệ sinh hệ thống",type:"Sửa chữa",status:"Quá hạn",assignee:"Chưa phân công",date:"15/05/2026",priority:"Khẩn"},
  {id:"WO-2026-028",asset:"MNT-LS-004",name:"Kiểm tra thủy lực bàn mổ Maquet",type:"Khắc phục",status:"Hoàn tất",assignee:"Kỹ thuật viên NCC-005",date:"10/05/2026",priority:"Trung bình"},
];

// ==================== MAIN APP ====================
export default function TNHProcurement() {
  const [sidebar, setSidebar] = useState(true);
  const [mod, setMod] = useState("dashboard");
  const [view, setView] = useState("list");
  const [rec, setRec] = useState(null);
  const [groups, setGroups] = useState(MENU_GROUPS.map(g=>g.label));
  const [search, setSearch] = useState("");
  const [portalTab, setPortalTab] = useState("home");
  const [bidTab, setBidTab] = useState("list");
  const [bidDetail, setBidDetail] = useState(null);
  const [mntTab, setMntTab] = useState("assets");
  const [mntDetail, setMntDetail] = useState(null);
  const [portalBidding, setPortalBidding] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [viewPrefs, setViewPrefs] = useState({});
  const [editForm, setEditForm] = useState(null);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterHospital, setFilterHospital] = useState("");

  // ========== DATA STATE ==========
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [prs, setPrs] = useState(INITIAL_PRS);
  const [rvs, setRvs] = useState(INITIAL_RVS);
  const [srcs, setSrcs] = useState(INITIAL_SRCS);
  const [rfqs, setRfqs] = useState(INITIAL_RFQS);
  const [qtns, setQtns] = useState(INITIAL_QTNS);
  const [bids, setBids] = useState(INITIAL_BIDS);
  const [tecs, setTecs] = useState(INITIAL_TECS);
  const [cmps, setCmps] = useState(INITIAL_CMPS);
  const [awds, setAwds] = useState(INITIAL_AWDS);
  const [aprs, setAprs] = useState(INITIAL_APRS);
  const [pos, setPos] = useState(INITIAL_POS);
  const [ctrs, setCtrs] = useState(INITIAL_CTRS);
  const [rcvs, setRcvs] = useState(INITIAL_RCVS);
  const [accs, setAccs] = useState(INITIAL_ACCS);
  const [invs, setInvs] = useState(INITIAL_INVS);
  const [maintenance, setMaintenance] = useState(INITIAL_MAINTENANCE);
  const [maintOrders, setMaintOrders] = useState(INITIAL_MAINT_ORDERS);

  const seqRef = useRef(1000);
  const genSeq = () => { seqRef.current++; return seqRef.current; };
  const genId = (prefix, hospital) => {
    const hc = H_CODES[hospital] || "XX";
    return `${prefix}-${hc}-2026-${String(genSeq()).padStart(6,"0")}`;
  };
  const genIdSimple = (prefix) => `${prefix}-2026-${String(genSeq()).padStart(4,"0")}`;
  const today = () => { const d = new Date(); return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`; };

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null), 3000); };

  const getDataAndSetter = (m) => {
    const map = { PR:[prs,setPrs], RV:[rvs,setRvs], SRC:[srcs,setSrcs], RFQ:[rfqs,setRfqs], QTN:[qtns,setQtns], BID:[bids,setBids], TEC:[tecs,setTecs], CMP:[cmps,setCmps], AWD:[awds,setAwds], APR:[aprs,setAprs], PO:[pos,setPos], CTR:[ctrs,setCtrs], RCV:[rcvs,setRcvs], ACC:[accs,setAccs], INV:[invs,setInvs], VEN:[vendors,setVendors] };
    return map[m] || [[], ()=>{}];
  };

  const getModuleCount = (m) => {
    const [data] = getDataAndSetter(m);
    return data.length || undefined;
  };

  const updateRecord = (module, id, updates) => {
    const [, setter] = getDataAndSetter(module);
    setter(prev => prev.map(r => r.id === id ? {...r, ...updates} : r));
  };

  const addRecord = (module, record) => {
    const [, setter] = getDataAndSetter(module);
    setter(prev => [record, ...prev]);
  };

  const cur = MODULES[mod];
  const nav = useCallback((m,r=null) => {
    setMod(m); setRec(r); setView(r?"form":"list"); setBidDetail(null); setMntDetail(null); setEditForm(null);
    setFilterOpen(false); setSortCol(null);
  },[]);
  const toggleG = l => setGroups(p=>p.includes(l)?p.filter(x=>x!==l):[...p,l]);

  // ========== RESET ==========
  const resetAllData = () => {
    setVendors(INITIAL_VENDORS); setPrs(INITIAL_PRS); setRvs(INITIAL_RVS); setSrcs(INITIAL_SRCS);
    setRfqs(INITIAL_RFQS); setQtns(INITIAL_QTNS); setBids(INITIAL_BIDS); setTecs(INITIAL_TECS);
    setCmps(INITIAL_CMPS); setAwds(INITIAL_AWDS); setAprs(INITIAL_APRS); setPos(INITIAL_POS);
    setCtrs(INITIAL_CTRS); setRcvs(INITIAL_RCVS); setAccs(INITIAL_ACCS); setInvs(INITIAL_INVS);
    setMaintenance(INITIAL_MAINTENANCE); setMaintOrders(INITIAL_MAINT_ORDERS);
    nav("dashboard");
    showToast("Đã khôi phục dữ liệu mẫu thành công");
  };

  // ========== CREATE NEW RECORD ==========
  const createNewRecord = (module) => {
    const hospital = HOSPITALS[0];
    const d = today();
    let newRec;
    switch(module) {
      case "PR": newRec = {id:genId("PR",hospital),name:"",hospital,dept:"",requester:"Nguyễn An",date:d,status:"Đang soạn",priority:"Trung bình",lines:0,amount:"0",rfqIds:[],purpose:""}; break;
      case "RV": newRec = {id:genId("RV",hospital),name:"",prId:"",hospital,reviewer:"",date:d,status:"Đang soạn",result:"",notes:"",category:"",amount:""}; break;
      case "SRC": newRec = {id:genId("SRC",hospital),name:"",prId:"",hospital,buyer:"Nguyễn An",date:d,status:"Đang soạn",category:"",vendorsFound:0,vendorIds:[],notes:""}; break;
      case "RFQ": newRec = {id:genId("RFQ",hospital),name:"",prId:"",hospital,buyer:"Nguyễn An",date:d,deadline:"",status:"Đang soạn",vendorIds:[],qtnIds:[],bidId:"",lines:0,amount:""}; break;
      case "QTN": newRec = {id:genId("QTN",hospital),name:"",rfqId:"",vendorId:"",vendorName:"",date:d,validity:"",status:"Đang soạn",amount:"",lines:0,discount:"",delivery:0,notes:""}; break;
      case "BID": newRec = {id:genIdSimple("BID"),name:"",type:"Đấu thầu rộng rãi",status:"Đang soạn",hospital,openDate:"",closeDate:"",budget:"",vendors:[],rfqId:"",awdId:"",lines:0,bidsReceived:0,method:"Niêm phong"}; break;
      case "TEC": newRec = {id:genIdSimple("TEC"),name:"",bidId:"",rfqId:"",hospital,evaluator:"",date:d,status:"Đang soạn",category:"",vendorId:"",vendorName:"",score:0,maxScore:100,criteria:"",notes:""}; break;
      case "CMP": newRec = {id:genIdSimple("CMP"),name:"",bidId:"",rfqId:"",hospital,date:d,status:"Đang soạn",vendorCount:0,itemCount:0,result:"",recommendedVendor:"",recommendedVendorName:"",totalValue:""}; break;
      case "AWD": newRec = {id:genIdSimple("AWD"),name:"",bidId:"",aprId:"",vendorId:"",vendorName:"",hospital,date:d,status:"Đang soạn",amount:"",reason:"",approver:""}; break;
      case "APR": newRec = {id:genIdSimple("APR"),name:"",sourceType:"",sourceId:"",poId:"",hospital,requester:"Nguyễn An",approver:"",date:d,status:"Chờ duyệt",amount:"",notes:"",level:"",dueDate:""}; break;
      case "PO": newRec = {id:genId("PO",hospital),vendor:"",vendorId:"",hospital,date:d,status:"Đang soạn",amount:"0",source:"",awdId:"",aprId:"",ctrId:"",rcvIds:[],invIds:[],lines:0}; break;
      case "CTR": newRec = {id:genIdSimple("CTR"),name:"",vendorId:"",vendorName:"",hospital,signDate:"",startDate:"",endDate:"",status:"Đang soạn",amount:"",poIds:[],type:"Hợp đồng khung",terms:"",notes:""}; break;
      case "RCV": newRec = {id:genId("RCV",hospital),name:"",poId:"",hospital,receiver:"",date:d,status:"Đang soạn",lines:0,receivedLines:0,notes:"",accId:"",warehouse:""}; break;
      case "ACC": newRec = {id:genId("ACC",hospital),name:"",rcvId:"",poId:"",hospital,inspector:"",date:d,status:"Đang soạn",result:"",lines:0,passedLines:0,notes:"",invId:""}; break;
      case "INV": newRec = {id:genId("INV",hospital),name:"",poId:"",rcvId:"",accId:"",vendorId:"",vendorName:"",hospital,invoiceNo:"",date:d,status:"Đang soạn",amount:"",vat:"",total:"",matchPO:false,matchRCV:false,matchACC:false,paymentDate:"",notes:""}; break;
      case "VEN": newRec = {id:`NCC-${String(genSeq()).padStart(3,"0")}`,name:"",tax:"",status:"Đang đăng ký",group:"",rating:0,contracts:0,pos:0,email:"",phone:"",addr:"",portal:false}; break;
      default: return;
    }
    addRecord(module, newRec);
    nav(module, newRec);
    setEditForm({...newRec});
    showToast(`Đã tạo ${module} mới: ${newRec.id}`);
  };

  // ========== FLOW ACTIONS ==========
  const createRFQFromPR = (pr) => {
    const rfqId = genId("RFQ", pr.hospital);
    const newRFQ = {id:rfqId,name:`RFQ từ ${pr.id} — ${pr.name}`,prId:pr.id,hospital:pr.hospital,buyer:"Nguyễn An",date:today(),deadline:"",status:"Đang soạn",vendorIds:[],qtnIds:[],bidId:"",lines:pr.lines,amount:pr.amount};
    addRecord("RFQ", newRFQ);
    updateRecord("PR", pr.id, {rfqIds:[...(pr.rfqIds||[]),rfqId]});
    nav("RFQ", newRFQ);
    setEditForm({...newRFQ});
    showToast(`Đã tạo RFQ ${rfqId} từ ${pr.id}`);
  };

  const createBIDFromRFQ = (rfq) => {
    const bidId = genIdSimple("BID");
    const newBID = {id:bidId,name:`Đấu thầu — ${rfq.name}`,type:"Đấu thầu rộng rãi",status:"Đang soạn",hospital:rfq.hospital,openDate:"",closeDate:"",budget:rfq.amount,vendors:rfq.vendorIds||[],rfqId:rfq.id,awdId:"",lines:rfq.lines,bidsReceived:0,method:"Niêm phong"};
    addRecord("BID", newBID);
    updateRecord("RFQ", rfq.id, {bidId});
    nav("BID"); setBidDetail(newBID);
    showToast(`Đã tạo gói thầu ${bidId} từ ${rfq.id}`);
  };

  const createAWDFromBID = (bid, winnerId) => {
    const winner = vendors.find(v=>v.id===winnerId);
    if(!winner) return;
    const awdId = genIdSimple("AWD");
    const newAWD = {id:awdId,name:`Lựa chọn NCC — ${bid.name}`,bidId:bid.id,aprId:"",vendorId:winnerId,vendorName:winner.name,hospital:bid.hospital,date:today(),status:"Đang soạn",amount:bid.budget,reason:"Đạt điểm tổng hợp cao nhất",approver:""};
    addRecord("AWD", newAWD);
    updateRecord("BID", bid.id, {awdId});
    nav("AWD", newAWD);
    setEditForm({...newAWD});
    showToast(`Đã tạo AWD ${awdId} — NCC: ${winner.name}`);
  };

  const createAPRFromAWD = (awd) => {
    const aprId = genIdSimple("APR");
    const newAPR = {id:aprId,name:`Phê duyệt — ${awd.name}`,sourceType:"AWD",sourceId:awd.id,poId:"",hospital:awd.hospital,requester:"Nguyễn An",approver:"",date:today(),status:"Chờ duyệt",amount:awd.amount,notes:"",level:"",dueDate:""};
    addRecord("APR", newAPR);
    updateRecord("AWD", awd.id, {aprId,status:"Chờ duyệt"});
    nav("APR", newAPR);
    setEditForm({...newAPR});
    showToast(`Đã gửi phê duyệt ${aprId}`);
  };

  const approvePRAndCreatePO = (apr) => {
    const awd = awds.find(a=>a.id===apr.sourceId);
    if(!awd) { showToast("Không tìm thấy AWD nguồn","error"); return; }
    const poId = genId("PO", apr.hospital);
    const newPO = {id:poId,vendor:awd.vendorName,vendorId:awd.vendorId,hospital:apr.hospital,date:today(),status:"Đang soạn",amount:apr.amount,source:"AWD",awdId:awd.id,aprId:apr.id,ctrId:"",rcvIds:[],invIds:[],lines:0};
    addRecord("PO", newPO);
    updateRecord("APR", apr.id, {status:"Đã duyệt",poId});
    updateRecord("AWD", awd.id, {status:"Đã tạo PO"});
    nav("PO", newPO);
    setEditForm({...newPO});
    showToast(`Đã duyệt và tạo PO ${poId}`);
  };

  const publishPO = (po) => {
    updateRecord("PO", po.id, {status:"Đã phát hành"});
    setRec(prev => ({...prev, status:"Đã phát hành"}));
    showToast(`PO ${po.id} đã phát hành`);
  };

  const createRCVFromPO = (po) => {
    const rcvId = genId("RCV", po.hospital);
    const newRCV = {id:rcvId,name:`Phiếu nhận hàng — ${po.id}`,poId:po.id,hospital:po.hospital,receiver:"",date:today(),status:"Đang soạn",lines:po.lines,receivedLines:0,notes:"",accId:"",warehouse:""};
    addRecord("RCV", newRCV);
    updateRecord("PO", po.id, {rcvIds:[...(po.rcvIds||[]),rcvId]});
    nav("RCV", newRCV);
    setEditForm({...newRCV});
    showToast(`Đã tạo phiếu nhận hàng ${rcvId}`);
  };

  const createACCFromRCV = (rcv) => {
    const accId = genId("ACC", rcv.hospital);
    const newACC = {id:accId,name:`Nghiệm thu — ${rcv.poId}`,rcvId:rcv.id,poId:rcv.poId,hospital:rcv.hospital,inspector:"",date:today(),status:"Đang soạn",result:"",lines:rcv.lines,passedLines:0,notes:"",invId:""};
    addRecord("ACC", newACC);
    updateRecord("RCV", rcv.id, {accId});
    nav("ACC", newACC);
    setEditForm({...newACC});
    showToast(`Đã tạo phiếu nghiệm thu ${accId}`);
  };

  const createINVFromACC = (acc) => {
    const po = pos.find(p=>p.id===acc.poId);
    const invId = genId("INV", acc.hospital);
    const newINV = {id:invId,name:`Hóa đơn — ${acc.poId}`,poId:acc.poId,rcvId:acc.rcvId,accId:acc.id,vendorId:po?.vendorId||"",vendorName:po?.vendor||"",hospital:acc.hospital,invoiceNo:"",date:today(),status:"Đang soạn",amount:"",vat:"",total:"",matchPO:!!po,matchRCV:!!acc.rcvId,matchACC:true,paymentDate:"",notes:""};
    addRecord("INV", newINV);
    updateRecord("ACC", acc.id, {invId});
    nav("INV", newINV);
    setEditForm({...newINV});
    showToast(`Đã tạo hóa đơn ${invId}`);
  };

  const createWOFromMNT = (mnt) => {
    const woId = `WO-2026-${String(genSeq()).padStart(3,"0")}`;
    const newWO = {id:woId,asset:mnt.id,name:`Bảo trì — ${mnt.name}`,type:"Định kỳ",status:"Lên kế hoạch",assignee:"Chưa phân công",date:today(),priority:"Trung bình"};
    setMaintOrders(prev => [newWO, ...prev]);
    showToast(`Đã tạo lệnh bảo trì ${woId}`);
  };

  const createPRFromMNT = (mnt) => {
    const prId = genId("PR", mnt.hospital);
    const newPR = {id:prId,name:`PR gia hạn bảo hành — ${mnt.name}`,hospital:mnt.hospital,dept:mnt.dept,requester:"Nguyễn An",date:today(),status:"Đang soạn",priority:"Cao",lines:1,amount:mnt.value,rfqIds:[],purpose:"Gia hạn bảo hành thiết bị"};
    addRecord("PR", newPR);
    nav("PR", newPR);
    setEditForm({...newPR});
    showToast(`Đã tạo PR ${prId} gia hạn bảo hành`);
  };

  // ========== PORTAL ACTIONS ==========
  const portalSubmitQuote = (rfqId) => {
    const qtnId = genId("QTN", "BV TNH Thái Nguyên");
    const newQTN = {id:qtnId,name:`Báo giá từ NCC — ${rfqId}`,rfqId,vendorId:"NCC-001",vendorName:"Công ty CP Dược phẩm Hà Nội",date:today(),validity:"",status:"Đã gửi",amount:"",lines:0,discount:"",delivery:0,notes:"Gửi qua Cổng NCC"};
    addRecord("QTN", newQTN);
    setRfqs(prev => prev.map(r => r.id===rfqId ? {...r, qtnIds:[...(r.qtnIds||[]),qtnId]} : r));
    showToast(`Đã gửi báo giá ${qtnId} cho ${rfqId}`);
  };

  const portalConfirmPO = (poId) => {
    updateRecord("PO", poId, {status:"NCC xác nhận"});
    showToast(`PO ${poId} đã được NCC xác nhận`);
  };

  const portalNotifyDelivery = (poId) => {
    const po = pos.find(p=>p.id===poId);
    if(!po) return;
    const rcvId = genId("RCV", po.hospital);
    const newRCV = {id:rcvId,name:`NCC thông báo giao — ${poId}`,poId,hospital:po.hospital,receiver:"",date:today(),status:"Đang giao",lines:po.lines,receivedLines:0,notes:"NCC thông báo qua Cổng",accId:"",warehouse:""};
    addRecord("RCV", newRCV);
    updateRecord("PO", poId, {rcvIds:[...(po.rcvIds||[]),rcvId]});
    showToast(`NCC đã thông báo giao hàng — RCV ${rcvId}`);
  };

  const portalSubmitInvoice = (poId) => {
    const po = pos.find(p=>p.id===poId);
    if(!po) return;
    const invId = genId("INV", po.hospital);
    const newINV = {id:invId,name:`Hóa đơn NCC — ${poId}`,poId,rcvId:"",accId:"",vendorId:po.vendorId,vendorName:po.vendor,hospital:po.hospital,invoiceNo:"",date:today(),status:"Đang soạn",amount:"",vat:"",total:"",matchPO:true,matchRCV:false,matchACC:false,paymentDate:"",notes:"Nộp qua Cổng NCC"};
    addRecord("INV", newINV);
    updateRecord("PO", poId, {invIds:[...(po.invIds||[]),invId]});
    showToast(`NCC đã nộp hóa đơn — INV ${invId}`);
  };

  // ========== FORM SAVE/CANCEL ==========
  const saveForm = () => {
    if(!editForm || !rec) return;
    const [, setter] = getDataAndSetter(mod);
    setter(prev => prev.map(r => r.id === editForm.id ? {...editForm} : r));
    setRec({...editForm});
    setEditForm(null);
    showToast(`Đã lưu ${editForm.id}`);
  };

  const cancelForm = () => {
    setEditForm(null);
    if(rec) nav(mod);
  };

  const submitForApproval = () => {
    if(!rec) return;
    const sts = MODULE_STATUSES[mod];
    if(!sts) return;
    let nextStatus = "";
    if(mod === "PR") nextStatus = "Chờ xác nhận";
    else if(mod === "AWD") nextStatus = "Chờ duyệt";
    else if(mod === "RFQ") nextStatus = "Đã gửi";
    else nextStatus = sts[1] || rec.status;
    updateRecord(mod, rec.id, {status:nextStatus});
    setRec(prev => ({...prev, status:nextStatus}));
    showToast(`${rec.id} — Trạng thái: ${nextStatus}`);
  };

  // ==================== SIDEBAR ====================
  const Sidebar2 = () => (
    <div style={{width:sidebar?236:0,minHeight:"100vh",background:"#1B1B2F",color:"#ccc",transition:"width .2s",overflow:"hidden",flexShrink:0,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"10px 14px",borderBottom:"1px solid #2E2E4A",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:34,height:34,borderRadius:8,background:"linear-gradient(135deg,#714B67,#9b59b6)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:12}}>TNH</div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#fff"}}>TNH Procurement</div><div style={{fontSize:10,color:"#777"}}>Quản trị Mua sắm v2.1</div></div>
      </div>
      <div onClick={()=>nav("dashboard")} style={{padding:"8px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontSize:13,background:mod==="dashboard"?"#714B67":"transparent",color:mod==="dashboard"?"#fff":"#ccc",margin:"4px 6px",borderRadius:4,transition:".1s"}}
        onMouseEnter={e=>{if(mod!=="dashboard")e.currentTarget.style.background="#2E2E4A"}} onMouseLeave={e=>{if(mod!=="dashboard")e.currentTarget.style.background="transparent"}}>
        <Home size={15}/> Tổng quan
      </div>
      <div style={{flex:1,overflowY:"auto",paddingBottom:12}}>
        {MENU_GROUPS.map(g=>(
          <div key={g.label}>
            <div onClick={()=>toggleG(g.label)} style={{padding:"6px 14px",fontSize:10,fontWeight:700,color:"#666",letterSpacing:1,cursor:"pointer",display:"flex",justifyContent:"space-between",marginTop:8}}>
              {g.label}<ChevronDown size={10} style={{transform:groups.includes(g.label)?"rotate(0)":"rotate(-90deg)",transition:".15s"}}/>
            </div>
            {groups.includes(g.label) && g.items.map(id=>{
              const m=MODULES[id]; if(!m) return null; const I=m.icon; const a=mod===id;
              const cnt = getModuleCount(id);
              return <div key={id} onClick={()=>nav(id)} style={{padding:"6px 14px 6px 26px",cursor:"pointer",display:"flex",alignItems:"center",gap:9,fontSize:12.5,background:a?"#714B67":"transparent",color:a?"#fff":"#bbb",margin:"1px 6px",borderRadius:4,transition:".1s"}}
                onMouseEnter={e=>{if(!a)e.currentTarget.style.background="#2E2E4A"}} onMouseLeave={e=>{if(!a)e.currentTarget.style.background="transparent"}}>
                <I size={14}/><span style={{flex:1}}>{m.name}</span>
                {cnt>0&&<span style={{fontSize:10,background:a?"rgba(255,255,255,.2)":"#2E2E4A",padding:"1px 6px",borderRadius:8,minWidth:16,textAlign:"center"}}>{cnt}</span>}
              </div>;
            })}
          </div>
        ))}
      </div>
      {/* Reset button */}
      <div onClick={()=>setConfirmDialog({title:"Khôi phục dữ liệu mẫu",message:"Bạn có chắc muốn khôi phục dữ liệu mẫu? Tất cả thay đổi sẽ mất.",onConfirm:resetAllData})} style={{padding:"8px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontSize:11,color:"#999",borderTop:"1px solid #2E2E4A",transition:".1s"}}
        onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="#999"}>
        <RotateCcw size={13}/> Reset dữ liệu
      </div>
      <div style={{padding:"10px 14px",borderTop:"1px solid #2E2E4A",display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:"#714B67",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600}}>NA</div>
        <div><div style={{fontSize:11,color:"#fff"}}>Nguyễn An</div><div style={{fontSize:9,color:"#777"}}>Quản lý Mua sắm</div></div>
      </div>
    </div>
  );

  // ==================== TOP BAR ====================
  const TopBar = () => (
    <div style={{height:44,background:"#714B67",display:"flex",alignItems:"center",padding:"0 14px",gap:10,color:"#fff",flexShrink:0}}>
      <button onClick={()=>setSidebar(!sidebar)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",padding:4,display:"flex"}}><Menu size={18}/></button>
      <div style={{display:"flex",alignItems:"center",gap:5,fontSize:13,flex:1}}>
        {rec&&<><span onClick={()=>nav(mod)} style={{cursor:"pointer",opacity:.8}}>{cur?.name}</span><ChevronRight size={13}/></>}
        <span style={{fontWeight:600}}>{rec?(rec.id||rec.name):cur?.name}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,.15)",borderRadius:4,padding:"3px 10px"}}>
        <Search size={13}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm kiếm..." style={{background:"none",border:"none",color:"#fff",fontSize:12,width:140,outline:"none"}}/>
      </div>
      <div style={{position:"relative"}}><Bell size={16} style={{cursor:"pointer"}}/><div style={{position:"absolute",top:-4,right:-4,width:15,height:15,borderRadius:"50%",background:"#E9573F",fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{aprs.filter(a=>a.status==="Chờ duyệt").length||0}</div></div>
      <select style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",fontSize:11,padding:"3px 6px",borderRadius:4}}>
        <option style={{color:"#333"}}>Tất cả bệnh viện</option>
        {HOSPITALS.map(h=><option key={h} style={{color:"#333"}}>{h}</option>)}
      </select>
    </div>
  );

  // ==================== CONTROL PANEL ====================
  const CtrlPanel = ({count,extra,module}) => {
    const m = module || mod;
    const currentView = viewPrefs[m] || view;
    return (
    <div style={{padding:"8px 16px",background:"#fff",borderBottom:"1px solid #e0e0e0",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",position:"relative"}}>
      <button onClick={()=>createNewRecord(m)} style={{background:"#714B67",color:"#fff",border:"none",padding:"5px 14px",borderRadius:4,fontSize:12,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Plus size={13}/> Tạo mới</button>
      <div style={{position:"relative"}}>
        <div onClick={()=>setFilterOpen(!filterOpen)} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",border:"1px solid #ddd",borderRadius:4,fontSize:12,cursor:"pointer",color:"#555",background:filterStatus||filterHospital?"#f0e8ee":"#fff"}}><Filter size={12}/> Bộ lọc <ChevronDown size={10}/></div>
        {filterOpen&&<div style={{position:"absolute",top:"100%",left:0,background:"#fff",border:"1px solid #ddd",borderRadius:4,padding:10,zIndex:20,minWidth:200,boxShadow:"0 4px 12px rgba(0,0,0,.1)"}}>
          <div style={{fontSize:11,fontWeight:600,marginBottom:6}}>Trạng thái</div>
          <select value={filterStatus} onChange={e=>{setFilterStatus(e.target.value);}} style={{width:"100%",padding:"4px 6px",border:"1px solid #ddd",borderRadius:3,fontSize:11,marginBottom:8}}>
            <option value="">Tất cả</option>
            {(MODULE_STATUSES[m]||[]).map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <div style={{fontSize:11,fontWeight:600,marginBottom:6}}>Bệnh viện</div>
          <select value={filterHospital} onChange={e=>{setFilterHospital(e.target.value);}} style={{width:"100%",padding:"4px 6px",border:"1px solid #ddd",borderRadius:3,fontSize:11,marginBottom:8}}>
            <option value="">Tất cả</option>
            {HOSPITALS.map(h=><option key={h} value={h}>{h}</option>)}
          </select>
          <div style={{display:"flex",gap:4}}>
            <button onClick={()=>{setFilterStatus("");setFilterHospital("");setFilterOpen(false);}} style={{padding:"3px 8px",border:"1px solid #ddd",borderRadius:3,fontSize:10,cursor:"pointer",background:"#fff"}}>Xóa lọc</button>
            <button onClick={()=>setFilterOpen(false)} style={{padding:"3px 8px",border:"none",borderRadius:3,fontSize:10,cursor:"pointer",background:"#714B67",color:"#fff"}}>Đóng</button>
          </div>
        </div>}
      </div>
      {extra}
      <div style={{flex:1}}/>
      {count!=null&&<span style={{fontSize:12,color:"#888"}}>{count} bản ghi</span>}
      <div style={{display:"flex",border:"1px solid #ddd",borderRadius:4,overflow:"hidden"}}>
        {[["list",List],["kanban",LayoutGrid]].map(([v,I])=><button key={v} onClick={()=>{setView(v);setViewPrefs(p=>({...p,[m]:v}));}} style={{padding:"3px 7px",border:"none",background:currentView===v?"#714B67":"#fff",color:currentView===v?"#fff":"#666",cursor:"pointer"}}><I size={14}/></button>)}
      </div>
    </div>
  );};

  // ==================== TABLE COMPONENT ====================
  const Table = ({data,cols,onRow}) => {
    const [selAll, setSelAll] = useState(false);
    let sorted = [...data];
    if(sortCol) {
      sorted.sort((a,b)=>{
        const va = a[sortCol]||"", vb = b[sortCol]||"";
        const cmp = typeof va==="number" ? va-vb : String(va).localeCompare(String(vb));
        return sortDir==="asc"?cmp:-cmp;
      });
    }
    const filtered = sorted.filter(r=>{
      if(filterStatus && r.status !== filterStatus) return false;
      if(filterHospital && r.hospital !== filterHospital) return false;
      if(search) {
        const s = search.toLowerCase();
        return Object.values(r).some(v => String(v).toLowerCase().includes(s));
      }
      return true;
    });
    return (
    <div style={{flex:1,overflowY:"auto",overflowX:"auto",background:"#fff"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:600}}>
        <thead><tr style={{background:"#f8f9fa",position:"sticky",top:0,zIndex:1}}>
          <th style={{padding:"7px 10px",width:28}}><input type="checkbox" checked={selAll} onChange={()=>setSelAll(!selAll)}/></th>
          {cols.map(c=><th key={c.k} onClick={()=>{setSortCol(c.k);setSortDir(sortCol===c.k&&sortDir==="asc"?"desc":"asc");}} style={{padding:"7px 10px",textAlign:c.align||"left",fontWeight:600,color:"#555",borderBottom:"2px solid #dee2e6",whiteSpace:"nowrap",cursor:"pointer",userSelect:"none"}}>{c.label}{sortCol===c.k&&<span style={{marginLeft:3,fontSize:9}}>{sortDir==="asc"?"▲":"▼"}</span>}</th>)}
        </tr></thead>
        <tbody>{filtered.length===0?<tr><td colSpan={cols.length+1} style={{padding:30,textAlign:"center",color:"#aaa"}}>Không có dữ liệu</td></tr>:filtered.map((r,i)=>(
          <tr key={r.id||i} onClick={()=>onRow?.(r)} style={{cursor:"pointer",borderBottom:"1px solid #f0f0f0"}} onMouseEnter={e=>e.currentTarget.style.background="#faf8f9"} onMouseLeave={e=>e.currentTarget.style.background=""}>
            <td style={{padding:"7px 10px"}}><input type="checkbox" checked={selAll} onClick={e=>e.stopPropagation()} readOnly/></td>
            {cols.map(c=><td key={c.k} style={{padding:"7px 10px",textAlign:c.align||"left"}}>{c.render?c.render(r[c.k],r):r[c.k]}</td>)}
          </tr>
        ))}</tbody>
      </table>
      {filtered.length>0&&<div style={{padding:"6px 16px",fontSize:11,color:"#888",borderTop:"1px solid #f0f0f0",background:"#fafafa"}}>1-{filtered.length} / {data.length} bản ghi</div>}
    </div>
  );};

  // ==================== KANBAN ====================
  const Kanban = ({data,groupBy="status",onCard}) => {
    const filtered = data.filter(r=>{
      if(filterStatus && r.status !== filterStatus) return false;
      if(filterHospital && r.hospital !== filterHospital) return false;
      return true;
    });
    const g={}; filtered.forEach(d=>{const k=d[groupBy]||"—"; if(!g[k])g[k]=[]; g[k].push(d);});
    return <div style={{flex:1,overflowX:"auto",padding:"14px 16px"}}><div style={{display:"flex",gap:10,minHeight:400}}>
      {Object.entries(g).map(([k,items])=>(
        <div key={k} style={{minWidth:240,flex:1}}>
          <div style={{padding:"6px 10px",fontSize:12,fontWeight:600,color:"#555",marginBottom:6,display:"flex",justifyContent:"space-between"}}><span>{k}</span><span style={{fontSize:10,background:"#f0f0f0",padding:"1px 6px",borderRadius:8}}>{items.length}</span></div>
          {items.map(item=>(
            <div key={item.id} onClick={()=>onCard?.(item)} style={{background:"#fff",borderRadius:4,padding:10,border:"1px solid #e0e0e0",cursor:"pointer",marginBottom:6,transition:"box-shadow .15s"}} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.08)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
              <div style={{fontSize:12,fontWeight:600,color:"#714B67",marginBottom:3}}>{item.id}</div>
              <div style={{fontSize:11,color:"#666",marginBottom:4}}>{item.name||item.vendor||""}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <Badge s={item.status} size="xs"/>
                {item.amount&&<span style={{fontSize:11,fontWeight:600}}>{item.amount} ₫</span>}
              </div>
              {item.hospital&&<div style={{fontSize:10,color:"#aaa",marginTop:3}}>{item.hospital.replace("BV TNH ","")}</div>}
            </div>
          ))}
        </div>
      ))}
    </div></div>;
  };

  // ==================== FORM VIEW ====================
  const FormView = ({record,fields,statuses,actions,tabs,crossRefs}) => {
    const editing = editForm && editForm.id === record.id;
    const formData = editing ? editForm : record;
    const setField = (key, val) => { if(editing) setEditForm(prev => ({...prev, [key]:val})); };
    return (
    <div style={{flex:1,overflowY:"auto",background:"#f0eff4"}}>
      <div style={{maxWidth:960,margin:"0 auto",padding:"14px 18px"}}>
        {statuses&&<div style={{display:"flex",gap:0,background:"#f8f9fa",borderRadius:4,overflow:"hidden",border:"1px solid #dee2e6",marginBottom:14}}>
          {statuses.map((s,i)=>{const a=s===record.status;const p=statuses.indexOf(record.status)>i;
            return <div key={s} style={{flex:1,padding:"5px 10px",fontSize:11,fontWeight:a?600:400,textAlign:"center",background:a?"#714B67":p?"#d4c5cf":"transparent",color:a?"#fff":p?"#714B67":"#888",borderRight:i<statuses.length-1?"1px solid #dee2e6":"none"}}>{s}</div>;
          })}
        </div>}
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          {editing ? <>
            <button onClick={saveForm} style={{padding:"5px 14px",borderRadius:4,border:"none",background:"#714B67",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}>Lưu</button>
            <button onClick={cancelForm} style={{padding:"5px 14px",borderRadius:4,border:"1px solid #ddd",background:"#fff",color:"#555",fontSize:12,cursor:"pointer"}}>Hủy bỏ</button>
          </> : <>
            <button onClick={()=>setEditForm({...record})} style={{padding:"5px 14px",borderRadius:4,border:"none",background:"#714B67",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}><Edit3 size={11} style={{marginRight:4}}/>Sửa</button>
            <button onClick={cancelForm} style={{padding:"5px 14px",borderRadius:4,border:"1px solid #ddd",background:"#fff",color:"#555",fontSize:12,cursor:"pointer"}}>Quay lại</button>
          </>}
          <div style={{flex:1}}/>
          {record.status==="Đang soạn"&&<button onClick={submitForApproval} style={{padding:"5px 14px",borderRadius:4,border:"none",background:"#2E7D32",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}>Gửi duyệt</button>}
          {actions}
          <button style={{padding:"5px 10px",borderRadius:4,border:"1px solid #ddd",background:"#fff",color:"#555",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><Printer size={12}/>In</button>
        </div>
        <div style={{background:"#fff",borderRadius:4,border:"1px solid #e0e0e0",padding:18,marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {fields.map((f,i)=>(
              <div key={i} style={{gridColumn:f.full?"1/-1":undefined}}>
                <label style={{fontSize:11,color:"#888",fontWeight:500,display:"block",marginBottom:3}}>{f.label}{f.required&&<span style={{color:"#ef4444"}}> *</span>}</label>
                {f.type==="select"?<select value={formData[f.key]||f.value||""} onChange={e=>setField(f.key,e.target.value)} disabled={!editing} style={{width:"100%",padding:"5px 8px",border:"1px solid #ddd",borderRadius:4,fontSize:12,background:!editing?"#f5f5f5":"#fff",boxSizing:"border-box"}}>
                  <option value={formData[f.key]||f.value}>{formData[f.key]||f.value}</option>
                  {(f.options||[]).filter(o=>o!==(formData[f.key]||f.value)).map(o=><option key={o} value={o}>{o}</option>)}
                </select>
                :f.type==="textarea"?<textarea rows={3} value={formData[f.key]||f.value||""} onChange={e=>setField(f.key,e.target.value)} readOnly={!editing||f.ro} style={{width:"100%",padding:"5px 8px",border:"1px solid #ddd",borderRadius:4,fontSize:12,resize:"vertical",fontFamily:"inherit",background:(!editing||f.ro)?"#f5f5f5":"#fff",boxSizing:"border-box"}}/>
                :<input value={formData[f.key]||f.value||""} onChange={e=>setField(f.key,e.target.value)} readOnly={!editing||f.ro} style={{width:"100%",padding:"5px 8px",border:"1px solid #ddd",borderRadius:4,fontSize:12,background:(!editing||f.ro)?"#f5f5f5":"#fff",boxSizing:"border-box",fontFamily:f.mono?"monospace":"inherit"}}/>}
              </div>
            ))}
          </div>
        </div>
        {/* Cross references */}
        {crossRefs&&crossRefs.length>0&&<div style={{background:"#fff",borderRadius:4,border:"1px solid #e0e0e0",padding:14,marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Liên kết nghiệp vụ</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {crossRefs.map((cr,i)=>cr.id?<div key={i} onClick={()=>{
              const [data] = getDataAndSetter(cr.module);
              const found = data.find(r=>r.id===cr.id);
              if(found) nav(cr.module, found);
            }} style={{padding:"4px 10px",background:"#f5f3f5",borderRadius:4,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:4,border:"1px solid #e0e0e0"}}>
              <span style={{color:"#888"}}>{cr.label}:</span>
              <span style={{color:"#714B67",fontWeight:600}}>{cr.id}</span>
            </div>:null)}
          </div>
        </div>}
        {tabs||null}
        {/* Chatter */}
        <div style={{background:"#fff",borderRadius:4,border:"1px solid #e0e0e0",padding:14}}>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            {[["Gửi tin nhắn",MessageSquare],["Ghi chú nội bộ",Edit3]].map(([l,I])=>(
              <button key={l} style={{padding:"3px 10px",border:"1px solid #ddd",background:"#fff",borderRadius:4,fontSize:11,color:"#555",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><I size={11}/>{l}</button>
            ))}
          </div>
          <div style={{border:"1px solid #ddd",borderRadius:4,padding:"6px 10px",minHeight:40,fontSize:12,color:"#aaa"}}>Viết ghi chú...</div>
          <div style={{marginTop:12,borderTop:"1px solid #f0f0f0",paddingTop:10}}>
            {[{u:"Nguyễn An",a:`đã cập nhật trạng thái → ${record.status}`,t:"28/08/2026 14:32"},{u:"Hệ thống",a:"đã tạo bản ghi",t:record.date?record.date+" 09:00":"25/08/2026 09:00"}].map((l,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:"#714B67",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:600,flexShrink:0}}>{l.u[0]}</div>
                <div><div style={{fontSize:11}}><strong>{l.u}</strong> {l.a}</div><div style={{fontSize:10,color:"#aaa"}}>{l.t}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );};

  // ==================== BIDDING MODULE ====================
  const BiddingModule = () => {
    if(bidDetail) return <BidDetailView bid={bidDetail}/>;
    const currentView = viewPrefs["BID"] || bidTab;
    return <>{currentView==="list"?
      <Table data={bids} cols={[
        {k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600,cursor:"pointer"}}>{v}</span>},
        {k:"name",label:"Tên gói thầu"},{k:"type",label:"Phương thức"},{k:"hospital",label:"Phạm vi"},
        {k:"budget",label:"Ngân sách",align:"right",render:v=><span style={{fontWeight:600}}>{v} ₫</span>},
        {k:"bidsReceived",label:"Hồ sơ nhận",align:"center",render:(v,r)=><span>{v}/{r.vendors.length}</span>},
        {k:"closeDate",label:"Hạn nộp"},{k:"method",label:"Hình thức"},
        {k:"status",label:"Trạng thái",render:v=><Badge s={v}/>},
      ]} onRow={r=>setBidDetail(r)}/>
    :<Kanban data={bids} onCard={r=>setBidDetail(r)}/>}</>;
  };

  // ==================== BID DETAIL ====================
  const BidDetailView = ({bid}) => {
    const [tab,setTab] = useState("info");
    const comp = BID_COMPARISON;
    const scores = useMemo(()=>{
      const w = comp.weights;
      const prices = comp.vendors.map(v=>v.prices.reduce((a,b)=>a+b,0));
      const minP = Math.min(...prices);
      const minD = Math.min(...comp.vendors.map(v=>v.delivery));
      const maxW = Math.max(...comp.vendors.map(v=>v.warranty));
      const maxDisc = Math.max(...comp.vendors.map(v=>parseFloat(v.discount)));
      return comp.vendors.map((v,i)=>{
        const priceScore = (minP/prices[i])*100;
        const delivScore = (minD/v.delivery)*100;
        const tecScore = v.tecScore;
        const warScore = (v.warranty/maxW)*100;
        const discScore = (parseFloat(v.discount)/maxDisc)*100;
        const total = (priceScore*w.price + delivScore*w.delivery + tecScore*w.tecScore + warScore*w.warranty + discScore*w.discount)/100;
        return {...v,priceScore:priceScore.toFixed(1),delivScore:delivScore.toFixed(1),warScore:warScore.toFixed(1),discScore:discScore.toFixed(1),totalScore:total.toFixed(1),totalPrice:prices[i],rank:0};
      }).sort((a,b)=>b.totalScore-a.totalScore).map((v,i)=>({...v,rank:i+1}));
    },[comp]);

    return (
      <div style={{flex:1,overflowY:"auto",background:"#f0eff4"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"14px 18px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <button onClick={()=>setBidDetail(null)} style={{background:"none",border:"none",cursor:"pointer",display:"flex"}}><ArrowLeft size={18} color="#714B67"/></button>
            <div style={{flex:1}}>
              <div style={{fontSize:16,fontWeight:700,color:"#333"}}>{bid.id} — {bid.name}</div>
              <div style={{fontSize:12,color:"#888"}}>{bid.type} · {bid.hospital} · Hạn: {bid.closeDate}</div>
            </div>
            <Badge s={bid.status}/>
          </div>
          <div style={{display:"flex",gap:0,background:"#fff",border:"1px solid #e0e0e0",borderRadius:"4px 4px 0 0",borderBottom:"none"}}>
            {[["info","Thông tin"],["compare","So sánh tự động"],["scoring","Chấm điểm"],["docs","Hồ sơ thầu"],["history","Lịch sử"]].map(([k,l])=>(
              <div key={k} onClick={()=>setTab(k)} style={{padding:"9px 16px",fontSize:12,fontWeight:tab===k?600:400,cursor:"pointer",borderBottom:tab===k?"2px solid #714B67":"2px solid transparent",color:tab===k?"#714B67":"#666"}}>{l}</div>
            ))}
          </div>
          <div style={{background:"#fff",border:"1px solid #e0e0e0",borderTop:"none",borderRadius:"0 0 4px 4px",padding:18}}>
            {tab==="info"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {[["Phương thức",bid.type],["Phạm vi",bid.hospital],["Ngân sách",bid.budget+" ₫"],["Ngày mở thầu",bid.openDate],["Hạn nộp",bid.closeDate],["Hình thức mở",bid.method],["Số dòng hàng",bid.lines],["NCC được mời",bid.vendors.length],["Hồ sơ đã nhận",bid.bidsReceived]].map(([l,v],i)=>(
                  <div key={i}><div style={{fontSize:11,color:"#888",marginBottom:2}}>{l}</div><div style={{fontSize:13,fontWeight:500}}>{v}</div></div>
                ))}
                {bid.rfqId&&<div><div style={{fontSize:11,color:"#888",marginBottom:2}}>RFQ nguồn</div><div style={{fontSize:13,fontWeight:500,color:"#714B67",cursor:"pointer"}} onClick={()=>{const r=rfqs.find(x=>x.id===bid.rfqId);if(r)nav("RFQ",r);}}>{bid.rfqId}</div></div>}
                {bid.awdId&&<div><div style={{fontSize:11,color:"#888",marginBottom:2}}>AWD</div><div style={{fontSize:13,fontWeight:500,color:"#714B67",cursor:"pointer"}} onClick={()=>{const r=awds.find(x=>x.id===bid.awdId);if(r)nav("AWD",r);}}>{bid.awdId}</div></div>}
                <div style={{gridColumn:"1/-1"}}>
                  <div style={{fontSize:11,color:"#888",marginBottom:6}}>NCC tham gia</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {bid.vendors.map(vid=>{const v=vendors.find(x=>x.id===vid); return v?<div key={vid} style={{padding:"4px 10px",background:"#f5f3f5",borderRadius:4,fontSize:11,display:"flex",alignItems:"center",gap:4}}><Building2 size={12} color="#714B67"/>{v.name}</div>:null;})}
                  </div>
                </div>
              </div>
            )}

            {tab==="compare"&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div><div style={{fontSize:14,fontWeight:700}}>Bảng so sánh tự động</div><div style={{fontSize:11,color:"#888"}}>Hệ thống tự động chuẩn hóa và xếp hạng theo trọng số cấu hình</div></div>
                </div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead><tr style={{background:"#f8f9fa"}}>
                      <th style={{padding:"8px 10px",textAlign:"left",fontWeight:600,borderBottom:"2px solid #ddd",minWidth:160}}>Hạng mục</th>
                      {scores.map(v=>(
                        <th key={v.id} style={{padding:"8px 10px",textAlign:"center",fontWeight:600,borderBottom:"2px solid #ddd",minWidth:160,background:v.rank===1?"#E8F5E920":"transparent"}}>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                            {v.rank===1&&<Award size={13} color="#F6BB42"/>}{v.name}
                          </div>
                          {v.rank===1&&<div style={{fontSize:9,color:"#2E7D32",fontWeight:700,marginTop:2}}>ĐỀ XUẤT</div>}
                        </th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {comp.items.map((item,idx)=>(
                        <tr key={idx} style={{borderBottom:"1px solid #f0f0f0"}}>
                          <td style={{padding:"6px 10px",fontWeight:500}}>{item.name}<br/><span style={{fontSize:10,color:"#888"}}>{item.unit} × {item.qty.toLocaleString()}</span></td>
                          {scores.map(v=>{
                            const p = comp.vendors.find(x=>x.id===v.id).prices[idx];
                            const allP = comp.vendors.map(x=>x.prices[idx]);
                            const isMin = p===Math.min(...allP);
                            return <td key={v.id} style={{padding:"6px 10px",textAlign:"right",background:isMin?"#E8F5E930":"transparent"}}>
                              <span style={{fontWeight:isMin?700:400,color:isMin?"#2E7D32":"#333"}}>{p.toLocaleString()} ₫</span>
                              <br/><span style={{fontSize:10,color:"#888"}}>= {(p*item.qty).toLocaleString()} ₫</span>
                            </td>;
                          })}
                        </tr>
                      ))}
                      <tr style={{background:"#f8f9fa",fontWeight:700,borderTop:"2px solid #ddd"}}>
                        <td style={{padding:"8px 10px"}}>Tổng giá trị</td>
                        {scores.map(v=><td key={v.id} style={{padding:"8px 10px",textAlign:"right",color:v.rank===1?"#2E7D32":"#333"}}>{v.totalPrice.toLocaleString()} ₫</td>)}
                      </tr>
                      {[["Thời gian giao (ngày)","delivery"],["Bảo hành (tháng)","warranty"],["Chiết khấu","discount"],["Điều kiện thanh toán","payment"]].map(([label,key])=>(
                        <tr key={key} style={{borderBottom:"1px solid #f0f0f0"}}><td style={{padding:"6px 10px"}}>{label}</td>{scores.map(v=><td key={v.id} style={{padding:"6px 10px",textAlign:"center"}}>{v[key]}</td>)}</tr>
                      ))}
                      <tr style={{borderBottom:"1px solid #f0f0f0"}}><td style={{padding:"6px 10px"}}>Điểm kỹ thuật (TEC)</td>{scores.map(v=><td key={v.id} style={{padding:"6px 10px",textAlign:"center",fontWeight:600}}>{v.tecScore}/100</td>)}</tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab==="scoring"&&(
              <div>
                <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>Chấm điểm tổng hợp tự động</div>
                <div style={{fontSize:11,color:"#888",marginBottom:14}}>Trọng số: Giá {comp.weights.price}% · Giao hàng {comp.weights.delivery}% · Kỹ thuật {comp.weights.tecScore}% · Bảo hành {comp.weights.warranty}% · Chiết khấu {comp.weights.discount}%</div>
                {scores.map((v,i)=>(
                  <div key={v.id} style={{background:i===0?"#E8F5E9":"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14,marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:i===0?"#2E7D32":i===1?"#3b82f6":"#94a3b8",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>#{v.rank}</div>
                        <div><div style={{fontSize:13,fontWeight:600}}>{v.name}</div><div style={{fontSize:11,color:"#888"}}>{v.id}</div></div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:24,fontWeight:800,color:i===0?"#2E7D32":"#333"}}>{v.totalScore}</div>
                        <div style={{fontSize:10,color:"#888"}}>/ 100 điểm</div>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
                      {[["Giá",v.priceScore,"#3b82f6"],["Giao hàng",v.delivScore,"#22c55e"],["Kỹ thuật",v.tecScore,"#f59e0b"],["Bảo hành",v.warScore,"#8b5cf6"],["Chiết khấu",v.discScore,"#ef4444"]].map(([l,sc,c])=>(
                        <div key={l}>
                          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:2}}><span style={{color:"#888"}}>{l}</span><span style={{fontWeight:600}}>{sc}</span></div>
                          <div style={{height:5,background:"#f0f0f0",borderRadius:3}}><div style={{height:"100%",width:`${Math.min(sc,100)}%`,background:c,borderRadius:3}}/></div>
                        </div>
                      ))}
                    </div>
                    {i===0&&<div style={{marginTop:8,padding:"4px 10px",background:"#2E7D3215",borderRadius:4,fontSize:11,color:"#2E7D32",fontWeight:600,display:"inline-flex",alignItems:"center",gap:4}}><CheckCircle2 size={12}/>Hệ thống đề xuất lựa chọn NCC này</div>}
                  </div>
                ))}
                <div style={{display:"flex",gap:8,marginTop:14}}>
                  {!bid.awdId && scores[0] && <button onClick={()=>createAWDFromBID(bid, scores[0].id)} style={{padding:"6px 16px",background:"#714B67",color:"#fff",border:"none",borderRadius:4,fontSize:12,cursor:"pointer",fontWeight:500}}>Chấp nhận đề xuất → Tạo AWD</button>}
                  {bid.awdId && <div style={{padding:"6px 16px",background:"#E8F5E9",borderRadius:4,fontSize:12,color:"#2E7D32",fontWeight:500,display:"flex",alignItems:"center",gap:4}}><CheckCircle2 size={13}/>Đã tạo AWD: <span style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>{const a=awds.find(x=>x.id===bid.awdId);if(a)nav("AWD",a);}}>{bid.awdId}</span></div>}
                </div>
              </div>
            )}

            {tab==="docs"&&(
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {bid.vendors.map(vid=>{const v=vendors.find(x=>x.id===vid); if(!v) return null; return (
                  <div key={vid} style={{border:"1px solid #e0e0e0",borderRadius:4,padding:12}}>
                    <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>{v.name}</div>
                    {["Thư chào giá.pdf","Catalogue sản phẩm.pdf","GCN ĐKKD.pdf","Bảng giá chi tiết.xlsx"].map(f=>(
                      <div key={f} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 0",fontSize:11,color:"#555"}}><FileText size={12} color="#714B67"/>{f}<Download size={10} color="#888" style={{marginLeft:"auto",cursor:"pointer"}}/></div>
                    ))}
                    <div style={{marginTop:6,fontSize:10,color:bid.method==="Niêm phong"?"#6366f1":"#22c55e",display:"flex",alignItems:"center",gap:3}}>
                      {bid.method==="Niêm phong"?<><Lock size={10}/>Niêm phong — chờ mở</>:<><Unlock size={10}/>Đã mở</>}
                    </div>
                  </div>
                );})}
              </div>
            )}

            {tab==="history"&&(
              <div>
                {[{t:"28/08/2026 14:00",u:"Hệ thống",a:"NCC-005 đã nộp hồ sơ thầu",type:"info"},
                  {t:"27/08/2026 09:30",u:"Hệ thống",a:"NCC-001 đã nộp hồ sơ thầu",type:"info"},
                  {t:"25/08/2026 08:00",u:"Nguyễn An",a:"Phát hành thư mời thầu cho "+bid.vendors.length+" NCC",type:"action"},
                  {t:"23/08/2026 15:45",u:"Nguyễn An",a:"Tạo gói thầu "+bid.id,type:"create"},
                ].map((l,i)=>(
                  <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid #f0f0f0"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:l.type==="create"?"#22c55e":l.type==="action"?"#3b82f6":"#94a3b8",marginTop:4,flexShrink:0}}/>
                    <div><div style={{fontSize:12}}><strong>{l.u}</strong> — {l.a}</div><div style={{fontSize:10,color:"#aaa"}}>{l.t}</div></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==================== MAINTENANCE MODULE ====================
  const MaintenanceModule = () => {
    if(mntDetail) return <MaintDetailView item={mntDetail}/>;
    return <>
      <div style={{display:"flex",gap:0,background:"#fff",borderBottom:"1px solid #e0e0e0"}}>
        {[["assets","Thiết bị & Tài sản"],["calendar","Lịch bảo trì"],["orders","Lệnh công việc"],["warranty","Bảo hành"],["dashboard","Tổng quan"]].map(([k,l])=>(
          <div key={k} onClick={()=>setMntTab(k)} style={{padding:"9px 16px",fontSize:12,fontWeight:mntTab===k?600:400,cursor:"pointer",borderBottom:mntTab===k?"2px solid #E67E22":"2px solid transparent",color:mntTab===k?"#E67E22":"#666"}}>{l}</div>
        ))}
      </div>

      {mntTab==="assets"&&<Table data={maintenance} cols={[
        {k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},
        {k:"name",label:"Tên thiết bị"},{k:"serial",label:"Số Sê-ri"},
        {k:"hospital",label:"Bệnh viện",render:v=>v.replace("BV TNH ","")},
        {k:"dept",label:"Khoa/Phòng"},{k:"category",label:"Phân loại"},
        {k:"condition",label:"Tình trạng",render:v=><span style={{color:v==="Tốt"?"#22c55e":v==="Trung bình"?"#f59e0b":"#ef4444",fontWeight:500}}>{v}</span>},
        {k:"nextMaint",label:"Bảo trì tiếp",render:(v)=>{try{const d=new Date(v.split("/").reverse().join("-")); const now=new Date(); return <span style={{color:d<now?"#ef4444":"#333",fontWeight:d<now?600:400}}>{v}{d<now?" ⚠":""}</span>;}catch(e){return v;}}},
        {k:"status",label:"Bảo hành",render:v=><Badge s={v} size="xs"/>},
      ]} onRow={r=>setMntDetail(r)}/>}

      {mntTab==="orders"&&<Table data={maintOrders} cols={[
        {k:"id",label:"Mã WO",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},
        {k:"name",label:"Mô tả"},{k:"type",label:"Loại"},
        {k:"assignee",label:"Người thực hiện"},{k:"date",label:"Ngày"},{k:"priority",label:"Ưu tiên",render:v=><span style={{color:v==="Khẩn"?"#ef4444":v==="Cao"?"#f59e0b":"#555"}}>{v}</span>},
        {k:"status",label:"Trạng thái",render:v=><Badge s={v}/>},
      ]} onRow={()=>{}}/>}

      {mntTab==="calendar"&&(
        <div style={{flex:1,padding:18}}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Lịch bảo trì — Tháng 09/2026</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,background:"#e0e0e0",borderRadius:4,overflow:"hidden"}}>
            {["T2","T3","T4","T5","T6","T7","CN"].map(d=><div key={d} style={{padding:"6px 4px",background:"#f8f9fa",textAlign:"center",fontSize:11,fontWeight:600,color:"#555"}}>{d}</div>)}
            {Array.from({length:35},(_,i)=>{
              const day=i-0; const d=day>=1&&day<=30?day:null;
              const events = d===1?[{name:"BĐ CT Scanner",c:"#E67E22"}]:d===15?[{name:"BT Beckman AU680",c:"#3b82f6"}]:d===20?[{name:"BT Máy thở Dräger",c:"#22c55e"}]:d===5?[{name:"Thay màng lọc RO",c:"#ef4444"}]:[];
              return <div key={i} style={{padding:4,background:d?"#fff":"#fafafa",minHeight:60}}>
                {d&&<div style={{fontSize:11,color:events.length?"#333":"#aaa",fontWeight:events.length?600:400}}>{d}</div>}
                {events.map((e,ei)=><div key={ei} style={{fontSize:9,background:`${e.c}15`,color:e.c,padding:"2px 4px",borderRadius:3,marginTop:2,borderLeft:`2px solid ${e.c}`}}>{e.name}</div>)}
              </div>;
            })}
          </div>
        </div>
      )}

      {mntTab==="warranty"&&(
        <div style={{flex:1,padding:18}}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Theo dõi bảo hành</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
            {[["Còn bảo hành",maintenance.filter(m=>m.status==="Còn bảo hành").length,"#22c55e"],["Sắp hết",1,"#f59e0b"],["Hết bảo hành",maintenance.filter(m=>m.status==="Hết bảo hành").length,"#ef4444"]].map(([l,v,c])=>(
              <div key={l} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14}}>
                <div style={{fontSize:11,color:"#888",textTransform:"uppercase"}}>{l}</div>
                <div style={{fontSize:28,fontWeight:800,color:c}}>{v}</div>
              </div>
            ))}
          </div>
          {maintenance.map(m=>(
            <div key={m.id} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:12,marginBottom:8,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setMntDetail(m)}>
              <Wrench size={18} color="#E67E22"/>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{m.name}</div><div style={{fontSize:11,color:"#888"}}>{m.hospital} · {m.serial}</div></div>
              <div style={{textAlign:"right",marginRight:8}}><div style={{fontSize:11,color:"#888"}}>Hết bảo hành</div><div style={{fontSize:12,fontWeight:600}}>{m.warrantyEnd}</div></div>
              <Badge s={m.status} size="xs"/>
            </div>
          ))}
        </div>
      )}

      {mntTab==="dashboard"&&(
        <div style={{flex:1,padding:18}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
            {[["Tổng thiết bị",maintenance.length,Boxes,"#714B67"],["Cần bảo trì",maintenance.filter(m=>m.status==="Quá hạn"||m.status==="Lên kế hoạch").length,AlertTriangle,"#f59e0b"],["Đang bảo trì",maintenance.filter(m=>m.status==="Đang bảo trì").length,Wrench,"#3b82f6"],["Hết bảo hành",maintenance.filter(m=>m.status==="Hết bảo hành").length,AlertCircle,"#ef4444"]].map(([l,v,I,c])=>(
              <div key={l} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:10,color:"#888",textTransform:"uppercase"}}>{l}</div><div style={{fontSize:24,fontWeight:700}}>{v}</div></div><div style={{width:32,height:32,borderRadius:8,background:`${c}15`,display:"flex",alignItems:"center",justifyContent:"center"}}><I size={16} color={c}/></div></div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Thiết bị theo tình trạng</div>
              {Object.entries(maintenance.reduce((acc,m)=>{acc[m.condition]=(acc[m.condition]||0)+1;return acc;},{})).map(([l,v])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <div style={{width:10,height:10,borderRadius:2,background:l==="Tốt"?"#22c55e":l==="Trung bình"?"#f59e0b":"#ef4444"}}/><span style={{flex:1,fontSize:12}}>{l}</span><span style={{fontSize:12,fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Giá trị tài sản theo bệnh viện</div>
              {HOSPITALS.map(h=>{const val=maintenance.filter(m=>m.hospital===h).reduce((a,m)=>a+parseInt(m.value.replace(/\./g,"")),0);
                return <div key={h} style={{marginBottom:6}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}><span>{h.replace("BV TNH ","")}</span><span style={{fontWeight:600}}>{(val/1e9).toFixed(1)} tỷ</span></div>
                <div style={{height:5,background:"#f0f0f0",borderRadius:3}}><div style={{height:"100%",width:`${Math.min(val/16e9*100,100)}%`,background:"#E67E22",borderRadius:3}}/></div></div>;
              })}
            </div>
          </div>
        </div>
      )}
    </>;
  };

  // ==================== MAINTENANCE DETAIL ====================
  const MaintDetailView = ({item}) => (
    <div style={{flex:1,overflowY:"auto",background:"#f0eff4"}}>
      <div style={{maxWidth:960,margin:"0 auto",padding:"14px 18px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <button onClick={()=>setMntDetail(null)} style={{background:"none",border:"none",cursor:"pointer",display:"flex"}}><ArrowLeft size={18} color="#714B67"/></button>
          <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700}}>{item.name}</div><div style={{fontSize:12,color:"#888"}}>{item.serial} · {item.hospital}</div></div>
          <Badge s={item.status}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}}>
          <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:16}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:12,borderBottom:"1px solid #f0f0f0",paddingBottom:6}}>Thông tin thiết bị</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[["Mã",item.id],["Số Sê-ri",item.serial],["Bệnh viện",item.hospital],["Khoa/Phòng",item.dept],["Phân loại",item.category],["Loại",item.type],["NCC cung cấp",vendors.find(v=>v.id===item.vendor)?.name||item.vendor],["Ngày mua",item.purchaseDate],["Giá trị",item.value+" ₫"],["Tình trạng",item.condition]].map(([l,v])=>(
                <div key={l}><div style={{fontSize:10,color:"#888"}}>{l}</div><div style={{fontSize:12,fontWeight:500}}>{v}</div></div>
              ))}
            </div>
          </div>
          <div>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14,marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Bảo hành</div>
              <div style={{textAlign:"center",marginBottom:8}}>
                <div style={{fontSize:11,color:"#888"}}>Hết hạn bảo hành</div>
                <div style={{fontSize:16,fontWeight:700,color:item.status==="Hết bảo hành"?"#ef4444":"#22c55e"}}>{item.warrantyEnd}</div>
                <Badge s={item.status} size="xs"/>
              </div>
              {item.status==="Hết bảo hành"&&<button onClick={()=>createPRFromMNT(item)} style={{width:"100%",padding:"5px 0",background:"#E67E22",color:"#fff",border:"none",borderRadius:4,fontSize:11,cursor:"pointer",fontWeight:500}}>Tạo PR gia hạn bảo hành</button>}
            </div>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Bảo trì</div>
              {[["Chu kỳ",item.maintCycle+" ngày"],["Lần cuối",item.lastMaint],["Lần tiếp theo",item.nextMaint]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"4px 0",borderBottom:"1px solid #f5f5f5"}}><span style={{color:"#888"}}>{l}</span><span style={{fontWeight:500}}>{v}</span></div>
              ))}
              <button onClick={()=>createWOFromMNT(item)} style={{width:"100%",padding:"5px 0",background:"#714B67",color:"#fff",border:"none",borderRadius:4,fontSize:11,cursor:"pointer",fontWeight:500,marginTop:8}}>Tạo lệnh bảo trì</button>
            </div>
          </div>
        </div>
        <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14,marginTop:14}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Lịch sử bảo trì & sửa chữa</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead><tr style={{background:"#f8f9fa"}}>{["Ngày","Loại","Nội dung","Người thực hiện","Chi phí","Kết quả"].map(h=><th key={h} style={{padding:"6px 8px",textAlign:"left",fontWeight:600,color:"#555"}}>{h}</th>)}</tr></thead>
            <tbody>
              {[{d:item.lastMaint,t:"Định kỳ",n:"Bảo trì định kỳ theo lịch",p:"Kỹ thuật viên NCC",c:"15.000.000",r:"Đạt"},
                {d:"01/04/2026",t:"Sửa chữa",n:"Thay bo mạch điều khiển",p:"Kỹ thuật viên NCC",c:"45.000.000",r:"Đạt"},
              ].map((r,i)=>(
                <tr key={i} style={{borderBottom:"1px solid #f0f0f0"}}><td style={{padding:"6px 8px"}}>{r.d}</td><td style={{padding:"6px 8px"}}>{r.t}</td><td style={{padding:"6px 8px"}}>{r.n}</td><td style={{padding:"6px 8px"}}>{r.p}</td><td style={{padding:"6px 8px",textAlign:"right"}}>{r.c} ₫</td><td style={{padding:"6px 8px"}}><Badge s={r.r==="Đạt"?"Hoàn tất":"Đang xử lý"} size="xs"/></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ==================== VENDOR PORTAL ====================
  const VendorPortal = () => {
    const vendorPOs = pos.filter(p=>p.vendorId==="NCC-001");
    const vendorBids = bids.filter(b=>b.vendors.includes("NCC-001"));
    return (
    <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>
      <div style={{background:"linear-gradient(135deg,#714B67 0%,#9b59b6 50%,#6C3483 100%)",padding:"18px 22px",color:"#fff"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{width:40,height:40,borderRadius:8,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Globe size={22}/></div>
          <div><h2 style={{margin:0,fontSize:17,fontWeight:700}}>Cổng Nhà cung cấp TNH</h2><p style={{margin:0,fontSize:11,opacity:.75}}>Vendor Portal — Giao tiếp với Tập đoàn TNH</p></div>
          <div style={{flex:1}}/>
          <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.15)",padding:"4px 10px",borderRadius:4}}><Building2 size={13}/><span style={{fontSize:11}}>Công ty CP Dược phẩm Hà Nội</span></div>
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {[["home","Trang chủ"],["rfq","RFQ nhận được"],["bidding","Đấu thầu"],["quote","Báo giá đã gửi"],["po","Đơn đặt hàng"],["delivery","Giao hàng"],["invoice","Hóa đơn"],["profile","Hồ sơ"],["eval","Đánh giá"]].map(([k,l])=>(
            <button key={k} onClick={()=>{setPortalTab(k);setPortalBidding(null);}} style={{padding:"5px 12px",borderRadius:4,border:"1px solid rgba(255,255,255,.25)",background:portalTab===k?"rgba(255,255,255,.2)":"transparent",color:"#fff",fontSize:11,cursor:"pointer",fontWeight:portalTab===k?600:400}}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{flex:1,padding:"16px 22px",overflowY:"auto"}}>
        {portalTab==="home"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
              {[["RFQ chờ phản hồi",rfqs.filter(r=>r.vendorIds.includes("NCC-001")&&r.status==="Đang nhận báo giá").length,Send,"#E9573F","rfq"],
                ["Đấu thầu đang mở",vendorBids.filter(b=>["Đang đấu thầu","Chờ mở thầu"].includes(b.status)).length,Gavel,"#9b59b6","bidding"],
                ["PO chờ xác nhận",vendorPOs.filter(p=>p.status==="Đã phát hành").length,ShoppingCart,"#3b82f6","po"],
                ["Hóa đơn chờ xử lý",invs.filter(inv=>inv.vendorId==="NCC-001"&&!["Đã thanh toán"].includes(inv.status)).length,DollarSign,"#22c55e","invoice"]
              ].map(([l,v,I,c,tab])=>(
                <div key={l} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:12,cursor:"pointer"}} onClick={()=>setPortalTab(tab)}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:10,color:"#888",textTransform:"uppercase"}}>{l}</div><div style={{fontSize:22,fontWeight:700,color:c}}>{v}</div></div><I size={20} color={c}/></div>
                </div>
              ))}
            </div>
            <div style={{background:"#FFF8E1",padding:"10px 14px",borderRadius:4,fontSize:11,color:"#F57F17",display:"flex",alignItems:"center",gap:6,marginBottom:14}}>
              <AlertTriangle size={14}/>Giấy chứng nhận GDP sẽ hết hạn vào 15/10/2026. Vui lòng cập nhật hồ sơ trước ngày này.
            </div>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Hoạt động gần đây</div>
              {[{t:"28/08 14:30",a:`PO-TN-2026-000123 đã được phát hành — chờ xác nhận`,c:"#3b82f6"},
                {t:"27/08 10:00",a:"RFQ-TN-2026-0001 — Thuốc kháng sinh Q4 — mời báo giá",c:"#E9573F"},
                {t:"25/08 16:00",a:"Đấu thầu BID-2026-0012 — mời tham gia",c:"#9b59b6"},
              ].map((e,i)=><div key={i} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:"1px solid #f5f5f5"}}><div style={{width:6,height:6,borderRadius:"50%",background:e.c,marginTop:5,flexShrink:0}}/><div><div style={{fontSize:11}}>{e.a}</div><div style={{fontSize:10,color:"#aaa"}}>{e.t}</div></div></div>)}
            </div>
          </div>
        )}

        {portalTab==="rfq"&&(
          <div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Yêu cầu báo giá đang mở</div>
            {rfqs.filter(r=>r.vendorIds.includes("NCC-001")&&["Đang nhận báo giá","Đã gửi"].includes(r.status)).map(rfq=>(
              <div key={rfq.id} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"#714B67"}}>{rfq.id}</div>
                    <div style={{fontSize:12,color:"#333",marginTop:2}}>{rfq.name}</div>
                    <div style={{fontSize:11,color:"#888",marginTop:4}}>{rfq.lines} dòng · Hạn: {rfq.deadline}</div>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>portalSubmitQuote(rfq.id)} style={{padding:"5px 12px",background:"#714B67",color:"#fff",border:"none",borderRadius:4,fontSize:11,cursor:"pointer",fontWeight:500}}>Gửi báo giá</button>
                    <button style={{padding:"5px 12px",background:"#fff",color:"#555",border:"1px solid #ddd",borderRadius:4,fontSize:11,cursor:"pointer"}}>Tải tệp</button>
                  </div>
                </div>
              </div>
            ))}
            {rfqs.filter(r=>r.vendorIds.includes("NCC-001")&&["Đang nhận báo giá","Đã gửi"].includes(r.status)).length===0&&<div style={{padding:20,textAlign:"center",color:"#aaa",fontSize:12}}>Không có RFQ đang mở</div>}
          </div>
        )}

        {portalTab==="bidding"&&!portalBidding&&(
          <div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Đấu thầu được mời tham gia</div>
            {vendorBids.map(bid=>(
              <div key={bid.id} onClick={()=>setPortalBidding(bid)} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14,marginBottom:10,cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}><Gavel size={14} color="#9b59b6"/><span style={{fontSize:14,fontWeight:600,color:"#714B67"}}>{bid.id}</span></div>
                    <div style={{fontSize:12,marginTop:4}}>{bid.name}</div>
                    <div style={{fontSize:11,color:"#888",marginTop:4}}>{bid.type} · {bid.lines} dòng · Hạn nộp: {bid.closeDate}</div>
                  </div>
                  <Badge s={bid.status}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {portalTab==="bidding"&&portalBidding&&(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <button onClick={()=>setPortalBidding(null)} style={{background:"none",border:"none",cursor:"pointer",display:"flex"}}><ArrowLeft size={16} color="#714B67"/></button>
              <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>{portalBidding.name}</div><div style={{fontSize:11,color:"#888"}}>{portalBidding.id} · Hạn nộp: {portalBidding.closeDate}</div></div>
              <Badge s={portalBidding.status}/>
            </div>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:16,marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Nộp hồ sơ thầu</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,marginBottom:12}}>
                <thead><tr style={{background:"#f8f9fa"}}>
                  {["STT","Tên hàng hóa","ĐVT","Số lượng","Đơn giá (₫)","Thời gian giao","Bảo hành"].map(h=><th key={h} style={{padding:"6px 8px",textAlign:"left",fontWeight:600,color:"#555"}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {BID_COMPARISON.items.map((item,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid #f0f0f0"}}>
                      <td style={{padding:"6px 8px"}}>{i+1}</td>
                      <td style={{padding:"6px 8px"}}>{item.name}</td>
                      <td style={{padding:"6px 8px"}}>{item.unit}</td>
                      <td style={{padding:"6px 8px",textAlign:"right"}}>{item.qty.toLocaleString()}</td>
                      <td style={{padding:"6px 8px"}}><input defaultValue="" placeholder="Nhập giá" style={{width:100,padding:"3px 6px",border:"1px solid #ddd",borderRadius:3,fontSize:11}}/></td>
                      <td style={{padding:"6px 8px"}}><input defaultValue="" placeholder="ngày" style={{width:50,padding:"3px 6px",border:"1px solid #ddd",borderRadius:3,fontSize:11}}/></td>
                      <td style={{padding:"6px 8px"}}><input defaultValue="" placeholder="tháng" style={{width:50,padding:"3px 6px",border:"1px solid #ddd",borderRadius:3,fontSize:11}}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{updateRecord("BID",portalBidding.id,{bidsReceived:(portalBidding.bidsReceived||0)+1});showToast("Đã nộp hồ sơ thầu thành công");setPortalBidding(null);}} style={{padding:"6px 18px",background:"#714B67",color:"#fff",border:"none",borderRadius:4,fontSize:12,cursor:"pointer",fontWeight:600}}>Nộp hồ sơ thầu</button>
                <button style={{padding:"6px 18px",background:"#fff",color:"#714B67",border:"1px solid #714B67",borderRadius:4,fontSize:12,cursor:"pointer"}}>Lưu nháp</button>
              </div>
            </div>
          </div>
        )}

        {portalTab==="po"&&(
          <div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Đơn đặt hàng</div>
            {vendorPOs.map(po=>(
              <div key={po.id} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"#714B67"}}>{po.id}</div>
                    <div style={{fontSize:11,color:"#888",marginTop:2}}>{po.hospital} · {po.date} · {po.lines} dòng</div>
                    <div style={{fontSize:14,fontWeight:700,marginTop:4}}>{po.amount} ₫</div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <Badge s={po.status}/>
                    {po.status==="Đã phát hành"&&<>
                      <button onClick={()=>portalConfirmPO(po.id)} style={{padding:"5px 12px",background:"#2E7D32",color:"#fff",border:"none",borderRadius:4,fontSize:11,cursor:"pointer"}}>✓ Xác nhận</button>
                      <button style={{padding:"5px 12px",background:"#fff",color:"#C62828",border:"1px solid #C62828",borderRadius:4,fontSize:11,cursor:"pointer"}}>✕ Từ chối</button>
                    </>}
                  </div>
                </div>
              </div>
            ))}
            {vendorPOs.length===0&&<div style={{padding:20,textAlign:"center",color:"#aaa",fontSize:12}}>Không có đơn đặt hàng</div>}
          </div>
        )}

        {portalTab==="delivery"&&(
          <div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Lịch giao hàng & Theo dõi</div>
            {vendorPOs.filter(p=>["NCC xác nhận","Đã phát hành"].includes(p.status)).map(po=>(
              <div key={po.id} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div><div style={{fontSize:13,fontWeight:600,color:"#714B67"}}>{po.id}</div><div style={{fontSize:11,color:"#888"}}>{po.hospital} · {po.lines} dòng</div></div>
                  <Badge s={po.status}/>
                </div>
                <button onClick={()=>portalNotifyDelivery(po.id)} style={{padding:"5px 12px",background:"#3b82f6",color:"#fff",border:"none",borderRadius:4,fontSize:11,cursor:"pointer",fontWeight:500}}>Thông báo giao hàng</button>
              </div>
            ))}
          </div>
        )}

        {portalTab==="invoice"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:14,fontWeight:700}}>Hóa đơn</div>
              <button onClick={()=>{const po=vendorPOs[0];if(po)portalSubmitInvoice(po.id);}} style={{padding:"5px 14px",background:"#714B67",color:"#fff",border:"none",borderRadius:4,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Upload size={12}/>Nộp hóa đơn mới</button>
            </div>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:"#f8f9fa"}}>{["Số hóa đơn","PO","Ngày","Giá trị","Trạng thái"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontWeight:600,color:"#555"}}>{h}</th>)}</tr></thead>
                <tbody>
                  {invs.filter(inv=>inv.vendorId==="NCC-001").map(inv=>(
                    <tr key={inv.id} style={{borderBottom:"1px solid #f0f0f0"}}>
                      <td style={{padding:"7px 10px",color:"#714B67",fontWeight:500}}>{inv.invoiceNo||inv.id}</td>
                      <td style={{padding:"7px 10px"}}>{inv.poId}</td>
                      <td style={{padding:"7px 10px"}}>{inv.date}</td>
                      <td style={{padding:"7px 10px",fontWeight:600}}>{inv.total} ₫</td>
                      <td style={{padding:"7px 10px"}}><Badge s={inv.status} size="xs"/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {portalTab==="profile"&&(
          <div style={{maxWidth:720}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Hồ sơ nhà cung cấp</div>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:18}}>
              {[["Tên pháp lý","Công ty CP Dược phẩm Hà Nội"],["Mã số thuế","0100107518"],["Địa chỉ","170 La Thành, Đống Đa, Hà Nội"],["Email","contact@duocphamhanoi.vn"],["Nhóm hàng","Dược phẩm"],["Trạng thái","Hoạt động"]].map(([l,v],i)=>(
                <div key={i} style={{display:"flex",padding:"7px 0",borderBottom:"1px solid #f5f5f5"}}>
                  <label style={{width:150,fontSize:12,color:"#888",fontWeight:500,flexShrink:0}}>{l}</label>
                  <span style={{fontSize:12,color:"#333",flex:1}}>{v}</span>
                </div>
              ))}
              <button onClick={()=>{updateRecord("VEN","NCC-001",{});showToast("Đã cập nhật hồ sơ NCC");}} style={{marginTop:12,padding:"5px 14px",background:"#714B67",color:"#fff",border:"none",borderRadius:4,fontSize:11,cursor:"pointer"}}>Cập nhật hồ sơ</button>
            </div>
          </div>
        )}

        {portalTab==="quote"&&(
          <div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Báo giá đã gửi</div>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:"#f8f9fa"}}>{["Số báo giá","RFQ","Ngày gửi","Giá trị","Trạng thái"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontWeight:600,color:"#555"}}>{h}</th>)}</tr></thead>
                <tbody>
                  {qtns.filter(q=>q.vendorId==="NCC-001").map(q=>(
                    <tr key={q.id} style={{borderBottom:"1px solid #f0f0f0"}}>
                      <td style={{padding:"7px 10px",color:"#714B67",fontWeight:500}}>{q.id}</td>
                      <td style={{padding:"7px 10px"}}>{q.rfqId}</td>
                      <td style={{padding:"7px 10px"}}>{q.date}</td>
                      <td style={{padding:"7px 10px",fontWeight:600}}>{q.amount} ₫</td>
                      <td style={{padding:"7px 10px"}}><Badge s={q.status} size="xs"/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {portalTab==="eval"&&(
          <div style={{maxWidth:600}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Đánh giá thực hiện</div>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:18}}>
              <div style={{textAlign:"center",marginBottom:18}}>
                <div style={{fontSize:48,fontWeight:800,color:"#714B67"}}>4.2</div>
                <div style={{fontSize:12,color:"#888"}}>Điểm tổng hợp / 5.0</div>
                <div style={{display:"flex",justifyContent:"center",gap:2,marginTop:4}}>{[1,2,3,4,5].map(s=><Star key={s} size={16} fill={s<=4?"#F6BB42":"none"} color={s<=4?"#F6BB42":"#ddd"}/>)}</div>
              </div>
              {[["Giá cạnh tranh",4.0],["Giao hàng đúng hạn",4.5],["Chất lượng sản phẩm",4.0],["Hồ sơ đầy đủ",4.2],["Phối hợp",4.1]].map(([n,s])=>(
                <div key={n} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}><span>{n}</span><span style={{fontWeight:600}}>{s}</span></div>
                  <div style={{height:5,background:"#f0f0f0",borderRadius:3}}><div style={{height:"100%",width:`${s/5*100}%`,background:s>=4?"#22c55e":s>=3?"#f59e0b":"#ef4444",borderRadius:3}}/></div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{marginTop:16,background:"#E3F2FD",padding:"8px 12px",borderRadius:4,fontSize:10,color:"#1565C0",display:"flex",alignItems:"center",gap:6}}>
          <Shield size={12}/>Dữ liệu được cô lập. Quý đối tác chỉ xem được thông tin liên quan đến hồ sơ của mình.
        </div>
      </div>
    </div>
  );};

  // ==================== DASHBOARD ====================
  const Dashboard = () => (
    <div style={{padding:"16px 18px",overflowY:"auto",flex:1}}>
      <div style={{marginBottom:16}}><h2 style={{fontSize:17,fontWeight:700,color:"#333",margin:0}}>Bảng điều hành Mua sắm</h2><p style={{fontSize:12,color:"#888",margin:"3px 0 0"}}>Tổng quan hoạt động — Tháng 08/2026</p></div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        {[["Yêu cầu mua",prs.length,12,FileText,"#017E84","PR"],["Đấu thầu mở",bids.filter(b=>["Đang đấu thầu","Chờ mở thầu"].includes(b.status)).length,null,Gavel,"#9b59b6","BID"],["Chờ phê duyệt",aprs.filter(a=>a.status==="Chờ duyệt").length,null,CheckCircle2,"#F6BB42","APR"],["PO phát hành",pos.length,8,ShoppingCart,"#3BAFDA","PO"],["Bảo trì cần xử lý",maintenance.filter(m=>["Quá hạn","Lên kế hoạch"].includes(m.status)).length,null,Wrench,"#E67E22","MNT"],["Chi tiêu tháng","2.8 tỷ",15,DollarSign,"#714B67",null]].map(([l,v,ch,I,c,m])=>(
          <div key={l} onClick={()=>m&&nav(m)} style={{background:"#fff",borderRadius:4,padding:14,border:"1px solid #e0e0e0",cursor:m?"pointer":"default",flex:"1 1 150px",minWidth:145}} onMouseEnter={e=>{if(m)e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.06)"}} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
            <div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:.5}}>{l}</div><div style={{fontSize:22,fontWeight:700,color:"#333"}}>{v}</div></div><div style={{width:32,height:32,borderRadius:8,background:`${c}12`,display:"flex",alignItems:"center",justifyContent:"center"}}><I size={16} color={c}/></div></div>
            {ch!=null&&<div style={{fontSize:11,marginTop:6,color:ch>0?"#2E7D32":"#C62828",display:"flex",alignItems:"center",gap:2}}>{ch>0?<TrendingUp size={11}/>:<TrendingDown size={11}/>}{Math.abs(ch)}% vs tháng trước</div>}
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <div style={{background:"#fff",borderRadius:4,border:"1px solid #e0e0e0",padding:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:13,fontWeight:600}}>Yêu cầu mua cần xử lý</span><span onClick={()=>nav("PR")} style={{fontSize:11,color:"#714B67",cursor:"pointer"}}>Xem tất cả →</span></div>
          {prs.filter(p=>!["Hoàn tất","Đã hủy"].includes(p.status)).slice(0,4).map(pr=>(
            <div key={pr.id} onClick={()=>nav("PR",pr)} style={{padding:"6px 0",borderBottom:"1px solid #f5f5f5",cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{pr.id}</div><div style={{fontSize:10,color:"#888"}}>{pr.hospital.replace("BV TNH ","")} · {pr.dept}</div></div>
              <Badge s={pr.status} size="xs"/>
            </div>
          ))}
        </div>
        <div style={{background:"#fff",borderRadius:4,border:"1px solid #e0e0e0",padding:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:13,fontWeight:600}}>Đấu thầu đang mở</span><span onClick={()=>nav("BID")} style={{fontSize:11,color:"#714B67",cursor:"pointer"}}>Xem tất cả →</span></div>
          {bids.filter(b=>["Đang đấu thầu","Chờ mở thầu"].includes(b.status)).map(b=>(
            <div key={b.id} onClick={()=>{nav("BID");setBidDetail(b);}} style={{padding:"6px 0",borderBottom:"1px solid #f5f5f5",cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <Gavel size={13} color="#9b59b6"/><div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{b.name}</div><div style={{fontSize:10,color:"#888"}}>Hạn: {b.closeDate} · {b.bidsReceived}/{b.vendors.length} hồ sơ</div></div>
              <Badge s={b.status} size="xs"/>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        <div style={{background:"#fff",borderRadius:4,border:"1px solid #e0e0e0",padding:14}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Thiết bị cần bảo trì</div>
          {maintenance.filter(m=>["Quá hạn","Lên kế hoạch","Đang bảo trì"].includes(m.status)).map(m=>(
            <div key={m.id} onClick={()=>{nav("MNT");setMntDetail(m);}} style={{padding:"5px 0",borderBottom:"1px solid #f5f5f5",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              <Wrench size={12} color={m.status==="Quá hạn"?"#ef4444":"#E67E22"}/><div style={{flex:1}}><div style={{fontSize:11,fontWeight:500}}>{m.name}</div><div style={{fontSize:10,color:"#888"}}>{m.hospital.replace("BV TNH ","")}</div></div>
              <Badge s={m.status} size="xs"/>
            </div>
          ))}
        </div>
        <div style={{background:"#fff",borderRadius:4,border:"1px solid #e0e0e0",padding:14}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Chi tiêu theo bệnh viện</div>
          {HOSPITALS.map((h,i)=>{const v=[1250,680,520,350]; return <div key={h} style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}><span>{h.replace("BV TNH ","")}</span><span style={{fontWeight:600}}>{v[i]} tr₫</span></div>
            <div style={{height:5,background:"#f0f0f0",borderRadius:3}}><div style={{height:"100%",width:`${v[i]/1250*100}%`,background:"#714B67",borderRadius:3}}/></div>
          </div>;})}
        </div>
        <div style={{background:"#fff",borderRadius:4,border:"1px solid #e0e0e0",padding:14}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>NCC hàng đầu</div>
          {vendors.filter(v=>v.status==="Hoạt động").slice(0,4).map(v=>(
            <div key={v.id} onClick={()=>nav("VEN",v)} style={{padding:"5px 0",borderBottom:"1px solid #f5f5f5",cursor:"pointer"}}>
              <div style={{fontSize:11,fontWeight:500}}>{v.name}</div>
              <div style={{display:"flex",gap:6,fontSize:10,color:"#888"}}><span>{v.group}</span><span>⭐{v.rating}</span><span>{v.pos} PO</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ==================== MODULE CONTENT ROUTER ====================
  const getFormConfig = (module, record) => {
    const r = record;
    switch(module) {
      case "PR": return {
        fields:[
          {label:"Số PR",key:"id",value:r.id,ro:true,mono:true},{label:"Bệnh viện",key:"hospital",value:r.hospital,type:"select",options:HOSPITALS,required:true},
          {label:"Khoa/Phòng",key:"dept",value:r.dept,type:"select",options:["Khoa Dược","Phòng Vật tư","Khoa Ngoại","Khoa Xét nghiệm","Khoa Cấp cứu","Khoa CĐHA"],required:true},
          {label:"Người đề nghị",key:"requester",value:r.requester,ro:true},{label:"Ngày tạo",key:"date",value:r.date,ro:true},{label:"Ưu tiên",key:"priority",value:r.priority,type:"select",options:["Thấp","Trung bình","Cao","Khẩn"]},
          {label:"Mô tả",key:"name",value:r.name,full:true,required:true},{label:"Mục đích",key:"purpose",value:r.purpose||"",full:true},
          {label:"Số dòng",key:"lines",value:r.lines,ro:true},{label:"Giá trị",key:"amount",value:r.amount,ro:true},
        ],
        statuses:MODULE_STATUSES.PR,
        actions: <>
          {["Đã xác nhận","Đang thẩm định","Đang xử lý"].includes(r.status)&&<button onClick={()=>createRFQFromPR(r)} style={{padding:"5px 14px",borderRadius:4,border:"none",background:"#E9573F",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}>Tạo RFQ</button>}
        </>,
        crossRefs: [
          ...(r.rfqIds||[]).map(id=>({label:"RFQ",id,module:"RFQ"})),
        ],
      };
      case "RV": return {
        fields:[
          {label:"Mã",key:"id",value:r.id,ro:true,mono:true},{label:"Tên",key:"name",value:r.name,required:true},
          {label:"PR liên quan",key:"prId",value:r.prId,ro:true},{label:"Bệnh viện",key:"hospital",value:r.hospital,type:"select",options:HOSPITALS},
          {label:"Người thẩm định",key:"reviewer",value:r.reviewer},{label:"Ngày",key:"date",value:r.date,ro:true},
          {label:"Phân loại",key:"category",value:r.category,type:"select",options:["Dược phẩm","TBYT","Vật tư","Hóa chất","Hạ tầng"]},
          {label:"Giá trị",key:"amount",value:r.amount,ro:true},
          {label:"Kết quả",key:"result",value:r.result,full:true,type:"textarea"},{label:"Ghi chú",key:"notes",value:r.notes,full:true,type:"textarea"},
        ],
        statuses:MODULE_STATUSES.RV,
        crossRefs:[{label:"PR",id:r.prId,module:"PR"}],
      };
      case "SRC": return {
        fields:[
          {label:"Mã",key:"id",value:r.id,ro:true,mono:true},{label:"Tên",key:"name",value:r.name,required:true},
          {label:"PR liên quan",key:"prId",value:r.prId},{label:"Bệnh viện",key:"hospital",value:r.hospital,type:"select",options:HOSPITALS},
          {label:"Người tìm nguồn",key:"buyer",value:r.buyer},{label:"Ngày",key:"date",value:r.date,ro:true},
          {label:"Phân loại",key:"category",value:r.category,type:"select",options:["Dược phẩm","TBYT","Vật tư","Hóa chất"]},
          {label:"Số NCC tìm được",key:"vendorsFound",value:r.vendorsFound,ro:true},
          {label:"Ghi chú",key:"notes",value:r.notes,full:true,type:"textarea"},
        ],
        statuses:MODULE_STATUSES.SRC,
        crossRefs:[{label:"PR",id:r.prId,module:"PR"}],
      };
      case "RFQ": return {
        fields:[
          {label:"Mã RFQ",key:"id",value:r.id,ro:true,mono:true},{label:"Tên",key:"name",value:r.name,required:true},
          {label:"PR nguồn",key:"prId",value:r.prId},{label:"Bệnh viện",key:"hospital",value:r.hospital,type:"select",options:HOSPITALS},
          {label:"Người mua",key:"buyer",value:r.buyer},{label:"Ngày tạo",key:"date",value:r.date,ro:true},
          {label:"Hạn nhận báo giá",key:"deadline",value:r.deadline,required:true},{label:"Số dòng",key:"lines",value:r.lines,ro:true},
          {label:"Giá trị ước tính",key:"amount",value:r.amount,ro:true},
        ],
        statuses:MODULE_STATUSES.RFQ,
        actions: <>
          {["Đang nhận báo giá","Đã đóng","Hoàn tất"].includes(r.status)&&!r.bidId&&<button onClick={()=>createBIDFromRFQ(r)} style={{padding:"5px 14px",borderRadius:4,border:"none",background:"#9b59b6",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}>Tạo gói thầu</button>}
        </>,
        crossRefs:[
          {label:"PR",id:r.prId,module:"PR"},
          ...(r.qtnIds||[]).map(id=>({label:"QTN",id,module:"QTN"})),
          r.bidId?{label:"BID",id:r.bidId,module:"BID"}:null,
        ].filter(Boolean),
      };
      case "QTN": return {
        fields:[
          {label:"Mã",key:"id",value:r.id,ro:true,mono:true},{label:"Tên",key:"name",value:r.name,required:true},
          {label:"RFQ",key:"rfqId",value:r.rfqId,ro:true},{label:"NCC",key:"vendorName",value:r.vendorName,ro:true},
          {label:"Ngày gửi",key:"date",value:r.date,ro:true},{label:"Hiệu lực",key:"validity",value:r.validity},
          {label:"Giá trị",key:"amount",value:r.amount},{label:"Chiết khấu",key:"discount",value:r.discount},
          {label:"Thời gian giao (ngày)",key:"delivery",value:r.delivery},{label:"Số dòng",key:"lines",value:r.lines,ro:true},
          {label:"Ghi chú",key:"notes",value:r.notes,full:true,type:"textarea"},
        ],
        statuses:MODULE_STATUSES.QTN,
        crossRefs:[{label:"RFQ",id:r.rfqId,module:"RFQ"}],
      };
      case "TEC": return {
        fields:[
          {label:"Mã",key:"id",value:r.id,ro:true,mono:true},{label:"Tên",key:"name",value:r.name,required:true},
          {label:"Gói thầu",key:"bidId",value:r.bidId},{label:"RFQ",key:"rfqId",value:r.rfqId},
          {label:"NCC đánh giá",key:"vendorName",value:r.vendorName},{label:"Người đánh giá",key:"evaluator",value:r.evaluator},
          {label:"Điểm",key:"score",value:r.score},{label:"Điểm tối đa",key:"maxScore",value:r.maxScore,ro:true},
          {label:"Tiêu chí",key:"criteria",value:r.criteria,full:true},{label:"Ghi chú",key:"notes",value:r.notes,full:true,type:"textarea"},
        ],
        statuses:MODULE_STATUSES.TEC,
        crossRefs:[{label:"BID",id:r.bidId,module:"BID"},{label:"RFQ",id:r.rfqId,module:"RFQ"}].filter(x=>x.id),
      };
      case "CMP": return {
        fields:[
          {label:"Mã",key:"id",value:r.id,ro:true,mono:true},{label:"Tên",key:"name",value:r.name,required:true},
          {label:"Gói thầu",key:"bidId",value:r.bidId},{label:"RFQ",key:"rfqId",value:r.rfqId},
          {label:"Số NCC",key:"vendorCount",value:r.vendorCount,ro:true},{label:"Số hạng mục",key:"itemCount",value:r.itemCount,ro:true},
          {label:"NCC đề xuất",key:"recommendedVendorName",value:r.recommendedVendorName,ro:true},{label:"Tổng giá trị",key:"totalValue",value:r.totalValue,ro:true},
          {label:"Kết quả",key:"result",value:r.result,full:true,type:"textarea"},
        ],
        statuses:MODULE_STATUSES.CMP,
        crossRefs:[{label:"BID",id:r.bidId,module:"BID"},{label:"RFQ",id:r.rfqId,module:"RFQ"}].filter(x=>x.id),
      };
      case "AWD": return {
        fields:[
          {label:"Mã",key:"id",value:r.id,ro:true,mono:true},{label:"Tên",key:"name",value:r.name,required:true},
          {label:"NCC được chọn",key:"vendorName",value:r.vendorName,ro:true},{label:"Gói thầu",key:"bidId",value:r.bidId,ro:true},
          {label:"Bệnh viện",key:"hospital",value:r.hospital},{label:"Ngày",key:"date",value:r.date,ro:true},
          {label:"Giá trị",key:"amount",value:r.amount},{label:"Người duyệt",key:"approver",value:r.approver},
          {label:"Lý do lựa chọn",key:"reason",value:r.reason,full:true,type:"textarea"},
        ],
        statuses:MODULE_STATUSES.AWD,
        actions: <>
          {r.status==="Đang soạn"&&<button onClick={()=>createAPRFromAWD(r)} style={{padding:"5px 14px",borderRadius:4,border:"none",background:"#8CC152",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}>Gửi phê duyệt → APR</button>}
        </>,
        crossRefs:[{label:"BID",id:r.bidId,module:"BID"},{label:"APR",id:r.aprId,module:"APR"}].filter(x=>x.id),
      };
      case "APR": return {
        fields:[
          {label:"Mã",key:"id",value:r.id,ro:true,mono:true},{label:"Tên",key:"name",value:r.name,required:true},
          {label:"Loại nguồn",key:"sourceType",value:r.sourceType,ro:true},{label:"Mã nguồn",key:"sourceId",value:r.sourceId,ro:true},
          {label:"Người yêu cầu",key:"requester",value:r.requester,ro:true},{label:"Người duyệt",key:"approver",value:r.approver},
          {label:"Bệnh viện",key:"hospital",value:r.hospital},{label:"Ngày",key:"date",value:r.date,ro:true},
          {label:"Giá trị",key:"amount",value:r.amount,ro:true},{label:"Cấp duyệt",key:"level",value:r.level,type:"select",options:["Trưởng phòng","Phó Giám đốc","Giám đốc","Hội đồng"]},
          {label:"Hạn duyệt",key:"dueDate",value:r.dueDate},{label:"Ghi chú",key:"notes",value:r.notes,full:true,type:"textarea"},
        ],
        statuses:MODULE_STATUSES.APR,
        actions: <>
          {r.status==="Chờ duyệt"&&r.sourceType==="AWD"&&<button onClick={()=>approvePRAndCreatePO(r)} style={{padding:"5px 14px",borderRadius:4,border:"none",background:"#2E7D32",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}>Duyệt → Tạo PO</button>}
          {r.status==="Chờ duyệt"&&<button onClick={()=>{updateRecord("APR",r.id,{status:"Từ chối"});setRec(prev=>({...prev,status:"Từ chối"}));showToast("Đã từ chối");}} style={{padding:"5px 14px",borderRadius:4,border:"1px solid #ef4444",background:"#fff",color:"#ef4444",fontSize:12,cursor:"pointer"}}>Từ chối</button>}
        </>,
        crossRefs:[
          {label:r.sourceType,id:r.sourceId,module:r.sourceType},
          r.poId?{label:"PO",id:r.poId,module:"PO"}:null,
        ].filter(Boolean),
      };
      case "PO": return {
        fields:[
          {label:"Số PO",key:"id",value:r.id,ro:true,mono:true},{label:"NCC",key:"vendor",value:r.vendor,type:"select",options:vendors.map(v=>v.name),required:true},
          {label:"Bệnh viện",key:"hospital",value:r.hospital,type:"select",options:HOSPITALS},{label:"Ngày",key:"date",value:r.date,ro:true},
          {label:"Nguồn tạo",key:"source",value:r.source==="AWD"?"Kết quả lựa chọn":r.source==="CTR"?"Gọi hàng HĐ":"Đấu thầu",ro:true},
          {label:"Giá trị",key:"amount",value:r.amount+" ₫",ro:true},{label:"Số dòng",key:"lines",value:r.lines,ro:true},
        ],
        statuses:MODULE_STATUSES.PO,
        actions: <>
          {r.status==="Sẵn sàng"&&<button onClick={()=>publishPO(r)} style={{padding:"5px 14px",borderRadius:4,border:"none",background:"#22c55e",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}>Phát hành PO</button>}
          {r.status==="Đang soạn"&&<button onClick={()=>{updateRecord("PO",r.id,{status:"Sẵn sàng"});setRec(prev=>({...prev,status:"Sẵn sàng"}));showToast("PO sẵn sàng phát hành");}} style={{padding:"5px 14px",borderRadius:4,border:"none",background:"#14b8a6",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}>Sẵn sàng</button>}
          {["NCC xác nhận","Đã phát hành"].includes(r.status)&&<button onClick={()=>createRCVFromPO(r)} style={{padding:"5px 14px",borderRadius:4,border:"none",background:"#967ADC",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}>Tạo phiếu nhận hàng</button>}
        </>,
        crossRefs:[
          r.awdId?{label:"AWD",id:r.awdId,module:"AWD"}:null,
          r.aprId?{label:"APR",id:r.aprId,module:"APR"}:null,
          r.ctrId?{label:"CTR",id:r.ctrId,module:"CTR"}:null,
          ...(r.rcvIds||[]).map(id=>({label:"RCV",id,module:"RCV"})),
          ...(r.invIds||[]).map(id=>({label:"INV",id,module:"INV"})),
        ].filter(Boolean),
      };
      case "CTR": return {
        fields:[
          {label:"Mã",key:"id",value:r.id,ro:true,mono:true},{label:"Tên hợp đồng",key:"name",value:r.name,required:true},
          {label:"NCC",key:"vendorName",value:r.vendorName,ro:true},{label:"Bệnh viện",key:"hospital",value:r.hospital},
          {label:"Loại",key:"type",value:r.type,type:"select",options:["Hợp đồng khung","Hợp đồng dịch vụ","Hợp đồng cung cấp"]},
          {label:"Ngày ký",key:"signDate",value:r.signDate},{label:"Bắt đầu",key:"startDate",value:r.startDate},{label:"Kết thúc",key:"endDate",value:r.endDate},
          {label:"Giá trị",key:"amount",value:r.amount},{label:"Điều kiện",key:"terms",value:r.terms,full:true},
          {label:"Ghi chú",key:"notes",value:r.notes,full:true,type:"textarea"},
        ],
        statuses:MODULE_STATUSES.CTR,
        crossRefs:(r.poIds||[]).map(id=>({label:"PO",id,module:"PO"})),
      };
      case "RCV": return {
        fields:[
          {label:"Mã",key:"id",value:r.id,ro:true,mono:true},{label:"Tên",key:"name",value:r.name,required:true},
          {label:"PO",key:"poId",value:r.poId,ro:true},{label:"Bệnh viện",key:"hospital",value:r.hospital},
          {label:"Người nhận",key:"receiver",value:r.receiver},{label:"Ngày",key:"date",value:r.date,ro:true},
          {label:"Kho nhận",key:"warehouse",value:r.warehouse},{label:"Số dòng",key:"lines",value:r.lines,ro:true},
          {label:"Đã nhận",key:"receivedLines",value:r.receivedLines},{label:"Ghi chú",key:"notes",value:r.notes,full:true,type:"textarea"},
        ],
        statuses:MODULE_STATUSES.RCV,
        actions: <>
          {["Nhận đủ","Nhận một phần"].includes(r.status)&&!r.accId&&<button onClick={()=>createACCFromRCV(r)} style={{padding:"5px 14px",borderRadius:4,border:"none",background:"#967ADC",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}>Nghiệm thu → ACC</button>}
        </>,
        crossRefs:[{label:"PO",id:r.poId,module:"PO"},r.accId?{label:"ACC",id:r.accId,module:"ACC"}:null].filter(Boolean),
      };
      case "ACC": return {
        fields:[
          {label:"Mã",key:"id",value:r.id,ro:true,mono:true},{label:"Tên",key:"name",value:r.name,required:true},
          {label:"RCV",key:"rcvId",value:r.rcvId,ro:true},{label:"PO",key:"poId",value:r.poId,ro:true},
          {label:"Bệnh viện",key:"hospital",value:r.hospital},{label:"Người nghiệm thu",key:"inspector",value:r.inspector},
          {label:"Ngày",key:"date",value:r.date,ro:true},{label:"Kết quả",key:"result",value:r.result,type:"select",options:["","Đạt 100% tiêu chí","Đạt có điều kiện","Không đạt"]},
          {label:"Số dòng",key:"lines",value:r.lines,ro:true},{label:"Dòng đạt",key:"passedLines",value:r.passedLines},
          {label:"Ghi chú",key:"notes",value:r.notes,full:true,type:"textarea"},
        ],
        statuses:MODULE_STATUSES.ACC,
        actions: <>
          {r.status==="Đạt"&&!r.invId&&<button onClick={()=>createINVFromACC(r)} style={{padding:"5px 14px",borderRadius:4,border:"none",background:"#DA4453",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}>Đối chiếu hóa đơn → INV</button>}
        </>,
        crossRefs:[{label:"RCV",id:r.rcvId,module:"RCV"},{label:"PO",id:r.poId,module:"PO"},r.invId?{label:"INV",id:r.invId,module:"INV"}:null].filter(Boolean),
      };
      case "INV": {
        const matchIcon = (ok) => ok ? <span style={{color:"#22c55e",fontWeight:600}}>✓</span> : <span style={{color:"#ef4444",fontWeight:600}}>✕</span>;
        return {
          fields:[
            {label:"Mã",key:"id",value:r.id,ro:true,mono:true},{label:"Số hóa đơn",key:"invoiceNo",value:r.invoiceNo,required:true},
            {label:"NCC",key:"vendorName",value:r.vendorName,ro:true},{label:"PO",key:"poId",value:r.poId,ro:true},
            {label:"Bệnh viện",key:"hospital",value:r.hospital},{label:"Ngày",key:"date",value:r.date,ro:true},
            {label:"Giá trị trước thuế",key:"amount",value:r.amount},{label:"Thuế GTGT",key:"vat",value:r.vat},
            {label:"Tổng",key:"total",value:r.total},{label:"Ngày thanh toán",key:"paymentDate",value:r.paymentDate},
            {label:"Ghi chú",key:"notes",value:r.notes,full:true,type:"textarea"},
          ],
          statuses:MODULE_STATUSES.INV,
          crossRefs:[{label:"PO",id:r.poId,module:"PO"},{label:"RCV",id:r.rcvId,module:"RCV"},{label:"ACC",id:r.accId,module:"ACC"}].filter(x=>x.id),
          tabs: <div style={{background:"#fff",borderRadius:4,border:"1px solid #e0e0e0",padding:14,marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>3-Way Matching</div>
            <div style={{display:"flex",gap:16}}>
              <div style={{display:"flex",alignItems:"center",gap:4,fontSize:12}}>{matchIcon(r.matchPO)} PO {r.poId||"—"}</div>
              <div style={{display:"flex",alignItems:"center",gap:4,fontSize:12}}>{matchIcon(r.matchRCV)} RCV {r.rcvId||"—"}</div>
              <div style={{display:"flex",alignItems:"center",gap:4,fontSize:12}}>{matchIcon(r.matchACC)} ACC {r.accId||"—"}</div>
            </div>
            {r.matchPO&&r.matchRCV&&r.matchACC&&<div style={{marginTop:8,padding:"4px 10px",background:"#E8F5E9",borderRadius:4,fontSize:11,color:"#2E7D32",display:"inline-flex",alignItems:"center",gap:4}}><CheckCircle2 size={12}/>Đối chiếu thành công — đủ 3 chứng từ</div>}
          </div>,
        };
      }
      case "VEN": return {
        fields:[
          {label:"Mã NCC",key:"id",value:r.id,ro:true,mono:true},{label:"Tên",key:"name",value:r.name,required:true},
          {label:"MST",key:"tax",value:r.tax,required:true},{label:"Nhóm hàng",key:"group",value:r.group,type:"select",options:["Dược phẩm","TBYT","Vật tư","Hóa chất","Dịch vụ"]},
          {label:"Email",key:"email",value:r.email},{label:"Điện thoại",key:"phone",value:r.phone},
          {label:"Địa chỉ",key:"addr",value:r.addr,full:true},{label:"Cổng NCC",key:"portal",value:r.portal?"Đã kích hoạt":"Chưa kích hoạt",ro:true},
        ],
        statuses:MODULE_STATUSES.VEN,
      };
      default: return {
        fields:[
          {label:"Mã",key:"id",value:r.id,ro:true,mono:true},{label:"Tên",key:"name",value:r.name||""},
          {label:"Trạng thái",key:"status",value:r.status,type:"select",options:MODULE_STATUSES[module]||[]},{label:"Ngày",key:"date",value:r.date||"",ro:true},
        ],
        statuses:MODULE_STATUSES[module],
      };
    }
  };

  const getModuleCols = (module) => {
    switch(module) {
      case "PR": return {data:prs,cols:[{k:"id",label:"Số PR",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"name",label:"Mô tả"},{k:"hospital",label:"Bệnh viện",render:v=>v.replace("BV TNH ","")},{k:"dept",label:"Khoa"},{k:"requester",label:"Người đề nghị"},{k:"date",label:"Ngày"},{k:"lines",label:"Dòng",align:"center"},{k:"priority",label:"Ưu tiên",render:v=><span style={{color:v==="Khẩn"?"#ef4444":v==="Cao"?"#f59e0b":"#555",fontWeight:v==="Khẩn"?600:400}}>{v}</span>},{k:"amount",label:"Giá trị",align:"right",render:v=><span style={{fontWeight:500}}>{v} ₫</span>},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}]};
      case "RV": return {data:rvs,cols:[{k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"name",label:"Tên"},{k:"prId",label:"PR"},{k:"hospital",label:"BV",render:v=>v.replace("BV TNH ","")},{k:"reviewer",label:"Người thẩm định"},{k:"date",label:"Ngày"},{k:"category",label:"Phân loại"},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}]};
      case "SRC": return {data:srcs,cols:[{k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"name",label:"Tên"},{k:"prId",label:"PR"},{k:"hospital",label:"BV",render:v=>v.replace("BV TNH ","")},{k:"buyer",label:"Người tìm"},{k:"vendorsFound",label:"NCC",align:"center"},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}]};
      case "RFQ": return {data:rfqs,cols:[{k:"id",label:"Mã RFQ",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"name",label:"Mô tả"},{k:"prId",label:"PR"},{k:"hospital",label:"BV",render:v=>v.replace("BV TNH ","")},{k:"deadline",label:"Hạn nộp"},{k:"lines",label:"Dòng",align:"center"},{k:"amount",label:"Giá trị",align:"right",render:v=><span style={{fontWeight:500}}>{v} ₫</span>},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}]};
      case "QTN": return {data:qtns,cols:[{k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"name",label:"Mô tả"},{k:"rfqId",label:"RFQ"},{k:"vendorName",label:"NCC"},{k:"date",label:"Ngày"},{k:"amount",label:"Giá trị",align:"right",render:v=><span style={{fontWeight:500}}>{v} ₫</span>},{k:"discount",label:"CK"},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}]};
      case "TEC": return {data:tecs,cols:[{k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"name",label:"Tên"},{k:"vendorName",label:"NCC"},{k:"evaluator",label:"Người đánh giá"},{k:"score",label:"Điểm",align:"center",render:(v,r)=><span style={{fontWeight:600}}>{v}/{r.maxScore}</span>},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}]};
      case "CMP": return {data:cmps,cols:[{k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"name",label:"Tên"},{k:"vendorCount",label:"Số NCC",align:"center"},{k:"recommendedVendorName",label:"NCC đề xuất"},{k:"totalValue",label:"Giá trị",align:"right",render:v=><span style={{fontWeight:500}}>{v} ₫</span>},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}]};
      case "AWD": return {data:awds,cols:[{k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"name",label:"Tên"},{k:"vendorName",label:"NCC được chọn"},{k:"hospital",label:"BV"},{k:"amount",label:"Giá trị",align:"right",render:v=><span style={{fontWeight:500}}>{v} ₫</span>},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}]};
      case "APR": return {data:aprs,cols:[{k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"name",label:"Tên"},{k:"sourceType",label:"Loại"},{k:"sourceId",label:"Nguồn"},{k:"approver",label:"Người duyệt"},{k:"amount",label:"Giá trị",align:"right",render:v=><span style={{fontWeight:500}}>{v} ₫</span>},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}]};
      case "PO": return {data:pos,cols:[{k:"id",label:"Số PO",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"vendor",label:"NCC"},{k:"hospital",label:"BV",render:v=>v.replace("BV TNH ","")},{k:"date",label:"Ngày"},{k:"source",label:"Nguồn",render:v=><span style={{fontSize:10,padding:"1px 6px",background:"#f0f0f0",borderRadius:3}}>{v}</span>},{k:"lines",label:"Dòng",align:"center"},{k:"amount",label:"Giá trị",align:"right",render:v=><span style={{fontWeight:600}}>{v} ₫</span>},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}]};
      case "CTR": return {data:ctrs,cols:[{k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"name",label:"Tên HĐ"},{k:"vendorName",label:"NCC"},{k:"type",label:"Loại"},{k:"startDate",label:"Bắt đầu"},{k:"endDate",label:"Kết thúc"},{k:"amount",label:"Giá trị",align:"right",render:v=><span style={{fontWeight:500}}>{v} ₫</span>},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}]};
      case "RCV": return {data:rcvs,cols:[{k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"name",label:"Mô tả"},{k:"poId",label:"PO"},{k:"hospital",label:"BV",render:v=>v.replace("BV TNH ","")},{k:"receiver",label:"Người nhận"},{k:"receivedLines",label:"Đã nhận",align:"center",render:(v,r)=><span>{v}/{r.lines}</span>},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}]};
      case "ACC": return {data:accs,cols:[{k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"name",label:"Mô tả"},{k:"poId",label:"PO"},{k:"hospital",label:"BV",render:v=>v.replace("BV TNH ","")},{k:"inspector",label:"Người NT"},{k:"passedLines",label:"Đạt",align:"center",render:(v,r)=><span>{v}/{r.lines}</span>},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}]};
      case "INV": return {data:invs,cols:[{k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"invoiceNo",label:"Số HĐ"},{k:"vendorName",label:"NCC"},{k:"poId",label:"PO"},{k:"total",label:"Tổng",align:"right",render:v=><span style={{fontWeight:600}}>{v} ₫</span>},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>},{k:"matchPO",label:"PO",align:"center",render:v=>v?<span style={{color:"#22c55e"}}>✓</span>:<span style={{color:"#ef4444"}}>✕</span>},{k:"matchRCV",label:"RCV",align:"center",render:v=>v?<span style={{color:"#22c55e"}}>✓</span>:<span style={{color:"#ef4444"}}>✕</span>},{k:"matchACC",label:"ACC",align:"center",render:v=>v?<span style={{color:"#22c55e"}}>✓</span>:<span style={{color:"#ef4444"}}>✕</span>}]};
      case "VEN": return {data:vendors,cols:[{k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"name",label:"Tên NCC"},{k:"tax",label:"MST"},{k:"group",label:"Nhóm"},{k:"rating",label:"Đánh giá",align:"center",render:v=><span>⭐{v}</span>},{k:"contracts",label:"HĐ",align:"center"},{k:"pos",label:"PO",align:"center"},{k:"portal",label:"Cổng",render:v=>v?<Badge s="Hoạt động" size="xs"/>:<span style={{fontSize:10,color:"#aaa"}}>Chưa</span>},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}]};
      default: return null;
    }
  };

  const SysModule = () => (
    <div style={{flex:1,padding:18,overflowY:"auto"}}>
      <h2 style={{fontSize:17,fontWeight:700,marginBottom:16}}>Cấu hình hệ thống</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {[["Cấu hình chung","Thông tin tập đoàn, bệnh viện, phòng ban",Settings],["Quy trình phê duyệt","Cấu hình luồng duyệt theo giá trị",CheckCircle2],["Trọng số đánh giá","Cấu hình trọng số so sánh NCC",Scale],["Người dùng & Quyền","Quản lý tài khoản và phân quyền",Users],["Mẫu in ấn","Quản lý template PO, hợp đồng",Printer],["Nhật ký hệ thống","Xem log hoạt động",Activity]].map(([t,d,I])=>(
          <div key={t} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:16,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.06)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><I size={20} color="#714B67"/><div><div style={{fontSize:13,fontWeight:600}}>{t}</div><div style={{fontSize:11,color:"#888"}}>{d}</div></div></div>
          </div>
        ))}
        <div onClick={()=>setConfirmDialog({title:"Khôi phục dữ liệu mẫu",message:"Bạn có chắc muốn khôi phục dữ liệu mẫu? Tất cả thay đổi sẽ mất.",onConfirm:resetAllData})} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:16,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.06)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><RotateCcw size={20} color="#ef4444"/><div><div style={{fontSize:13,fontWeight:600,color:"#ef4444"}}>Reset dữ liệu mẫu</div><div style={{fontSize:11,color:"#888"}}>Khôi phục toàn bộ dữ liệu về trạng thái ban đầu</div></div></div>
        </div>
      </div>
    </div>
  );

  const RptModule = () => (
    <div style={{flex:1,padding:18,overflowY:"auto"}}>
      <h2 style={{fontSize:17,fontWeight:700,marginBottom:16}}>Báo cáo</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
        {[["Tổng hợp mua sắm","Báo cáo chi tiêu theo tháng/quý",BarChart3,"#714B67"],["Phân tích NCC","Đánh giá hiệu suất nhà cung cấp",Building2,"#37BC9B"],["Tiến độ đấu thầu","Theo dõi trạng thái các gói thầu",Gavel,"#9b59b6"],["Chi tiêu theo BV","So sánh ngân sách vs thực tế",PieChart,"#3BAFDA"],["Bảo trì & Bảo hành","Tổng hợp tình trạng thiết bị",Wrench,"#E67E22"],["Hợp đồng sắp hết hạn","Cảnh báo gia hạn HĐ",AlertTriangle,"#ef4444"]].map(([t,d,I,c])=>(
          <div key={t} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:16,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.06)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
            <I size={24} color={c}/>
            <div style={{fontSize:13,fontWeight:600,marginTop:8}}>{t}</div>
            <div style={{fontSize:11,color:"#888",marginTop:4}}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const MdModule = () => (
    <div style={{flex:1,padding:18,overflowY:"auto"}}>
      <h2 style={{fontSize:17,fontWeight:700,marginBottom:16}}>Dữ liệu chủ</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {[["Danh mục hàng hóa",1250,Package],["Bệnh viện & Khoa phòng",4*15,Building2],["Đơn vị tính",45,Tag],["Nhóm hàng",12,Layers],["Kho & Địa điểm",16,Warehouse],["Mẫu biểu",8,FileText]].map(([t,c,I])=>(
          <div key={t} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14,cursor:"pointer",display:"flex",alignItems:"center",gap:12}} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.06)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
            <I size={20} color="#714B67"/>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{t}</div></div>
            <span style={{fontSize:12,color:"#888"}}>{c} mục</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ==================== GENERIC MODULE CONTENT ====================
  const getContent = () => {
    if(mod==="dashboard") return <Dashboard/>;
    if(mod==="PORTAL") return <VendorPortal/>;
    if(mod==="BID") return <BiddingModule/>;
    if(mod==="MNT") return <MaintenanceModule/>;
    if(mod==="SYS") return <SysModule/>;
    if(mod==="RPT") return <RptModule/>;
    if(mod==="MD") return <MdModule/>;

    if(rec && view==="form") {
      const config = getFormConfig(mod, rec);
      return <FormView record={rec} fields={config.fields} statuses={config.statuses} actions={config.actions} tabs={config.tabs} crossRefs={config.crossRefs}/>;
    }

    const modCfg = getModuleCols(mod);
    if(!modCfg) return <div style={{flex:1,padding:40,textAlign:"center",color:"#aaa"}}>Module {mod} đang phát triển</div>;

    const currentView = viewPrefs[mod] || view;
    return currentView==="kanban"
      ? <Kanban data={modCfg.data} onCard={r=>nav(mod,r)}/>
      : <Table data={modCfg.data} cols={modCfg.cols} onRow={r=>nav(mod,r)}/>;
  };

  const needCtrl = !["dashboard","PORTAL","BID","MNT","SYS","RPT","MD"].includes(mod) && !rec;

  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"'Segoe UI',-apple-system,system-ui,sans-serif",fontSize:13,color:"#333",background:"#f0eff4"}}>
      <Sidebar2/>
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <TopBar/>
        {mod==="BID"&&!bidDetail&&<CtrlPanel count={bids.length} module="BID" extra={<div style={{display:"flex",border:"1px solid #ddd",borderRadius:4,overflow:"hidden"}}>{[["list","Danh sách"],["kanban","Kanban"]].map(([v,l])=><button key={v} onClick={()=>{setBidTab(v);setViewPrefs(p=>({...p,BID:v}));}} style={{padding:"3px 10px",border:"none",background:(viewPrefs["BID"]||bidTab)===v?"#714B67":"#fff",color:(viewPrefs["BID"]||bidTab)===v?"#fff":"#666",cursor:"pointer",fontSize:11}}>{l}</button>)}</div>}/>}
        {mod==="MNT"&&!mntDetail&&<CtrlPanel count={mntTab==="assets"?maintenance.length:mntTab==="orders"?maintOrders.length:undefined} module="MNT"/>}
        {needCtrl&&<CtrlPanel count={getModuleCount(mod)} module={mod}/>}
        {getContent()}
      </div>

      {/* Toast */}
      {toast&&<div style={{position:"fixed",bottom:20,right:20,padding:"10px 18px",borderRadius:6,fontSize:12,fontWeight:500,color:"#fff",background:toast.type==="error"?"#ef4444":"#22c55e",boxShadow:"0 4px 12px rgba(0,0,0,.15)",zIndex:1000,display:"flex",alignItems:"center",gap:6,animation:"slideIn .2s ease"}}>
        {toast.type==="error"?<AlertCircle size={14}/>:<CheckCircle2 size={14}/>}{toast.msg}
      </div>}

      {/* Confirm Dialog */}
      {confirmDialog&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
        <div style={{background:"#fff",borderRadius:8,padding:24,maxWidth:400,width:"90%",boxShadow:"0 8px 30px rgba(0,0,0,.2)"}}>
          <div style={{fontSize:15,fontWeight:700,marginBottom:8}}>{confirmDialog.title}</div>
          <div style={{fontSize:12,color:"#666",marginBottom:18}}>{confirmDialog.message}</div>
          <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
            <button onClick={()=>setConfirmDialog(null)} style={{padding:"6px 16px",border:"1px solid #ddd",borderRadius:4,background:"#fff",fontSize:12,cursor:"pointer"}}>Hủy</button>
            <button onClick={()=>{confirmDialog.onConfirm();setConfirmDialog(null);}} style={{padding:"6px 16px",border:"none",borderRadius:4,background:"#ef4444",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}>Xác nhận</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
