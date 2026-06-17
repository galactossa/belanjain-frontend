import SidebarSeller from "../components/seller/SidebarSeller";

function SellerLayout({ children }) {
  return (
    <div className="seller-layout flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* SIDEBAR FIX */}
      <SidebarSeller />

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {/* AREA PAGE */}
        <div className="p-8 min-h-screen">{children}</div>
      </main>
    </div>
  );
}

export default SellerLayout;
