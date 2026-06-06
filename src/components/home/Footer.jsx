function Footer() {
  return (
    <footer className="bg-white border-t mt-20">

      <div className="max-w-[1450px] mx-auto px-6 py-14 grid grid-cols-3 gap-14">

        <div>

          <h1 className="text-4xl font-black">

            <span className="text-blue-600">
              Belanja
            </span>

            Inn

          </h1>

          <p className="text-slate-500 mt-5 leading-relaxed">

            Platform ecommerce terpercaya
            untuk pengalaman belanja modern.

          </p>

        </div>

        <div>

          <h2 className="font-black text-xl mb-5">
            Layanan
          </h2>

          <ul className="space-y-4 text-slate-500">

            <li>Pusat Bantuan</li>
            <li>Metode Pembayaran</li>
            <li>Lacak Pesanan</li>
            <li>Pengembalian</li>

          </ul>

        </div>

        <div>

          <h2 className="font-black text-xl mb-5">
            Tentang Kami
          </h2>

          <ul className="space-y-4 text-slate-500">

            <li>Tentang Kami</li>
            <li>Karir</li>
            <li>Blog</li>
            <li>Kebijakan Privasi</li>

          </ul>

        </div>

      </div>

    </footer>
  );
}

export default Footer;