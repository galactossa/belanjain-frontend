import CustomerLayout from "../../layouts/CustomerLayout";

function Cart() {
  const cartItems = [
    {
      id: 1,
      title: "iPhone 15 Pro Max",
      price: "Rp 19.999.000",
      qty: 1,
    },
    {
      id: 2,
      title: "Apple Watch Series 9",
      price: "Rp 6.299.000",
      qty: 2,
    },
  ];

  return (
    <CustomerLayout>

      <div className="max-w-7xl mx-auto px-6 py-12">

        <h1 className="text-5xl font-black mb-10">
          Keranjang Saya
        </h1>

        <div className="bg-white rounded-[30px] border overflow-hidden">

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-8 py-7 border-b"
            >

              <div>

                <h2 className="text-2xl font-black">
                  {item.title}
                </h2>

                <p className="text-slate-400 mt-2">
                  Jumlah: {item.qty}
                </p>

              </div>

              <h3 className="text-blue-600 text-2xl font-black">
                {item.price}
              </h3>

            </div>
          ))}

        </div>

      </div>

    </CustomerLayout>
  );
}

export default Cart;