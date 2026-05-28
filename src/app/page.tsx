'use client';

import { useState, useEffect, Suspense, useTransition, useRef, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Papa from 'papaparse';
import Link from 'next/link';
import { PlusCircle, Building2, Map, Car, MapPin, Phone, MessageSquare, FilePlus2, X, Layers, ChevronLeft, ChevronRight, ShieldCheck, Calendar, FileText, PenTool, Clock, Square, Bed, Compass } from 'lucide-react';

// ==========================================
// ĐỊNH NGHĨA KIỂU DỮ LIỆU CHUẨN (TYPES)
// ==========================================
interface Property {
  id: number;
  tieude: string;
  moTa: string;
  gia: string;
  soGia: number;
  dienTich: string;
  khuVuc: string;
  khuVucFull: string;
  loaiHinh: string;
  huong?: string;
  phongNgu?: string;
  ngayDang: string;
  anh: string;
  tag?: string;
  tagColor?: string;
  videoUrl?: string;
  linkMap?: string;
  anhSoDo?: string;
  phapLy?: string;
  isMatTien?: string | boolean;
}

interface FilterState {
  khuVuc: string;
  loaiHinh: string;
  gia: string;
  huong: string;
  tag: string;
}

// ==========================================
// 1. COMPONENT: HEADER (Thanh điều hướng)
// ==========================================
function Header({ onOpenDeposit }: { onOpenDeposit: () => void }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 select-none">
          <img src="https://i.postimg.cc/JhKg8VZ9/70554272-47DB-4D3A-A1AE-2782EFCAF00F.png" alt="Trần Huy Land" className="h-9 sm:h-11 w-auto object-contain" />
          <div>
            <h1 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">TRẦN HUY LAND</h1>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider"><span>Giỏ Hàng Thật • Pháp Lý Minh Bạch</span></p>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
          <Link href="#" className="hover:text-slate-900 transition-all">Trang Chủ</Link>
          <a href="#listing-section" className="hover:text-slate-900 transition-all">Nhà Đất Đang Bán</a>
          <a href="#about-section" className="hover:text-slate-900 transition-all">Giới Thiệu</a>
          <a href="#blog-section" className="hover:text-slate-900 transition-all">Tin Tức Khảo Sát</a>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={onOpenDeposit} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-sm">
            <PlusCircle className="w-4 h-4 text-slate-900" /> <span>Ký Gửi Nhanh</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ==========================================
// 2. COMPONENT: PROPERTY CARD (Thẻ hiển thị)
// ==========================================
function PropertyCard({ item, onClick }: { item: Property; onClick: () => void }) {
  const images = item.anh ? item.anh.split(',').map(url => url.trim()).filter(url => url !== '') : [];
  const mainImage = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80';
  
  const tinhThoiGianCachDay = (dateStr: string) => {
    if (!dateStr) return "Tin mới";
    const parts = dateStr.toString().replace(/[\r\n\t]/g, "").trim().split(/[-/]/);
    if (parts.length !== 3) return "Tin mới";
    const d = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    const diff = Math.floor((new Date().getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return "Hôm nay";
    if (diff === 1) return "1 ngày trước";
    return `${diff} ngày trước`;
  };

  return (
    <article onClick={onClick} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer transform hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img src={mainImage} alt={item.tieude} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <span className={`absolute top-3 left-3 ${item.tagColor || 'bg-slate-900'} text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-lg shadow-sm`}>{item.tag || 'Bán Đất'}</span>
        {item.huong && (
          <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-800 font-extrabold text-[10px] px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1"><Compass className="w-3 h-3 text-amber-500" />{item.huong}</span>
        )}
        <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> {tinhThoiGianCachDay(item.ngayDang)}</span>
        <span className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-sm text-white font-extrabold text-sm px-3 py-1 rounded-xl shadow-md">{item.gia}</span>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span className="line-clamp-1">{item.khuVucFull}</span>
          </div>
          <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-amber-500 text-sm sm:text-base leading-snug transition-colors">{item.tieude}</h3>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-slate-500 text-sm font-medium">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-400">
            <span><Square className="w-3.5 h-3.5 inline mr-0.5" /> {item.dienTich}</span>
            <span><Bed className="w-3.5 h-3.5 inline mr-0.5" /> {item.phongNgu || 'Đất ở'}</span>
          </div>
          <span className="text-amber-500 font-bold flex items-center gap-0.5 text-xs uppercase tracking-wider group-hover:translate-x-0.5 transition-transform"><span>Chi tiết</span> <ChevronRight className="w-3 h-3" /></span>
        </div>
      </div>
    </article>
  );
}

// ==========================================
// 3. COMPONENT: PROPERTY MODAL (Xem chi tiết)
// ==========================================
function PropertyModal({ item, onClose }: { item: Property | null; onClose: () => void }) {
  const [blueprintUrl, setBlueprintUrl] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  if (!item) return null;
  const images = item.anh ? item.anh.split(',').map(url => url.trim()).filter(url => url !== '') : [];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl relative max-h-[92vh] sm:max-h-[88vh] flex flex-col">
          <button onClick={onClose} className="absolute top-4 right-4 z-50 w-8 h-8 bg-slate-900/50 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-slate-900 transition-all shadow"><X className="w-4 h-4" /></button>
          <div className="overflow-y-auto flex-1 scrollbar-none">
            <div className="w-full relative group/slide aspect-[16/10] bg-slate-100">
              <div ref={sliderRef} className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none">
                {item.videoUrl && (
                  <div className="w-full h-full flex-shrink-0 snap-start snap-always relative">
                    <iframe className="w-full h-full" src={item.videoUrl} frameBorder="0" allowFullScreen></iframe>
                  </div>
                )}
                {images.map((url, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 snap-start snap-always"><img src={url} alt={item.tieude} className="w-full h-full object-cover" /></div>
                ))}
              </div>
              {images.length > 1 && (
                <div className="bg-slate-900/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md absolute top-4 left-4 z-10 select-none pointer-events-none flex items-center gap-1 shadow-sm uppercase tracking-wider">
                  <Layers className="w-3 h-3 text-amber-400" /> <span>Giỏ hàng:</span> {item.videoUrl ? '1 Video & ' : ''}{images.length} <span>Ảnh</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="bg-amber-100 text-amber-900 font-extrabold text-base px-3 py-1 rounded-xl shadow-sm">{item.gia}</span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-500" /><span>{item.phapLy || 'Sổ hồng sẵn sàng'}</span></span>
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 mt-4 leading-snug">{item.tieude}</h1>
              <div className="grid grid-cols-3 gap-2 my-5 p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-600 text-center font-semibold shadow-inner">
                <div><div className="text-slate-400 text-[11px] font-bold uppercase mb-0.5 tracking-wider"><span>Diện tích</span></div><strong className="text-slate-900 text-sm sm:text-base">{item.dienTich}</strong></div>
                <div><div className="text-slate-400 text-[11px] font-bold uppercase mb-0.5 tracking-wider"><span>Cấu trúc</span></div><strong className="text-slate-900 text-sm sm:text-base">{item.phongNgu || 'Đất ở'}</strong></div>
                <div><div className="text-slate-400 text-[11px] font-bold uppercase mb-0.5 tracking-wider"><span>Hướng</span></div><strong className="text-slate-900 text-sm sm:text-base">{item.huong || 'Chưa rõ'}</strong></div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {item.linkMap && <a href={item.linkMap} target="_blank" rel="noopener noreferrer" className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 rounded-xl py-2.5 px-3 text-center text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm"><Map className="w-4 h-4" /> <span>Bản Đồ Vị Trí</span></a>}
                {item.anhSoDo && <button onClick={() => setBlueprintUrl(item.anhSoDo || null)} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 rounded-xl py-2.5 px-3 text-center text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm"><FileText className="w-4 h-4" /> <span>Sổ Đỏ Bản Vẽ</span></button>}
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2"><span>Mô tả thực tế nhà đất:</span></h4>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-justify whitespace-pre-line mb-6">{item.moTa}</p>
              <div className="flex gap-3 mt-4 border-t border-slate-100 pt-4">
                <a href="tel:0931555551" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-sm shadow-md"><Phone className="w-4 h-4 text-amber-400 fill-amber-400" /> <span>Gọi Thỏa Thuận</span></a>
                <a href="https://zalo.me/0931555551" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#0068ff] text-white font-extrabold rounded-xl py-3 px-4 flex items-center justify-center text-sm shadow-md"><span>Liên Hệ Zalo</span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {blueprintUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <button onClick={() => setBlueprintUrl(null)} className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center"><X className="w-6 h-6" /></button>
          <div className="max-w-3xl w-full max-h-[85vh] flex items-center justify-center overflow-hidden rounded-xl"><img src={blueprintUrl} alt="Sơ đồ" className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-xl" /></div>
        </div>
      )}
    </>
  );
}

// ==========================================
// 4. COMPONENT: QUICK DEPOSIT (Form ký gửi)
// ==========================================
function QuickDepositModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const message = `Chào anh Huy, tôi muốn ký gửi nhà đất với thông tin:\n- Liên hệ: ${name}\n- Địa chỉ: ${address}\n- Giá mong muốn: ${price || "Thương lượng"}`;
    navigator.clipboard.writeText(message).then(() => {
      alert("📋 Đã sao chép thông tin ký gửi! Hệ thống đang chuyển sang Zalo của anh Huy.");
      window.open("https://zalo.me/0931555551", "_blank");
      onClose();
    }).catch(() => {
      window.open("https://zalo.me/0931555551", "_blank");
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400"><X className="w-4 h-4" /></button>
        <h3 className="font-extrabold text-slate-900 text-base mb-1 flex items-center gap-2"><PenTool className="text-amber-500 w-4 h-4" /> <span>Ký Gửi Nhanh Trong 10s</span></h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-sm mt-4">
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên & SĐT Liên Hệ *" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500" />
          <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Địa Chỉ Nhà Đất Ký Gửi *" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500" />
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Giá Bán Mong Muốn" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500" />
          <button type="submit" className="w-full bg-slate-900 text-white font-bold rounded-xl py-3 text-sm shadow-md"><span>Xác Nhận Ký Gửi</span></button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 5. TRANG LIẾT KÊ SẢN PHẨM CỐT LÕI
// ==========================================
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1-LupBV6uNuUitz4vF6pFv6MupuVDMujafqhjQBNNPTA/export?format=csv";
const ITEMS_PER_PAGE = 6;

function MainListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filters, setFilters] = useState<FilterState>({ khuVuc: 'all', loaiHinh: 'all', gia: 'all', huong: 'all', tag: 'all' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${GOOGLE_SHEET_CSV_URL}&t=${new Date().getTime()}`);
        const csvText = await res.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data.map((row: any, index: number) => ({
              id: parseInt(row.id) || index + 1,
              tieude: row.tieude || '',
              moTa: row.moTa || '',
              gia: row.gia || '',
              soGia: parseFloat(row.soGia) || 0,
              dienTich: row.dienTich || '',
              khuVuc: row.khuVuc || '',
              khuVucFull: row.khuVucFull || '',
              loaiHinh: row.loaiHinh || '',
              huong: row.huong || '',
              phongNgu: row.phongNgu || '',
              ngayDang: row.ngayDang || '',
              anh: row.anh || '',
              tag: row.tag || '',
              tagColor: row.tagColor || '',
              videoUrl: row.videoUrl || '',
              linkMap: row.linkMap || '',
              anhSoDo: row.anhSoDo || '',
              phapLy: row.phapLy || '',
              isMatTien: row.isMatTien === 'TRUE' || row.isMatTien === true
            }));
            setProperties(parsedData);
            setFilteredProperties(parsedData);
          }
        });
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam && properties.length > 0) {
      const match = properties.find(p => p.id === parseInt(idParam));
      if (match) setSelectedProperty(match);
    } else { setSelectedProperty(null); }
  }, [searchParams, properties]);

  useEffect(() => {
    let result = [...properties];
    if (filters.khuVuc !== 'all') result = result.filter(i => i.khuVuc === filters.khuVuc);
    if (filters.loaiHinh !== 'all') result = result.filter(i => i.loaiHinh === filters.loaiHinh);
    if (filters.gia !== 'all') {
      if (filters.gia === 'duoi3') result = result.filter(i => i.soGia < 3.0);
      else if (filters.gia === '3to5') result = result.filter(i => i.soGia >= 3.0 && i.soGia <= 5.0);
      else if (filters.gia === 'tren5') result = result.filter(i => i.soGia > 5.0);
    }
    if (filters.huong !== 'all') result = result.filter(i => i.huong?.toLowerCase().includes(filters.huong.toLowerCase()));
    if (filters.tag !== 'all') {
      if (filters.tag === 'mattien') result = result.filter(i => i.isMatTien === true);
      else if (filters.tag === 'chinhchu') result = result.filter(i => i.tag?.includes("Chính Chủ"));
    }
    setFilteredProperties(result);
    setCurrentPage(1);
  }, [filters, properties]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const currentPageData = filteredProperties.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="antialiased min-h-screen flex flex-col pb-20 md:pb-0">
      <Header onOpenDeposit={() => setIsDepositOpen(true)} />
      
      {/* HERO HERO-BG */}
      <section className="text-white bg-slate-900 py-16 px-4 text-center relative" style={{ background: "linear-gradient(rgba(2, 6, 23, 0.76), rgba(2, 6, 23, 0.86)), url('https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1800&auto=format&fit=crop')/cover center" }}>
        <div className="max-w-4xl mx-auto py-12">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 text-xs font-bold mb-6 tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> <span>KHO NHÀ ĐẤT CHÍNH CHỦ ĐÀ NẴNG</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight"><span>Nhà Thật • Giá Thật • Giao Dịch Minh Bạch</span></h2>
          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base mb-6"><span>Chuyên phân phối nhà phố, đất nền, mặt tiền kinh doanh và nhà kiệt ô tô tại Hải Châu, Cẩm Lệ, Sơn Trà... Hình ảnh thực tế từ chủ nhà.</span></p>
          <div className="flex justify-center gap-3">
            <a href="tel:0931555551" className="bg-amber-500 text-slate-900 px-5 py-3 rounded-xl font-extrabold text-sm shadow-md"><span>Gọi Ngay</span></a>
            <a href="https://zalo.me/0931555551" target="_blank" rel="noopener noreferrer" className="border border-white/20 hover:bg-white/10 px-5 py-3 rounded-xl font-bold text-sm"><span>Zalo Giỏ Hàng</span></a>
          </div>
        </div>
      </section>

      {/* FILTER PANEL */}
      <section className="max-w-7xl mx-auto w-full px-4 -mt-8 z-10">
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xl border grid grid-cols-2 gap-3 md:grid-cols-4">
          <select value={filters.khuVuc} onChange={(e) => setFilters(p => ({...p, khuVuc: e.target.value}))} className="bg-slate-50 border p-2.5 rounded-xl text-sm font-semibold text-slate-700">
            <option value="all">Tất cả Quận Huyện</option>
            <option value="Hải Châu">Quận Hải Châu</option>
            <option value="Thanh Khê">Quận Thanh Khê</option>
            <option value="Cẩm Lệ">Quận Cẩm Lệ</option>
            <option value="Sơn Trà">Quận Sơn Trà</option>
          </select>
          <select value={filters.loaiHinh} onChange={(e) => setFilters(p => ({...p, loaiHinh: e.target.value}))} className="bg-slate-50 border p-2.5 rounded-xl text-sm font-semibold text-slate-700">
            <option value="all">Tất cả Loại hình</option>
            <option value="Nhà phố">Nhà phố / Kiệt</option>
            <option value="Đất nền">Đất nền / Đất ở</option>
          </select>
          <select value={filters.gia} onChange={(e) => setFilters(p => ({...p, gia: e.target.value}))} className="bg-slate-50 border p-2.5 rounded-xl text-sm font-semibold text-slate-700">
            <option value="all">Tất cả mức giá</option>
            <option value="duoi3">Dưới 3 Tỷ</option>
            <option value="3to5">Từ 3 - 5 Tỷ</option>
            <option value="tren5">Trên 5 Tỷ</option>
          </select>
          <button onClick={() => setFilters(p => ({...p, tag: p.tag === 'mattien' ? 'all' : 'mattien'}))} className={`p-2.5 rounded-xl text-sm font-bold border transition-all ${filters.tag === 'mattien' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}><span>Mặt Tiền Kinh Doanh</span></button>
        </div>
      </section>

      {/* PROPERTY LIST */}
      <main id="listing-section" className={`max-w-7xl mx-auto w-full px-4 mt-12 mb-20 flex-1 transition-opacity ${isPending ? 'opacity-50' : ''}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <p className="text-amber-500 uppercase tracking-widest text-xs font-bold mb-1"><span>Giỏ hàng cập nhật liên tục</span></p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"><span>Nhà Đất Được Quan Tâm</span></h2>
          </div>
        </div>

        {/* TỐI ƯU SEO STATIC BOT */}
        <div className="sr-only">
          <h2><span>Danh sách nhà đất đang bán tại Hải Châu, Cẩm Lệ, Đà Nẵng</span></h2>
          {filteredProperties.map(item => (
            <article key={item.id}><h3>{item.tieude}</h3><p>{item.moTa}</p></article>
          ))}
        </div>

        {currentPageData.length === 0 ? (
          <div className="text-center py-12 text-slate-400"><span>Không có sản phẩm nào phù hợp bộ lọc.</span></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPageData.map(item => (
              <PropertyCard key={item.id} item={item} onClick={() => startTransition(() => router.push(`?id=${item.id}`, { scroll: false }))} />
            ))}
          </div>
        )}
        
        {/* PHÂN TRANG */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-xl font-bold text-sm ${page === currentPage ? 'bg-amber-500 text-slate-900' : 'bg-white border'}`}>{page}</button>
            ))}
          </div>
        )}
      </main>

      {/* ABOUT MARKET */}
      <section id="about-section" className="bg-white border-t border-b py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-4"><span>Chuyên Nhà Đất Thực Tế Tại Đà Nẵng</span></h3>
            <p className="text-slate-400 text-sm leading-relaxed"><span>Cam kết hạn chế tối đa tin ảo, hình minh họa sai lệch thực tế. Kiểm tra quy hoạch đô thị công khai và minh bạch pháp lý.</span></p>
          </div>
          <div className="bg-slate-50 border p-8 rounded-3xl flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4"><span>Phân Tích Địa Bàn Nổi Bật</span></h3>
            <p className="text-slate-600 text-sm leading-relaxed"><span>Thị trường tập trung dòng tiền mạnh tại khu vực Hải Châu, Cẩm Lệ nhờ hạ tầng đồng bộ và mật độ cư dân sầm uất.</span></p>
          </div>
        </div>
      </section>

      {/* FOOTER BAR FOR MOBILE */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 border-t p-3 flex gap-3 z-30 shadow-lg">
        <button onClick={() => setIsDepositOpen(true)} className="flex-1 bg-amber-500 text-slate-900 font-extrabold rounded-xl py-3 text-sm flex items-center justify-center gap-1"><FilePlus2 className="w-4 h-4" /> <span>Ký Gửi Nhanh</span></button>
        <a href="tel:0931555551" className="flex-1 bg-slate-900 text-white font-bold rounded-xl py-3 text-sm text-center pt-2.5"><span>Gọi Ngay</span></a>
      </div>

      <PropertyModal item={selectedProperty} onClose={() => startTransition(() => router.push('/', { scroll: false }))} />
      <QuickDepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
    </div>
  );
}

// ==========================================
// 6. KHỐI KHỞI CHẠY CHUẨN ĐÃ SỬA LỖI SUSPENSE
// ==========================================
export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-semibold text-slate-500">
        <span>Đang khởi tạo hệ thống giỏ hàng...</span>
      </div>
    }>
      <MainListingContent />
    </Suspense>
  );
}
