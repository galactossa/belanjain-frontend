import CustomerNavbar from "../components/customer/CustomerNavbar";
import Footer from "../components/home/Footer";

function CustomerLayout({ children }) {
  return (
    <div className="bg-[#f5f7fb] min-h-screen">

      <CustomerNavbar />

      <main>
        {children}
      </main>

      <Footer />

    </div>
  );
}

export default CustomerLayout;