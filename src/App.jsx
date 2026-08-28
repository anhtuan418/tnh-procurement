import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Search, Bell, ChevronDown, ChevronRight, Menu, X, Plus, Filter, LayoutGrid, List, MoreVertical, ArrowLeft, Paperclip, Send, Clock, CheckCircle2, AlertCircle, FileText, Users, ShoppingCart, ClipboardCheck, Truck, Package, BarChart3, Settings, Building2, Star, Eye, Edit3, Trash2, Download, Upload, MessageSquare, Activity, Globe, Shield, TrendingUp, TrendingDown, DollarSign, Calendar, Hash, Tag, Layers, RefreshCw, ExternalLink, Home, ChevronLeft, UserCheck, Award, Scale, Gavel, Receipt, Warehouse, BadgeCheck, Boxes, CircleDot, Zap, Wrench, Hammer, ThermometerSun, Timer, AlertTriangle, Target, PieChart, ArrowUpDown, Lock, Unlock, Copy, Share2, Printer, RotateCcw, PlayCircle, PauseCircle, StopCircle, MapPin, Phone, Mail, Link2, Info, HelpCircle, Maximize2, Minimize2, GripVertical, Move } from "lucide-react";

const HOSPITALS = ["BV TNH Thái Nguyên", "BV TNH Phổ Yên", "BV TNH Việt Yên", "BV TNH Lạng Sơn"];

const MENU_GROUPS = [
  { label: "MUA SẮM", items: ["PR","RV","SRC","RFQ","QTN"] },
  { label: "ĐẤU GIÁ & LỰA CHỌN", items: ["BID","TEC","CMP","AWD","APR"] },
  { label: "THỰC HIỆN", items: ["PO","CTR","RCV","ACC","INV"] },
  { label: "QUẢN TRỊ", items: ["MD","VEN","MNT","RPT","SYS"] },
  { label: "CỔNG NCC", items: ["PORTAL"] },
];

const MODULES = {
  dashboard:{ name:"Tổng quan", icon: Home, color:"#714B67" },
  MD:{ name:"Dữ liệu chủ", icon: Layers, color:"#714B67", count:1250 },
  PR:{ name:"Yêu cầu mua", icon: FileText, color:"#017E84", count:48 },
  RV:{ name:"Thẩm định", icon: ClipboardCheck, color:"#017E84", count:15 },
  SRC:{ name:"Tìm nguồn", icon: Search, color:"#E9573F", count:8 },
  RFQ:{ name:"Yêu cầu báo giá", icon: Send, color:"#E9573F", count:12 },
  QTN:{ name:"Báo giá NCC", icon: Receipt, color:"#E9573F", count:23 },
  BID:{ name:"Đấu thầu / Bidding", icon: Gavel, color:"#9b59b6", count:6 },
  TEC:{ name:"Đánh giá kỹ thuật", icon: BadgeCheck, color:"#F6BB42", count:7 },
  CMP:{ name:"So sánh tự động", icon: Scale, color:"#F6BB42", count:5 },
  AWD:{ name:"Lựa chọn NCC", icon: Award, color:"#F6BB42", count:4 },
  APR:{ name:"Phê duyệt", icon: CheckCircle2, color:"#8CC152", count:9 },
  PO:{ name:"Đơn đặt hàng", icon: ShoppingCart, color:"#3BAFDA", count:35 },
  CTR:{ name:"Hợp đồng", icon: Scale, color:"#3BAFDA", count:18 },
  RCV:{ name:"Giao nhận", icon: Truck, color:"#967ADC", count:11 },
  ACC:{ name:"Nghiệm thu", icon: UserCheck, color:"#967ADC", count:6 },
  INV:{ name:"Hóa đơn", icon: DollarSign, color:"#DA4453", count:14 },
  VEN:{ name:"Nhà cung cấp", icon: Building2, color:"#37BC9B", count:156 },
  MNT:{ name:"Bảo trì & Bảo hành", icon: Wrench, color:"#E67E22", count:42 },
  RPT:{ name:"Báo cáo", icon: BarChart3, color:"#4A89DC" },
  SYS:{ name:"Cấu hình", icon: Settings, color:"#656D78" },
  PORTAL:{ name:"Cổng NCC", icon: Globe, color:"#E9573F" },
};

// ========== STATUS STYLING ==========
const SC = {
  "Đang soạn":"#94a3b8","Chờ xác nhận":"#f59e0b","Đã xác nhận":"#22c55e","Đang thẩm định":"#3b82f6",
  "Đang xử lý":"#3b82f6","Hoàn tất":"#16a34a","Đã hủy":"#ef4444","Đã phát hành":"#22c55e",
  "Chờ duyệt":"#f97316","Đã duyệt":"#16a34a","NCC xác nhận":"#06b6d4","Hiệu lực":"#22c55e",
  "Hoạt động":"#22c55e","Đã gửi":"#8b5cf6","Sẵn sàng":"#14b8a6","Đang nhận báo giá":"#3b82f6",
  "Niêm phong":"#6366f1","Đã mở":"#f59e0b","Đang đấu thầu":"#9b59b6","Chờ mở thầu":"#e67e22",
  "Đã chấm":"#22c55e","Từ chối":"#ef4444","Trả lại":"#f97316","Có điều kiện":"#f59e0b",
  "Tạm ngừng":"#ef4444","Đang bảo trì":"#e67e22","Hết bảo hành":"#ef4444","Còn bảo hành":"#22c55e",
  "Quá hạn":"#ef4444","Lên kế hoạch":"#3b82f6","Đang thực hiện":"#f59e0b",
};
const Badge = ({s,size="sm"}) => {
  const c = SC[s]||"#94a3b8";
  const p = size==="xs" ? "1px 6px" : "2px 10px";
  const f = size==="xs" ? "10px" : "11px";
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:p,borderRadius:12,fontSize:f,fontWeight:500,background:`${c}18`,color:c,border:`1px solid ${c}40`,whiteSpace:"nowrap"}}><span style={{width:6,height:6,borderRadius:"50%",background:c}}/>{s}</span>;
};

// ========== SAMPLE DATA ==========
const VENDORS = [
  {id:"NCC-001",name:"Công ty CP Dược phẩm Hà Nội",tax:"0100107518",status:"Hoạt động",group:"Dược phẩm",rating:4.2,contracts:3,pos:12,email:"lienhe@duocphamhn.vn",phone:"024-3851-2345",addr:"170 La Thành, Đống Đa, HN",portal:true},
  {id:"NCC-002",name:"Công ty TNHH TBYT Quốc Tế Medic",tax:"0312456789",status:"Hoạt động",group:"TBYT",rating:3.8,contracts:1,pos:5,email:"sales@medic-intl.vn",phone:"028-3845-6789",addr:"45 Nguyễn Thị Minh Khai, Q1, HCM",portal:true},
  {id:"NCC-003",name:"Công ty CP Hóa chất Việt Nam",tax:"0100234567",status:"Có điều kiện",group:"Hóa chất",rating:3.5,contracts:2,pos:8,email:"info@vietcochemical.vn",phone:"024-3942-1111",addr:"23 Lạc Long Quân, Tây Hồ, HN",portal:true},
  {id:"NCC-004",name:"Công ty TNHH Vật tư Y tế Sài Gòn",tax:"0309876543",status:"Hoạt động",group:"Vật tư",rating:4.5,contracts:4,pos:20,email:"sg.medical@gmail.com",phone:"028-3921-7777",addr:"88 Trần Hưng Đạo, Q5, HCM",portal:false},
  {id:"NCC-005",name:"Công ty CP Thiết bị Đông Á",tax:"0100998877",status:"Hoạt động",group:"TBYT",rating:4.0,contracts:2,pos:9,email:"dongamedical@vn.com",phone:"024-3755-4321",addr:"12 Phạm Hùng, Nam Từ Liêm, HN",portal:true},
];

const PRS = [
  {id:"PR-TN-2026-000045",name:"Dự trù thuốc tháng 9/2026",hospital:"BV TNH Thái Nguyên",dept:"Khoa Dược",requester:"Nguyễn Thị Hoa",date:"25/08/2026",status:"Đang thẩm định",priority:"Cao",lines:24,amount:"245.000.000"},
  {id:"PR-PY-2026-000032",name:"Vật tư tiêu hao Q4/2026",hospital:"BV TNH Phổ Yên",dept:"Phòng Vật tư",requester:"Trần Văn Minh",date:"24/08/2026",status:"Chờ xác nhận",priority:"Trung bình",lines:18,amount:"89.500.000"},
  {id:"PR-VY-2026-000028",name:"TBYT phòng mổ bổ sung",hospital:"BV TNH Việt Yên",dept:"Khoa Ngoại",requester:"Lê Thị Lan",date:"23/08/2026",status:"Đã xác nhận",priority:"Cao",lines:5,amount:"1.250.000.000"},
  {id:"PR-LS-2026-000019",name:"Hóa chất xét nghiệm tháng 10",hospital:"BV TNH Lạng Sơn",dept:"Khoa Xét nghiệm",requester:"Phạm Đức Anh",date:"22/08/2026",status:"Đang soạn",priority:"Trung bình",lines:12,amount:"156.000.000"},
  {id:"PR-TN-2026-000044",name:"Thuốc cấp cứu bổ sung khẩn",hospital:"BV TNH Thái Nguyên",dept:"Khoa Cấp cứu",requester:"Vũ Minh Tuấn",date:"21/08/2026",status:"Đang xử lý",priority:"Khẩn",lines:8,amount:"67.800.000"},
  {id:"PR-PY-2026-000031",name:"Găng tay y tế tháng 9",hospital:"BV TNH Phổ Yên",dept:"Phòng Vật tư",requester:"Trần Văn Minh",date:"20/08/2026",status:"Hoàn tất",priority:"Thấp",lines:3,amount:"45.000.000"},
];

const POS = [
  {id:"PO-TN-2026-000123",vendor:"Công ty CP Dược phẩm Hà Nội",vendorId:"NCC-001",hospital:"BV TNH Thái Nguyên",date:"20/08/2026",status:"NCC xác nhận",amount:"189.500.000",source:"AWD",lines:15},
  {id:"PO-PY-2026-000098",vendor:"Công ty TNHH TBYT Quốc Tế Medic",vendorId:"NCC-002",hospital:"BV TNH Phổ Yên",date:"18/08/2026",status:"Đã phát hành",amount:"456.000.000",source:"CTR",lines:8},
  {id:"PO-VY-2026-000087",vendor:"Công ty CP Hóa chất Việt Nam",vendorId:"NCC-003",hospital:"BV TNH Việt Yên",date:"15/08/2026",status:"Đang soạn",amount:"78.200.000",source:"AWD",lines:6},
  {id:"PO-LS-2026-000075",vendor:"Công ty TNHH Vật tư Y tế Sài Gòn",vendorId:"NCC-004",hospital:"BV TNH Lạng Sơn",date:"12/08/2026",status:"Hoàn tất",amount:"234.000.000",source:"BID",lines:10},
];

const BIDS = [
  {id:"BID-2026-0012",name:"Đấu thầu thuốc kháng sinh Q4/2026",type:"Đấu thầu rộng rãi",status:"Đang đấu thầu",hospital:"Tập trung 4 BV",openDate:"01/09/2026",closeDate:"15/09/2026",budget:"2.500.000.000",vendors:["NCC-001","NCC-003","NCC-005"],lines:32,bidsReceived:2,method:"Niêm phong"},
  {id:"BID-2026-0011",name:"Thiết bị siêu âm Doppler màu",type:"Chào giá cạnh tranh",status:"Đã chấm",hospital:"BV TNH Thái Nguyên",openDate:"10/08/2026",closeDate:"25/08/2026",budget:"850.000.000",vendors:["NCC-002","NCC-005"],lines:3,bidsReceived:2,method:"Niêm phong",winner:"NCC-002"},
  {id:"BID-2026-0010",name:"Vật tư tiêu hao theo hợp đồng khung",type:"Hợp đồng khung",status:"Chờ mở thầu",hospital:"Tập trung 4 BV",openDate:"28/08/2026",closeDate:"10/09/2026",budget:"1.200.000.000",vendors:["NCC-001","NCC-003","NCC-004"],lines:45,bidsReceived:3,method:"Niêm phong"},
  {id:"BID-2026-0009",name:"Hóa chất xét nghiệm chuyên dụng",type:"Đấu thầu hạn chế",status:"Đã duyệt",hospital:"BV TNH Việt Yên",openDate:"01/08/2026",closeDate:"15/08/2026",budget:"560.000.000",vendors:["NCC-003"],lines:18,bidsReceived:1,method:"Mở ngay",winner:"NCC-003"},
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

const MAINTENANCE = [
  {id:"MNT-TN-001",name:"Máy siêu âm GE Logiq P9",serial:"SN-2024-GE-0091",hospital:"BV TNH Thái Nguyên",dept:"Khoa Chẩn đoán hình ảnh",type:"TBYT",category:"Chẩn đoán",status:"Còn bảo hành",warrantyEnd:"15/03/2027",lastMaint:"01/07/2026",nextMaint:"01/10/2026",maintCycle:90,vendor:"NCC-002",purchaseDate:"15/03/2025",value:"1.200.000.000",condition:"Tốt"},
  {id:"MNT-PY-002",name:"Máy xét nghiệm sinh hóa Beckman AU680",serial:"SN-2023-BK-0045",hospital:"BV TNH Phổ Yên",dept:"Khoa Xét nghiệm",type:"TBYT",category:"Xét nghiệm",status:"Đang bảo trì",warrantyEnd:"20/12/2025",lastMaint:"15/08/2026",nextMaint:"15/11/2026",maintCycle:90,vendor:"NCC-005",purchaseDate:"20/12/2023",value:"2.800.000.000",condition:"Cần sửa chữa"},
  {id:"MNT-VY-003",name:"Máy thở Dräger Savina 300",serial:"SN-2024-DR-0023",hospital:"BV TNH Việt Yên",dept:"Khoa Hồi sức",type:"TBYT",category:"Hồi sức",status:"Còn bảo hành",warrantyEnd:"10/06/2027",lastMaint:"20/06/2026",nextMaint:"20/09/2026",maintCycle:90,vendor:"NCC-002",purchaseDate:"10/06/2025",value:"680.000.000",condition:"Tốt"},
  {id:"MNT-LS-004",name:"Bàn mổ Maquet Magnus",serial:"SN-2022-MQ-0012",hospital:"BV TNH Lạng Sơn",dept:"Khoa Ngoại",type:"TBYT",category:"Phẫu thuật",status:"Hết bảo hành",warrantyEnd:"05/01/2025",lastMaint:"10/05/2026",nextMaint:"10/08/2026",maintCycle:90,vendor:"NCC-005",purchaseDate:"05/01/2023",value:"950.000.000",condition:"Trung bình"},
  {id:"MNT-TN-005",name:"Máy CT Scanner 64 lát cắt",serial:"SN-2023-SI-0008",hospital:"BV TNH Thái Nguyên",dept:"Khoa CĐHA",type:"TBYT",category:"Chẩn đoán",status:"Lên kế hoạch",warrantyEnd:"01/11/2026",lastMaint:"01/03/2026",nextMaint:"01/09/2026",maintCycle:180,vendor:"NCC-002",purchaseDate:"01/11/2023",value:"15.500.000.000",condition:"Tốt"},
  {id:"MNT-PY-006",name:"Hệ thống lọc nước RO",serial:"SN-2024-RO-0003",hospital:"BV TNH Phổ Yên",dept:"Khoa Thận nhân tạo",type:"Hạ tầng",category:"Hạ tầng",status:"Quá hạn",warrantyEnd:"30/06/2026",lastMaint:"15/02/2026",nextMaint:"15/05/2026",maintCycle:90,vendor:"NCC-004",purchaseDate:"01/01/2024",value:"450.000.000",condition:"Cần thay linh kiện"},
];

const MAINT_ORDERS = [
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

  const cur = MODULES[mod];
  const nav = useCallback((m,r=null) => { setMod(m); setRec(r); setView(r?"form":"list"); setBidDetail(null); setMntDetail(null); },[]);
  const toggleG = l => setGroups(p=>p.includes(l)?p.filter(x=>x!==l):[...p,l]);

  // ==================== SIDEBAR ====================
  const Sidebar = () => (
    <div style={{width:sidebar?236:0,minHeight:"100vh",background:"#1B1B2F",color:"#ccc",transition:"width .2s",overflow:"hidden",flexShrink:0,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"10px 14px",borderBottom:"1px solid #2E2E4A",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:34,height:34,borderRadius:8,background:"linear-gradient(135deg,#714B67,#9b59b6)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:12}}>TNH</div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#fff"}}>TNH Procurement</div><div style={{fontSize:10,color:"#777"}}>Quản trị Mua sắm v2.0</div></div>
      </div>
      <div onClick={()=>nav("dashboard")} style={{padding:"8px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontSize:13,background:mod==="dashboard"?"#714B67":"transparent",color:mod==="dashboard"?"#fff":"#ccc",margin:"4px 6px",borderRadius:4}}>
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
              return <div key={id} onClick={()=>nav(id)} style={{padding:"6px 14px 6px 26px",cursor:"pointer",display:"flex",alignItems:"center",gap:9,fontSize:12.5,background:a?"#714B67":"transparent",color:a?"#fff":"#bbb",margin:"1px 6px",borderRadius:4,transition:".1s"}}
                onMouseEnter={e=>{if(!a)e.currentTarget.style.background="#2E2E4A"}} onMouseLeave={e=>{if(!a)e.currentTarget.style.background="transparent"}}>
                <I size={14}/><span style={{flex:1}}>{m.name}</span>
                {m.count&&<span style={{fontSize:10,background:a?"rgba(255,255,255,.2)":"#2E2E4A",padding:"1px 6px",borderRadius:8}}>{m.count}</span>}
              </div>;
            })}
          </div>
        ))}
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
      <div style={{position:"relative"}}><Bell size={16} style={{cursor:"pointer"}}/><div style={{position:"absolute",top:-4,right:-4,width:15,height:15,borderRadius:"50%",background:"#E9573F",fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>9</div></div>
      <select style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",fontSize:11,padding:"3px 6px",borderRadius:4}}>
        <option style={{color:"#333"}}>Tất cả bệnh viện</option>
        {HOSPITALS.map(h=><option key={h} style={{color:"#333"}}>{h}</option>)}
      </select>
    </div>
  );

  // ==================== CONTROL PANEL ====================
  const CtrlPanel = ({count,extra}) => (
    <div style={{padding:"8px 16px",background:"#fff",borderBottom:"1px solid #e0e0e0",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
      <button style={{background:"#714B67",color:"#fff",border:"none",padding:"5px 14px",borderRadius:4,fontSize:12,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Plus size={13}/> Tạo mới</button>
      <div style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",border:"1px solid #ddd",borderRadius:4,fontSize:12,cursor:"pointer",color:"#555"}}><Filter size={12}/> Bộ lọc <ChevronDown size={10}/></div>
      <div style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",border:"1px solid #ddd",borderRadius:4,fontSize:12,cursor:"pointer",color:"#555"}}><Layers size={12}/> Nhóm theo <ChevronDown size={10}/></div>
      {extra}
      <div style={{flex:1}}/>
      {count!=null&&<span style={{fontSize:12,color:"#888"}}>{count} bản ghi</span>}
      <div style={{display:"flex",border:"1px solid #ddd",borderRadius:4,overflow:"hidden"}}>
        {[["list",List],["kanban",LayoutGrid]].map(([v,I])=><button key={v} onClick={()=>setView(v)} style={{padding:"3px 7px",border:"none",background:view===v?"#714B67":"#fff",color:view===v?"#fff":"#666",cursor:"pointer"}}><I size={14}/></button>)}
      </div>
    </div>
  );

  // ==================== TABLE COMPONENT ====================
  const Table = ({data,cols,onRow}) => (
    <div style={{flex:1,overflowY:"auto",background:"#fff"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead><tr style={{background:"#f8f9fa",position:"sticky",top:0,zIndex:1}}>
          <th style={{padding:"7px 10px",width:28}}><input type="checkbox"/></th>
          {cols.map(c=><th key={c.k} style={{padding:"7px 10px",textAlign:c.align||"left",fontWeight:600,color:"#555",borderBottom:"2px solid #dee2e6",whiteSpace:"nowrap"}}>{c.label}</th>)}
        </tr></thead>
        <tbody>{data.map((r,i)=>(
          <tr key={i} onClick={()=>onRow?.(r)} style={{cursor:"pointer",borderBottom:"1px solid #f0f0f0"}} onMouseEnter={e=>e.currentTarget.style.background="#faf8f9"} onMouseLeave={e=>e.currentTarget.style.background=""}>
            <td style={{padding:"7px 10px"}}><input type="checkbox" onClick={e=>e.stopPropagation()}/></td>
            {cols.map(c=><td key={c.k} style={{padding:"7px 10px",textAlign:c.align||"left"}}>{c.render?c.render(r[c.k],r):r[c.k]}</td>)}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );

  // ==================== KANBAN ====================
  const Kanban = ({data,groupBy="status",onCard}) => {
    const g={}; data.forEach(d=>{const k=d[groupBy]||"—"; if(!g[k])g[k]=[]; g[k].push(d);});
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
            </div>
          ))}
        </div>
      ))}
    </div></div>;
  };

  // ==================== FORM VIEW ====================
  const Form = ({record,fields,statuses,tabs}) => (
    <div style={{flex:1,overflowY:"auto",background:"#f0eff4"}}>
      <div style={{maxWidth:960,margin:"0 auto",padding:"14px 18px"}}>
        {statuses&&<div style={{display:"flex",gap:0,background:"#f8f9fa",borderRadius:4,overflow:"hidden",border:"1px solid #dee2e6",marginBottom:14}}>
          {statuses.map((s,i)=>{const a=s===record.status;const p=statuses.indexOf(record.status)>i;
            return <div key={s} style={{flex:1,padding:"5px 10px",fontSize:11,fontWeight:a?600:400,textAlign:"center",background:a?"#714B67":p?"#d4c5cf":"transparent",color:a?"#fff":p?"#714B67":"#888",borderRight:i<statuses.length-1?"1px solid #dee2e6":"none",cursor:"pointer"}}>{s}</div>;
          })}
        </div>}
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          <button style={{padding:"5px 14px",borderRadius:4,border:"none",background:"#714B67",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}>Lưu</button>
          <button style={{padding:"5px 14px",borderRadius:4,border:"1px solid #ddd",background:"#fff",color:"#555",fontSize:12,cursor:"pointer"}}>Hủy bỏ</button>
          <div style={{flex:1}}/>
          <button style={{padding:"5px 14px",borderRadius:4,border:"none",background:"#2E7D32",color:"#fff",fontSize:12,cursor:"pointer",fontWeight:500}}>Gửi duyệt</button>
          <button style={{padding:"5px 10px",borderRadius:4,border:"1px solid #ddd",background:"#fff",color:"#555",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><Paperclip size={12}/>Đính kèm</button>
          <button style={{padding:"5px 10px",borderRadius:4,border:"1px solid #ddd",background:"#fff",color:"#555",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><Printer size={12}/>In</button>
        </div>
        <div style={{background:"#fff",borderRadius:4,border:"1px solid #e0e0e0",padding:18,marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {fields.map((f,i)=>(
              <div key={i} style={{gridColumn:f.full?"1/-1":undefined}}>
                <label style={{fontSize:11,color:"#888",fontWeight:500,display:"block",marginBottom:3}}>{f.label}</label>
                {f.type==="select"?<select style={{width:"100%",padding:"5px 8px",border:"1px solid #ddd",borderRadius:4,fontSize:12,background:"#fff"}}><option>{f.value}</option></select>
                :f.type==="textarea"?<textarea rows={3} defaultValue={f.value} style={{width:"100%",padding:"5px 8px",border:"1px solid #ddd",borderRadius:4,fontSize:12,resize:"vertical",fontFamily:"inherit"}}/>
                :<input defaultValue={f.value} readOnly={f.ro} style={{width:"100%",padding:"5px 8px",border:"1px solid #ddd",borderRadius:4,fontSize:12,background:f.ro?"#f5f5f5":"#fff",boxSizing:"border-box"}}/>}
              </div>
            ))}
          </div>
        </div>
        {tabs||null}
        {/* Chatter */}
        <div style={{background:"#fff",borderRadius:4,border:"1px solid #e0e0e0",padding:14}}>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            {[["Gửi tin nhắn",MessageSquare],["Ghi chú nội bộ",Edit3],["Lên lịch",Calendar]].map(([l,I])=>(
              <button key={l} style={{padding:"3px 10px",border:"1px solid #ddd",background:"#fff",borderRadius:4,fontSize:11,color:"#555",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><I size={11}/>{l}</button>
            ))}
          </div>
          <div style={{border:"1px solid #ddd",borderRadius:4,padding:"6px 10px",minHeight:40,fontSize:12,color:"#aaa"}}>Viết ghi chú...</div>
          <div style={{marginTop:12,borderTop:"1px solid #f0f0f0",paddingTop:10}}>
            {[{u:"Nguyễn An",a:"đã cập nhật trạng thái",t:"28/08/2026 14:32"},{u:"Hệ thống",a:"đã tạo bản ghi",t:"25/08/2026 09:00"}].map((l,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:"#714B67",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:600,flexShrink:0}}>{l.u[0]}</div>
                <div><div style={{fontSize:11}}><strong>{l.u}</strong> {l.a}</div><div style={{fontSize:10,color:"#aaa"}}>{l.t}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ==================== BIDDING MODULE ====================
  const BiddingModule = () => {
    if(bidDetail) return <BidDetailView bid={bidDetail}/>;
    return <>{bidTab==="list"?
      <Table data={BIDS} cols={[
        {k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600,cursor:"pointer"}}>{v}</span>},
        {k:"name",label:"Tên gói thầu"},{k:"type",label:"Phương thức"},{k:"hospital",label:"Phạm vi"},
        {k:"budget",label:"Ngân sách",align:"right",render:v=><span style={{fontWeight:600}}>{v} ₫</span>},
        {k:"bidsReceived",label:"Hồ sơ nhận",align:"center",render:(v,r)=><span>{v}/{r.vendors.length}</span>},
        {k:"closeDate",label:"Hạn nộp"},{k:"method",label:"Hình thức"},
        {k:"status",label:"Trạng thái",render:v=><Badge s={v}/>},
      ]} onRow={r=>setBidDetail(r)}/>
    :<Kanban data={BIDS} onCard={r=>setBidDetail(r)}/>}</>;
  };

  // ==================== BID DETAIL + AUTO COMPARISON ====================
  const BidDetailView = ({bid}) => {
    const [tab,setTab] = useState("info");
    const comp = BID_COMPARISON;

    // Auto scoring
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
    },[]);

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

          {/* Tabs */}
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
                <div style={{gridColumn:"1/-1"}}>
                  <div style={{fontSize:11,color:"#888",marginBottom:6}}>NCC tham gia</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {bid.vendors.map(vid=>{const v=VENDORS.find(x=>x.id===vid); return v?<div key={vid} style={{padding:"4px 10px",background:"#f5f3f5",borderRadius:4,fontSize:11,display:"flex",alignItems:"center",gap:4}}><Building2 size={12} color="#714B67"/>{v.name}</div>:null;})}
                  </div>
                </div>
              </div>
            )}

            {tab==="compare"&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div><div style={{fontSize:14,fontWeight:700}}>Bảng so sánh tự động</div><div style={{fontSize:11,color:"#888"}}>Hệ thống tự động chuẩn hóa và xếp hạng theo trọng số cấu hình</div></div>
                  <div style={{display:"flex",gap:6}}>
                    <button style={{padding:"4px 12px",background:"#714B67",color:"#fff",border:"none",borderRadius:4,fontSize:11,cursor:"pointer"}}>Xuất Excel</button>
                    <button style={{padding:"4px 12px",background:"#fff",color:"#714B67",border:"1px solid #714B67",borderRadius:4,fontSize:11,cursor:"pointer"}}>Khóa bảng</button>
                  </div>
                </div>

                {/* Comparison matrix */}
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead>
                      <tr style={{background:"#f8f9fa"}}>
                        <th style={{padding:"8px 10px",textAlign:"left",fontWeight:600,borderBottom:"2px solid #ddd",minWidth:160}}>Hạng mục</th>
                        {scores.map(v=>(
                          <th key={v.id} style={{padding:"8px 10px",textAlign:"center",fontWeight:600,borderBottom:"2px solid #ddd",minWidth:160,background:v.rank===1?"#E8F5E920":"transparent"}}>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                              {v.rank===1&&<Award size={13} color="#F6BB42"/>}
                              {v.name}
                            </div>
                            {v.rank===1&&<div style={{fontSize:9,color:"#2E7D32",fontWeight:700,marginTop:2}}>ĐỀ XUẤT</div>}
                          </th>
                        ))}
                      </tr>
                    </thead>
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
                      <tr style={{borderBottom:"1px solid #f0f0f0"}}><td style={{padding:"6px 10px"}}>Thời gian giao (ngày)</td>{scores.map(v=><td key={v.id} style={{padding:"6px 10px",textAlign:"center"}}>{v.delivery}</td>)}</tr>
                      <tr style={{borderBottom:"1px solid #f0f0f0"}}><td style={{padding:"6px 10px"}}>Bảo hành (tháng)</td>{scores.map(v=><td key={v.id} style={{padding:"6px 10px",textAlign:"center"}}>{v.warranty}</td>)}</tr>
                      <tr style={{borderBottom:"1px solid #f0f0f0"}}><td style={{padding:"6px 10px"}}>Chiết khấu</td>{scores.map(v=><td key={v.id} style={{padding:"6px 10px",textAlign:"center"}}>{v.discount}</td>)}</tr>
                      <tr style={{borderBottom:"1px solid #f0f0f0"}}><td style={{padding:"6px 10px"}}>Điều kiện thanh toán</td>{scores.map(v=><td key={v.id} style={{padding:"6px 10px",textAlign:"center"}}>{v.payment}</td>)}</tr>
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

                {/* Score bars */}
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
                  <button style={{padding:"6px 16px",background:"#714B67",color:"#fff",border:"none",borderRadius:4,fontSize:12,cursor:"pointer",fontWeight:500}}>Chấp nhận đề xuất → Tạo AWD</button>
                  <button style={{padding:"6px 16px",background:"#fff",color:"#714B67",border:"1px solid #714B67",borderRadius:4,fontSize:12,cursor:"pointer"}}>Chỉnh sửa kết quả</button>
                  <button style={{padding:"6px 16px",background:"#fff",color:"#555",border:"1px solid #ddd",borderRadius:4,fontSize:12,cursor:"pointer"}}>Đàm phán thêm</button>
                </div>
              </div>
            )}

            {tab==="docs"&&(
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {bid.vendors.map(vid=>{const v=VENDORS.find(x=>x.id===vid); if(!v) return null; return (
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
                  {t:"25/08/2026 08:00",u:"Nguyễn An",a:"Phát hành thư mời thầu cho 3 NCC",type:"action"},
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

      {mntTab==="assets"&&<Table data={MAINTENANCE} cols={[
        {k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},
        {k:"name",label:"Tên thiết bị"},{k:"serial",label:"Số Sê-ri"},
        {k:"hospital",label:"Bệnh viện",render:v=>v.replace("BV TNH ","")},
        {k:"dept",label:"Khoa/Phòng"},{k:"category",label:"Phân loại"},
        {k:"condition",label:"Tình trạng",render:v=><span style={{color:v==="Tốt"?"#22c55e":v==="Trung bình"?"#f59e0b":"#ef4444",fontWeight:500}}>{v}</span>},
        {k:"nextMaint",label:"Bảo trì tiếp",render:(v,r)=>{const d=new Date(v.split("/").reverse().join("-")); const now=new Date(); return <span style={{color:d<now?"#ef4444":"#333",fontWeight:d<now?600:400}}>{v}{d<now?" ⚠":"" }</span>;}},
        {k:"status",label:"Bảo hành",render:v=><Badge s={v} size="xs"/>},
      ]} onRow={r=>setMntDetail(r)}/>}

      {mntTab==="orders"&&<Table data={MAINT_ORDERS} cols={[
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
            {Array.from({length:35},(_, i)=>{
              const day=i-0; const d=day>=1&&day<=30?day:null;
              const events = d===1?[{name:"BĐ CT Scanner",c:"#E67E22"}]:d===15?[{name:"BT Beckman AU680",c:"#3b82f6"}]:d===20?[{name:"BT Máy thở Dräger",c:"#22c55e"}]:d===5?[{name:"Thay màng lọc RO",c:"#ef4444"}]:[];
              return <div key={i} style={{padding:4,background:d?"#fff":"#fafafa",minHeight:60,position:"relative"}}>
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
            {[["Còn bảo hành",MAINTENANCE.filter(m=>m.status==="Còn bảo hành").length,"#22c55e"],["Sắp hết",1,"#f59e0b"],["Hết bảo hành",MAINTENANCE.filter(m=>m.status==="Hết bảo hành").length,"#ef4444"]].map(([l,v,c])=>(
              <div key={l} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14}}>
                <div style={{fontSize:11,color:"#888",textTransform:"uppercase"}}>{l}</div>
                <div style={{fontSize:28,fontWeight:800,color:c}}>{v}</div>
              </div>
            ))}
          </div>
          {MAINTENANCE.map(m=>(
            <div key={m.id} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:12,marginBottom:8,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setMntDetail(m)}>
              <Wrench size={18} color="#E67E22"/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600}}>{m.name}</div>
                <div style={{fontSize:11,color:"#888"}}>{m.hospital} · {m.serial}</div>
              </div>
              <div style={{textAlign:"right",marginRight:8}}>
                <div style={{fontSize:11,color:"#888"}}>Hết bảo hành</div>
                <div style={{fontSize:12,fontWeight:600}}>{m.warrantyEnd}</div>
              </div>
              <Badge s={m.status} size="xs"/>
            </div>
          ))}
        </div>
      )}

      {mntTab==="dashboard"&&(
        <div style={{flex:1,padding:18}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
            {[["Tổng thiết bị",MAINTENANCE.length,Boxes,"#714B67"],["Cần bảo trì",MAINTENANCE.filter(m=>m.status==="Quá hạn"||m.status==="Lên kế hoạch").length,AlertTriangle,"#f59e0b"],["Đang bảo trì",MAINTENANCE.filter(m=>m.status==="Đang bảo trì").length,Wrench,"#3b82f6"],["Hết bảo hành",MAINTENANCE.filter(m=>m.status==="Hết bảo hành").length,AlertCircle,"#ef4444"]].map(([l,v,I,c])=>(
              <div key={l} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:10,color:"#888",textTransform:"uppercase"}}>{l}</div><div style={{fontSize:24,fontWeight:700}}>{v}</div></div><div style={{width:32,height:32,borderRadius:8,background:`${c}15`,display:"flex",alignItems:"center",justifyContent:"center"}}><I size={16} color={c}/></div></div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Thiết bị theo tình trạng</div>
              {[["Tốt",3,"#22c55e"],["Trung bình",1,"#f59e0b"],["Cần sửa chữa",1,"#ef4444"],["Cần thay linh kiện",1,"#ef4444"]].map(([l,v,c])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <div style={{width:10,height:10,borderRadius:2,background:c}}/><span style={{flex:1,fontSize:12}}>{l}</span><span style={{fontSize:12,fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Giá trị tài sản theo bệnh viện</div>
              {HOSPITALS.map(h=>{const val=MAINTENANCE.filter(m=>m.hospital===h).reduce((a,m)=>a+parseInt(m.value.replace(/\./g,"")),0);
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
              {[["Mã",item.id],["Số Sê-ri",item.serial],["Bệnh viện",item.hospital],["Khoa/Phòng",item.dept],["Phân loại",item.category],["Loại",item.type],["NCC cung cấp",VENDORS.find(v=>v.id===item.vendor)?.name||item.vendor],["Ngày mua",item.purchaseDate],["Giá trị",item.value+" ₫"],["Tình trạng",item.condition]].map(([l,v])=>(
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
              {item.status==="Hết bảo hành"&&<button style={{width:"100%",padding:"5px 0",background:"#E67E22",color:"#fff",border:"none",borderRadius:4,fontSize:11,cursor:"pointer",fontWeight:500}}>Tạo PR gia hạn bảo hành</button>}
            </div>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Bảo trì</div>
              {[["Chu kỳ",item.maintCycle+" ngày"],["Lần cuối",item.lastMaint],["Lần tiếp theo",item.nextMaint]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"4px 0",borderBottom:"1px solid #f5f5f5"}}><span style={{color:"#888"}}>{l}</span><span style={{fontWeight:500}}>{v}</span></div>
              ))}
              <button style={{width:"100%",padding:"5px 0",background:"#714B67",color:"#fff",border:"none",borderRadius:4,fontSize:11,cursor:"pointer",fontWeight:500,marginTop:8}}>Tạo lệnh bảo trì</button>
            </div>
          </div>
        </div>
        {/* Maintenance history */}
        <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14,marginTop:14}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Lịch sử bảo trì & sửa chữa</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead><tr style={{background:"#f8f9fa"}}>{["Ngày","Loại","Nội dung","Người thực hiện","Chi phí","Kết quả"].map(h=><th key={h} style={{padding:"6px 8px",textAlign:"left",fontWeight:600,color:"#555"}}>{h}</th>)}</tr></thead>
            <tbody>
              {[{d:item.lastMaint,t:"Định kỳ",n:"Bảo trì định kỳ theo lịch",p:"Kỹ thuật viên NCC",c:"15.000.000",r:"Đạt"},
                {d:"01/04/2026",t:"Sửa chữa",n:"Thay bo mạch điều khiển",p:"Kỹ thuật viên NCC",c:"45.000.000",r:"Đạt"},
                {d:"15/01/2026",t:"Định kỳ",n:"Bảo trì định kỳ + hiệu chuẩn",p:"Kỹ thuật viên NCC",c:"20.000.000",r:"Đạt"},
              ].map((r,i)=>(
                <tr key={i} style={{borderBottom:"1px solid #f0f0f0"}}><td style={{padding:"6px 8px"}}>{r.d}</td><td style={{padding:"6px 8px"}}>{r.t}</td><td style={{padding:"6px 8px"}}>{r.n}</td><td style={{padding:"6px 8px"}}>{r.p}</td><td style={{padding:"6px 8px",textAlign:"right"}}>{r.c} ₫</td><td style={{padding:"6px 8px"}}><Badge s={r.r==="Đạt"?"Hoàn tất":"Đang xử lý"} size="xs"/></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ==================== VENDOR PORTAL (FULL) ====================
  const VendorPortal = () => (
    <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>
      {/* Portal header */}
      <div style={{background:"linear-gradient(135deg,#714B67 0%,#9b59b6 50%,#6C3483 100%)",padding:"18px 22px",color:"#fff"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{width:40,height:40,borderRadius:8,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Globe size={22}/></div>
          <div><h2 style={{margin:0,fontSize:17,fontWeight:700}}>Cổng Nhà cung cấp TNH</h2><p style={{margin:0,fontSize:11,opacity:.75}}>Vendor Portal — Giao tiếp với Tập đoàn TNH</p></div>
          <div style={{flex:1}}/>
          <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.15)",padding:"4px 10px",borderRadius:4}}>
            <Building2 size={13}/><span style={{fontSize:11}}>Công ty CP Dược phẩm Hà Nội</span>
          </div>
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {[["home","Trang chủ"],["rfq","RFQ nhận được"],["bidding","Đấu thầu"],["quote","Báo giá đã gửi"],["po","Đơn đặt hàng"],["delivery","Giao hàng"],["invoice","Hóa đơn"],["profile","Hồ sơ"],["eval","Đánh giá"]].map(([k,l])=>(
            <button key={k} onClick={()=>{setPortalTab(k);setPortalBidding(null);}} style={{padding:"5px 12px",borderRadius:4,border:"1px solid rgba(255,255,255,.25)",background:portalTab===k?"rgba(255,255,255,.2)":"transparent",color:"#fff",fontSize:11,cursor:"pointer",fontWeight:portalTab===k?600:400}}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{flex:1,padding:"16px 22px",overflowY:"auto"}}>

        {/* HOME */}
        {portalTab==="home"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
              {[["RFQ chờ phản hồi",2,Send,"#E9573F"],["Đấu thầu đang mở",1,Gavel,"#9b59b6"],["PO chờ xác nhận",1,ShoppingCart,"#3b82f6"],["Hóa đơn chờ xử lý",3,DollarSign,"#22c55e"]].map(([l,v,I,c])=>(
                <div key={l} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:12,cursor:"pointer"}} onClick={()=>setPortalTab(l.includes("RFQ")?"rfq":l.includes("Đấu")?"bidding":l.includes("PO")?"po":"invoice")}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:10,color:"#888",textTransform:"uppercase"}}>{l}</div><div style={{fontSize:22,fontWeight:700,color:c}}>{v}</div></div><I size={20} color={c}/></div>
                </div>
              ))}
            </div>
            <div style={{background:"#FFF8E1",padding:"10px 14px",borderRadius:4,fontSize:11,color:"#F57F17",display:"flex",alignItems:"center",gap:6,marginBottom:14}}>
              <AlertTriangle size={14}/>Giấy chứng nhận GDP sẽ hết hạn vào 15/10/2026. Vui lòng cập nhật hồ sơ trước ngày này.
            </div>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Hoạt động gần đây</div>
              {[{t:"28/08 14:30",a:"PO-TN-2026-000123 đã được phát hành — chờ xác nhận",c:"#3b82f6"},
                {t:"27/08 10:00",a:"RFQ-2026-0045 — Thuốc kháng sinh Q4 — mời báo giá",c:"#E9573F"},
                {t:"25/08 16:00",a:"Đấu thầu BID-2026-0012 — mời tham gia",c:"#9b59b6"},
                {t:"20/08 09:15",a:"Hóa đơn HD-0089 đã được đối chiếu thành công",c:"#22c55e"},
              ].map((e,i)=><div key={i} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:"1px solid #f5f5f5"}}><div style={{width:6,height:6,borderRadius:"50%",background:e.c,marginTop:5,flexShrink:0}}/><div><div style={{fontSize:11}}>{e.a}</div><div style={{fontSize:10,color:"#aaa"}}>{e.t}</div></div></div>)}
            </div>
          </div>
        )}

        {/* RFQ */}
        {portalTab==="rfq"&&(
          <div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Yêu cầu báo giá đang mở</div>
            {[{id:"RFQ-2026-0045",title:"Thuốc kháng sinh Q4/2026",deadline:"05/09/2026",status:"Đang nhận báo giá",lines:15,daysLeft:8},
              {id:"RFQ-2026-0042",title:"Vật tư tiêu hao tháng 10",deadline:"02/09/2026",status:"Đang nhận báo giá",lines:8,daysLeft:5}
            ].map(rfq=>(
              <div key={rfq.id} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"#714B67"}}>{rfq.id}</div>
                    <div style={{fontSize:12,color:"#333",marginTop:2}}>{rfq.title}</div>
                    <div style={{fontSize:11,color:"#888",marginTop:4}}>{rfq.lines} dòng · Hạn: {rfq.deadline}</div>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button style={{padding:"5px 12px",background:"#714B67",color:"#fff",border:"none",borderRadius:4,fontSize:11,cursor:"pointer",fontWeight:500}}>Gửi báo giá</button>
                    <button style={{padding:"5px 12px",background:"#fff",color:"#555",border:"1px solid #ddd",borderRadius:4,fontSize:11,cursor:"pointer"}}>Tải tệp</button>
                    <button style={{padding:"5px 12px",background:"#fff",color:"#555",border:"1px solid #ddd",borderRadius:4,fontSize:11,cursor:"pointer"}}>Hỏi / Làm rõ</button>
                  </div>
                </div>
                <div style={{marginTop:8,background:"#FFF8E1",padding:"5px 10px",borderRadius:4,fontSize:10,color:"#F57F17",display:"flex",alignItems:"center",gap:4}}><Clock size={11}/>Còn {rfq.daysLeft} ngày để phản hồi</div>
              </div>
            ))}
          </div>
        )}

        {/* BIDDING PORTAL */}
        {portalTab==="bidding"&&!portalBidding&&(
          <div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Đấu thầu được mời tham gia</div>
            {BIDS.filter(b=>b.vendors.includes("NCC-001")).map(bid=>(
              <div key={bid.id} onClick={()=>setPortalBidding(bid)} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14,marginBottom:10,cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}><Gavel size={14} color="#9b59b6"/><span style={{fontSize:14,fontWeight:600,color:"#714B67"}}>{bid.id}</span></div>
                    <div style={{fontSize:12,marginTop:4}}>{bid.name}</div>
                    <div style={{fontSize:11,color:"#888",marginTop:4}}>{bid.type} · {bid.lines} dòng · Hạn nộp: {bid.closeDate}</div>
                  </div>
                  <Badge s={bid.status}/>
                </div>
                <div style={{display:"flex",gap:12,marginTop:8,fontSize:11,color:"#555"}}>
                  <span>Ngân sách: <strong>{bid.budget} ₫</strong></span>
                  <span>Phương thức mở: <strong>{bid.method}</strong></span>
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
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["Tên gói thầu",portalBidding.name],["Phương thức",portalBidding.type],["Hạn nộp",portalBidding.closeDate],["Hình thức mở",portalBidding.method]].map(([l,v])=>(
                  <div key={l}><div style={{fontSize:10,color:"#888"}}>{l}</div><div style={{fontSize:12,fontWeight:500}}>{v}</div></div>
                ))}
              </div>
            </div>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:16,marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Bảng chào giá</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:"#f8f9fa"}}>
                  {["STT","Tên hàng hóa","ĐVT","Số lượng","Đơn giá (₫)","Thành tiền (₫)","Thời gian giao","Bảo hành"].map(h=><th key={h} style={{padding:"6px 8px",textAlign:"left",fontWeight:600,color:"#555"}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {BID_COMPARISON.items.map((item,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid #f0f0f0"}}>
                      <td style={{padding:"6px 8px"}}>{i+1}</td>
                      <td style={{padding:"6px 8px"}}>{item.name}</td>
                      <td style={{padding:"6px 8px"}}>{item.unit}</td>
                      <td style={{padding:"6px 8px",textAlign:"right"}}>{item.qty.toLocaleString()}</td>
                      <td style={{padding:"6px 8px"}}><input defaultValue="" placeholder="Nhập giá" style={{width:100,padding:"3px 6px",border:"1px solid #ddd",borderRadius:3,fontSize:11}}/></td>
                      <td style={{padding:"6px 8px",color:"#888"}}>Tự tính</td>
                      <td style={{padding:"6px 8px"}}><input defaultValue="" placeholder="ngày" style={{width:50,padding:"3px 6px",border:"1px solid #ddd",borderRadius:3,fontSize:11}}/></td>
                      <td style={{padding:"6px 8px"}}><input defaultValue="" placeholder="tháng" style={{width:50,padding:"3px 6px",border:"1px solid #ddd",borderRadius:3,fontSize:11}}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:16,marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Tải lên hồ sơ</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {["Thư chào giá (bắt buộc)","Catalogue sản phẩm","GCN đủ điều kiện kinh doanh","Bảng giá chi tiết Excel","Tài liệu kỹ thuật","Giấy phép lưu hành"].map(f=>(
                  <div key={f} style={{border:"1px dashed #ccc",borderRadius:4,padding:10,display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:11,color:"#555"}}>
                    <Upload size={14} color="#714B67"/>{f}
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button style={{padding:"6px 18px",background:"#714B67",color:"#fff",border:"none",borderRadius:4,fontSize:12,cursor:"pointer",fontWeight:600}}>Nộp hồ sơ thầu</button>
              <button style={{padding:"6px 18px",background:"#fff",color:"#714B67",border:"1px solid #714B67",borderRadius:4,fontSize:12,cursor:"pointer"}}>Lưu nháp</button>
            </div>
            <div style={{marginTop:12,background:"#EDE7F6",padding:"8px 12px",borderRadius:4,fontSize:10,color:"#4527A0",display:"flex",alignItems:"center",gap:6}}><Lock size={12}/>Hồ sơ sẽ được niêm phong sau khi nộp và chỉ được mở sau hạn nộp ({portalBidding.closeDate})</div>
          </div>
        )}

        {/* PO */}
        {portalTab==="po"&&(
          <div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Đơn đặt hàng</div>
            {POS.filter(p=>p.vendorId==="NCC-001").map(po=>(
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
                      <button style={{padding:"5px 12px",background:"#2E7D32",color:"#fff",border:"none",borderRadius:4,fontSize:11,cursor:"pointer"}}>✓ Xác nhận</button>
                      <button style={{padding:"5px 12px",background:"#fff",color:"#C62828",border:"1px solid #C62828",borderRadius:4,fontSize:11,cursor:"pointer"}}>✕ Từ chối</button>
                    </>}
                    <button style={{padding:"5px 12px",background:"#fff",color:"#555",border:"1px solid #ddd",borderRadius:4,fontSize:11,cursor:"pointer"}}><Download size={12}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DELIVERY */}
        {portalTab==="delivery"&&(
          <div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Lịch giao hàng & Theo dõi</div>
            {[{po:"PO-TN-2026-000123",items:"15 dòng",dueDate:"05/09/2026",status:"Chờ giao",hospital:"BV TNH Thái Nguyên"}].map(d=>(
              <div key={d.po} style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:14,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div><div style={{fontSize:13,fontWeight:600,color:"#714B67"}}>{d.po}</div><div style={{fontSize:11,color:"#888"}}>{d.hospital} · {d.items}</div></div>
                  <Badge s={d.status}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  <div><div style={{fontSize:10,color:"#888"}}>Ngày giao dự kiến</div><div style={{fontSize:12,fontWeight:600}}>{d.dueDate}</div></div>
                  <div><div style={{fontSize:10,color:"#888"}}>Địa điểm giao</div><div style={{fontSize:12}}><MapPin size={10}/> Kho Dược, {d.hospital}</div></div>
                  <div>
                    <button style={{padding:"5px 12px",background:"#3b82f6",color:"#fff",border:"none",borderRadius:4,fontSize:11,cursor:"pointer",fontWeight:500}}>Thông báo giao hàng</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INVOICE */}
        {portalTab==="invoice"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:14,fontWeight:700}}>Hóa đơn</div>
              <button style={{padding:"5px 14px",background:"#714B67",color:"#fff",border:"none",borderRadius:4,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Upload size={12}/>Nộp hóa đơn mới</button>
            </div>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:"#f8f9fa"}}>{["Số hóa đơn","PO","Ngày","Giá trị","Thuế GTGT","Tổng","Trạng thái","Thanh toán"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontWeight:600,color:"#555"}}>{h}</th>)}</tr></thead>
                <tbody>
                  {[{id:"HD-2026-0089",po:"PO-TN-2026-000123",date:"25/08/2026",value:"170.454.545",vat:"19.045.455",total:"189.500.000",status:"Đang đối chiếu",payment:"Chưa"},
                    {id:"HD-2026-0082",po:"PO-LS-2026-000075",date:"15/08/2026",value:"212.727.273",vat:"21.272.727",total:"234.000.000",status:"Đủ hồ sơ",payment:"Đã thanh toán"}
                  ].map(inv=>(
                    <tr key={inv.id} style={{borderBottom:"1px solid #f0f0f0"}}>
                      <td style={{padding:"7px 10px",color:"#714B67",fontWeight:500}}>{inv.id}</td>
                      <td style={{padding:"7px 10px"}}>{inv.po}</td><td style={{padding:"7px 10px"}}>{inv.date}</td>
                      <td style={{padding:"7px 10px",textAlign:"right"}}>{inv.value}</td><td style={{padding:"7px 10px",textAlign:"right"}}>{inv.vat}</td>
                      <td style={{padding:"7px 10px",textAlign:"right",fontWeight:600}}>{inv.total}</td>
                      <td style={{padding:"7px 10px"}}><Badge s={inv.status} size="xs"/></td>
                      <td style={{padding:"7px 10px"}}><span style={{fontSize:10,color:inv.payment==="Đã thanh toán"?"#22c55e":"#f59e0b"}}>{inv.payment}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {portalTab==="profile"&&(
          <div style={{maxWidth:720}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Hồ sơ nhà cung cấp</div>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,padding:18}}>
              {[["Tên pháp lý","Công ty CP Dược phẩm Hà Nội"],["Mã số thuế","0100107518"],["Địa chỉ","170 La Thành, Đống Đa, Hà Nội"],["Người liên hệ","Nguyễn Văn Bình"],["Điện thoại","024-3851-2345"],["Email","contact@duocphamhanoi.vn"],["Tài khoản NH","****6789 — Vietcombank"],["Nhóm hàng","Dược phẩm"],["Trạng thái","Hoạt động"]].map(([l,v],i)=>(
                <div key={i} style={{display:"flex",padding:"7px 0",borderBottom:"1px solid #f5f5f5"}}>
                  <label style={{width:150,fontSize:12,color:"#888",fontWeight:500,flexShrink:0}}>{l}</label>
                  <span style={{fontSize:12,color:"#333"}}>{v}</span>
                  <Edit3 size={11} color="#ccc" style={{marginLeft:"auto",cursor:"pointer"}}/>
                </div>
              ))}
              <div style={{marginTop:14}}>
                <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Giấy phép & Chứng nhận</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {[["GCN ĐKKD","Hiệu lực","#22c55e"],["GDP","Hiệu lực","#22c55e"],["GMP","Sắp hết hạn","#f59e0b"],["ISO 9001","Hiệu lực","#22c55e"]].map(([n,s,c])=>(
                    <div key={n} style={{padding:"6px 10px",border:"1px solid #e0e0e0",borderRadius:4,fontSize:11,display:"flex",alignItems:"center",gap:4}}>
                      <FileText size={11} color="#714B67"/>{n}<span style={{fontSize:9,color:c,fontWeight:500}}>· {s}</span>
                    </div>
                  ))}
                  <div style={{padding:"6px 10px",border:"1px dashed #aaa",borderRadius:4,fontSize:11,cursor:"pointer",color:"#714B67",display:"flex",alignItems:"center",gap:3}}><Upload size={11}/>Tải lên mới</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EVALUATION */}
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
              <div style={{marginTop:14,background:"#f8f9fa",padding:10,borderRadius:4}}>
                <div style={{fontSize:11,fontWeight:600,marginBottom:4}}>Nhận xét kỳ gần nhất (Q2/2026)</div>
                <div style={{fontSize:11,color:"#555"}}>NCC giao hàng đúng hạn 95% đơn hàng. Chất lượng thuốc đạt tiêu chuẩn. Cần cải thiện thời gian phản hồi yêu cầu làm rõ.</div>
              </div>
            </div>
          </div>
        )}

        {/* QUOTE */}
        {portalTab==="quote"&&(
          <div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Báo giá đã gửi</div>
            <div style={{background:"#fff",border:"1px solid #e0e0e0",borderRadius:4,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{background:"#f8f9fa"}}>{["Số báo giá","RFQ","Ngày gửi","Hiệu lực đến","Giá trị","Trạng thái"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontWeight:600,color:"#555"}}>{h}</th>)}</tr></thead>
                <tbody>
                  {[{id:"QTN-ABC-0089",rfq:"RFQ-2026-0045",date:"18/08/2026",validity:"17/09/2026",amount:"156.800.000 ₫",status:"Niêm phong"},
                    {id:"QTN-ABC-0085",rfq:"RFQ-2026-0038",date:"10/08/2026",validity:"09/09/2026",amount:"89.200.000 ₫",status:"Đã mở"},
                    {id:"QTN-ABC-0080",rfq:"RFQ-2026-0032",date:"01/08/2026",validity:"31/08/2026",amount:"212.000.000 ₫",status:"Đã duyệt"},
                  ].map(q=>(
                    <tr key={q.id} style={{borderBottom:"1px solid #f0f0f0"}}>
                      <td style={{padding:"7px 10px",color:"#714B67",fontWeight:500}}>{q.id}</td>
                      <td style={{padding:"7px 10px"}}>{q.rfq}</td><td style={{padding:"7px 10px"}}>{q.date}</td>
                      <td style={{padding:"7px 10px"}}>{q.validity}</td><td style={{padding:"7px 10px",fontWeight:600}}>{q.amount}</td>
                      <td style={{padding:"7px 10px"}}><Badge s={q.status} size="xs"/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{marginTop:16,background:"#E3F2FD",padding:"8px 12px",borderRadius:4,fontSize:10,color:"#1565C0",display:"flex",alignItems:"center",gap:6}}>
          <Shield size={12}/>Dữ liệu được cô lập. Quý đối tác chỉ xem được thông tin liên quan đến hồ sơ của mình. Xác thực 2 lớp đang bật.
        </div>
      </div>
    </div>
  );

  // ==================== DASHBOARD ====================
  const Dashboard = () => (
    <div style={{padding:"16px 18px",overflowY:"auto",flex:1}}>
      <div style={{marginBottom:16}}><h2 style={{fontSize:17,fontWeight:700,color:"#333",margin:0}}>Bảng điều hành Mua sắm</h2><p style={{fontSize:12,color:"#888",margin:"3px 0 0"}}>Tổng quan hoạt động — Tháng 08/2026</p></div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        {[["Yêu cầu mua",48,12,FileText,"#017E84","PR"],["Đấu thầu mở",6,null,Gavel,"#9b59b6","BID"],["Chờ phê duyệt",9,23,CheckCircle2,"#F6BB42","APR"],["PO phát hành",35,8,ShoppingCart,"#3BAFDA","PO"],["Bảo trì cần xử lý",3,null,Wrench,"#E67E22","MNT"],["Chi tiêu tháng","2.8 tỷ",15,DollarSign,"#714B67",null]].map(([l,v,ch,I,c,m])=>(
          <div key={l} onClick={()=>m&&nav(m)} style={{background:"#fff",borderRadius:4,padding:14,border:"1px solid #e0e0e0",cursor:m?"pointer":"default",flex:"1 1 150px",minWidth:145}} onMouseEnter={e=>{if(m)e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.06)"}} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
            <div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:.5}}>{l}</div><div style={{fontSize:22,fontWeight:700,color:"#333"}}>{v}</div></div><div style={{width:32,height:32,borderRadius:8,background:`${c}12`,display:"flex",alignItems:"center",justifyContent:"center"}}><I size={16} color={c}/></div></div>
            {ch!=null&&<div style={{fontSize:11,marginTop:6,color:ch>0?"#2E7D32":"#C62828",display:"flex",alignItems:"center",gap:2}}>{ch>0?<TrendingUp size={11}/>:<TrendingDown size={11}/>}{Math.abs(ch)}% vs tháng trước</div>}
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <div style={{background:"#fff",borderRadius:4,border:"1px solid #e0e0e0",padding:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:13,fontWeight:600}}>Yêu cầu mua cần xử lý</span><span onClick={()=>nav("PR")} style={{fontSize:11,color:"#714B67",cursor:"pointer"}}>Xem tất cả →</span></div>
          {PRS.filter(p=>!["Hoàn tất","Đã hủy"].includes(p.status)).slice(0,4).map(pr=>(
            <div key={pr.id} onClick={()=>nav("PR",pr)} style={{padding:"6px 0",borderBottom:"1px solid #f5f5f5",cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{pr.id}</div><div style={{fontSize:10,color:"#888"}}>{pr.hospital.replace("BV TNH ","")} · {pr.dept}</div></div>
              <Badge s={pr.status} size="xs"/>
            </div>
          ))}
        </div>
        <div style={{background:"#fff",borderRadius:4,border:"1px solid #e0e0e0",padding:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:13,fontWeight:600}}>Đấu thầu đang mở</span><span onClick={()=>nav("BID")} style={{fontSize:11,color:"#714B67",cursor:"pointer"}}>Xem tất cả →</span></div>
          {BIDS.filter(b=>["Đang đấu thầu","Chờ mở thầu"].includes(b.status)).map(b=>(
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
          {MAINTENANCE.filter(m=>["Quá hạn","Lên kế hoạch","Đang bảo trì"].includes(m.status)).map(m=>(
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
          {VENDORS.filter(v=>v.status==="Hoạt động").slice(0,4).map(v=>(
            <div key={v.id} onClick={()=>nav("VEN",v)} style={{padding:"5px 0",borderBottom:"1px solid #f5f5f5",cursor:"pointer"}}>
              <div style={{fontSize:11,fontWeight:500}}>{v.name}</div>
              <div style={{display:"flex",gap:6,fontSize:10,color:"#888"}}><span>{v.group}</span><span>⭐{v.rating}</span><span>{v.pos} PO</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ==================== GENERIC MODULE CONTENT ====================
  const getContent = () => {
    if(mod==="dashboard") return <Dashboard/>;
    if(mod==="PORTAL") return <VendorPortal/>;
    if(mod==="BID") return <BiddingModule/>;
    if(mod==="MNT") return <MaintenanceModule/>;

    if(rec && view==="form") {
      const f=[], sts=[];
      if(mod==="PR") {
        f.push({label:"Số PR",value:rec.id,ro:true},{label:"Bệnh viện",value:rec.hospital,type:"select"},{label:"Khoa/Phòng",value:rec.dept,type:"select"},{label:"Người đề nghị",value:rec.requester,ro:true},{label:"Ngày tạo",value:rec.date,ro:true},{label:"Ưu tiên",value:rec.priority,type:"select"},{label:"Mục đích",value:"Phục vụ KCB",full:true});
        sts.push("Đang soạn","Chờ xác nhận","Đã xác nhận","Đang thẩm định","Đang xử lý","Hoàn tất");
      } else if(mod==="PO") {
        f.push({label:"Số PO",value:rec.id,ro:true},{label:"NCC",value:rec.vendor,type:"select"},{label:"Bệnh viện",value:rec.hospital,type:"select"},{label:"Pháp nhân mua",value:rec.hospital,type:"select"},{label:"Ngày",value:rec.date,ro:true},{label:"Nguồn tạo",value:rec.source==="AWD"?"Kết quả lựa chọn":rec.source==="CTR"?"Gọi hàng HĐ":"Đấu thầu",type:"select"},{label:"Giá trị",value:rec.amount+" ₫",ro:true});
        sts.push("Đang soạn","Chờ kiểm tra","Sẵn sàng","Đã phát hành","NCC xác nhận","Giao một phần","Nhận đủ","Đã đóng");
      } else if(mod==="VEN") {
        f.push({label:"Mã NCC",value:rec.id,ro:true},{label:"Tên",value:rec.name},{label:"MST",value:rec.tax},{label:"Nhóm hàng",value:rec.group,type:"select"},{label:"Email",value:rec.email},{label:"Điện thoại",value:rec.phone},{label:"Địa chỉ",value:rec.addr,full:true},{label:"Cổng NCC",value:rec.portal?"Đã kích hoạt":"Chưa kích hoạt"});
        sts.push("Đang đăng ký","Chờ thẩm định","Hoạt động","Có điều kiện","Tạm ngừng","Khóa");
      } else {
        f.push({label:"Mã",value:rec.id,ro:true},{label:"Tên",value:rec.name||""},{label:"Trạng thái",value:rec.status,type:"select"},{label:"Ngày",value:rec.date||"",ro:true});
      }
      return <Form record={rec} fields={f} statuses={sts.length?sts:undefined}/>;
    }

    let data=[],cols=[];
    if(mod==="PR"){data=PRS; cols=[{k:"id",label:"Số PR",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"name",label:"Mô tả"},{k:"hospital",label:"Bệnh viện",render:v=>v.replace("BV TNH ","")},{k:"dept",label:"Khoa"},{k:"requester",label:"Người đề nghị"},{k:"date",label:"Ngày"},{k:"lines",label:"Dòng",align:"center"},{k:"priority",label:"Ưu tiên",render:v=><span style={{color:v==="Khẩn"?"#ef4444":v==="Cao"?"#f59e0b":"#555",fontWeight:v==="Khẩn"?600:400}}>{v}</span>},{k:"amount",label:"Giá trị",align:"right",render:v=><span style={{fontWeight:500}}>{v} ₫</span>},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}];}
    else if(mod==="PO"){data=POS; cols=[{k:"id",label:"Số PO",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"vendor",label:"NCC"},{k:"hospital",label:"BV",render:v=>v.replace("BV TNH ","")},{k:"date",label:"Ngày"},{k:"source",label:"Nguồn",render:v=><span style={{fontSize:10,padding:"1px 6px",background:"#f0f0f0",borderRadius:3}}>{v}</span>},{k:"lines",label:"Dòng",align:"center"},{k:"amount",label:"Giá trị",align:"right",render:v=><span style={{fontWeight:600}}>{v} ₫</span>},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}];}
    else if(mod==="VEN"){data=VENDORS; cols=[{k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"name",label:"Tên NCC"},{k:"tax",label:"MST"},{k:"group",label:"Nhóm"},{k:"rating",label:"Đánh giá",align:"center",render:v=><span>⭐{v}</span>},{k:"contracts",label:"HĐ",align:"center"},{k:"pos",label:"PO",align:"center"},{k:"portal",label:"Cổng",render:v=>v?<Badge s="Hoạt động" size="xs"/>:<span style={{fontSize:10,color:"#aaa"}}>Chưa</span>},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}];}
    else { const info=MODULES[mod]; data=Array.from({length:5},(_,i)=>({id:`${mod}-2026-${String(i+1).padStart(4,"0")}`,name:`${info?.name||mod} #${i+1}`,hospital:HOSPITALS[i%4],date:`${28-i}/08/2026`,status:["Đang soạn","Chờ xác nhận","Đang xử lý","Hoàn tất","Sẵn sàng"][i%5]}));
      cols=[{k:"id",label:"Mã",render:v=><span style={{color:"#714B67",fontWeight:600}}>{v}</span>},{k:"name",label:"Mô tả"},{k:"hospital",label:"Bệnh viện",render:v=>v.replace("BV TNH ","")},{k:"date",label:"Ngày"},{k:"status",label:"Trạng thái",render:v=><Badge s={v}/>}];
    }

    return view==="kanban"?<Kanban data={data} onCard={r=>nav(mod,r)}/>:<Table data={data} cols={cols} onRow={r=>nav(mod,r)}/>;
  };

  const needCtrl = !["dashboard","PORTAL","BID","MNT"].includes(mod) && !rec;

  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"'Segoe UI',-apple-system,system-ui,sans-serif",fontSize:13,color:"#333",background:"#f0eff4"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <TopBar/>
        {mod==="BID"&&!bidDetail&&<CtrlPanel count={BIDS.length} extra={<div style={{display:"flex",border:"1px solid #ddd",borderRadius:4,overflow:"hidden"}}>{[["list","Danh sách"],["kanban","Kanban"]].map(([v,l])=><button key={v} onClick={()=>setBidTab(v)} style={{padding:"3px 10px",border:"none",background:bidTab===v?"#714B67":"#fff",color:bidTab===v?"#fff":"#666",cursor:"pointer",fontSize:11}}>{l}</button>)}</div>}/>}
        {mod==="MNT"&&!mntDetail&&<CtrlPanel count={mntTab==="assets"?MAINTENANCE.length:mntTab==="orders"?MAINT_ORDERS.length:undefined}/>}
        {needCtrl&&<CtrlPanel count={MODULES[mod]?.count}/>}
        {getContent()}
      </div>
    </div>
  );
}
