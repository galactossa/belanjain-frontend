import SidebarAdmin from "../components/admin/SidebarAdmin";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* SIDEBAR FIX */}
      <SidebarAdmin />

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {/* AREA PAGE */}
        <div className="p-8 min-h-screen">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
