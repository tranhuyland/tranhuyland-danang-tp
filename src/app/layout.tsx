import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Trần Huy Land | Kho Nhà Đất Chính Chủ Hải Châu Cẩm Lệ Đà Nẵng",
  description: "Mua bán, ký gửi nhà đất chính chủ uy tín tại Hải Châu, Cẩm Lệ, Đà Nẵng. Cập nhật giỏ hàng thực tế mỗi ngày: Nhà mặt tiền Cẩm Bá Thước, nhà kiệt ô tô Cách Mạng Tháng 8. Pháp lý minh bạch, có sẵn sổ đỏ bản vẽ xem ngay.",
  keywords: ["nhà đất đà nẵng", "nhà đất chính chủ hải châu", "ký gửi nhà đất cẩm lệ", "nhà đất trần huy", "mua nhà đà nẵng", "bán đất cẩm lệ", "mặt tiền cẩm bá thước"],
  robots: "index, follow, max-image-preview:large",
  alternates: {
    canonical: "https://tranhuyland.vn",
  },
  openGraph: {
    title: "Trần Huy Land | Kho Nhà Đất Chính Chủ Hải Châu Cẩm Lệ Đà Nẵng",
    description: "Mua bán, ký gửi nhà đất chính chủ uy tín tại Hải Châu, Cẩm Lệ, Đà Nẵng. Cập nhật giỏ hàng thực tế mỗi ngày.",
    url: "https://tranhuyland.vn",
    type: "website",
    images: [
      {
        url: "https://i.postimg.cc/JhKg8VZ9/70554272-47DB-4D3A-A1AE-2782EFCAF00F.png",
        width: 1200,
        height: 630,
        alt: "Trần Huy Land",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="antialiased bg-[#F8FAFC] text-[#0f172a]">
        {children}
      </body>
    </html>
  );
}

