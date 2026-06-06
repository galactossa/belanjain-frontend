import SidebarSeller from "../components/seller/SidebarSeller";

function SellerLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#f6f8fc] overflow-hidden">

      <SidebarSeller />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 min-h-screen">
          {children}
        </div>
      </main>

    </div>
  );
}

export default SellerLayout;