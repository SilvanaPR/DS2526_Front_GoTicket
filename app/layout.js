"use client";
import "./globals.css";
import Sidenav from "./components/SideNav";
import { useEffect, useState } from "react";
import Header from "./components/MobileHeader";
import StoreProvider from "./StoreProvider";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <html lang="en">
      <body className="bg-gray-50">
        <StoreProvider>
          <div className="flex min-h-screen">
            {/* Sidebar: colapsa a 0 cuando está cerrado */}
            <div
              className={`h-screen bg-white transition-all duration-200 overflow-hidden ${sidebarOpen ? "w-64 border-r" : "w-0 border-r-0"
                } shrink-0`}
            >
              <Sidenav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            </div>

            {/* Contenido */}
            <main className="flex-1 min-h-screen flex items-center justify-center px-6 py-8">
              <div className="w-full max-w-6xl">{children}</div>
            </main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
