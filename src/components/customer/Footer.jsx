function Footer() {
  return (
    <footer className="bg-white border-t mt-20">

      <div className="max-w-7xl mx-auto px-6 py-14">

        <div className="grid grid-cols-4 gap-10">

          {/* LOGO */}
          <div>

            <h1 className="text-3xl font-black">

              <span className="text-blue-600">
                Belanja
              </span>

              <span className="text-slate-400">
                In
              </span>

            </h1>

            <p className="text-slate-500 mt-4 leading-relaxed">
              Platform marketplace modern untuk
              kebutuhan harian Anda.
            </p>

          </div>

          {/* MENU */}
          <div>

            <h2 className="font-black text-lg mb-5">
              Menu
            </h2>

            <div className="flex flex-col gap-3 text-slate-500">

              <p>Home</p>
              <p>Produk</p>
              <p>Kategori</p>
              <p>Pesanan</p>

            </div>

          </div>

          {/* CATEGORY */}
          <div>

            <h2 className="font-black text-lg mb-5">
              Kategori
            </h2>

            <div className="flex flex-col gap-3 text-slate-500">

              <p>Elektronik</p>
              <p>Fashion</p>
              <p>Gaming</p>
              <p>Aksesoris</p>

            </div>

          </div>

          {/* CONTACT */}
          <div>

            <h2 className="font-black text-lg mb-5">
              Kontak
            </h2>

            <div className="flex flex-col gap-3 text-slate-500">

              <p>support@belanjain.com</p>
              <p>+62 812 3456 7890</p>
              <p>Tangerang, Indonesia</p>

            </div>

          </div>

        </div>

        <div className="border-t mt-10 pt-6 text-center text-slate-400">

          © 2026 BelanjaIn. All rights reserved.

        </div>

      </div>

    </footer>
  );
}

export default Footer;