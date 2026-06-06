import CustomerLayout from "../../layouts/CustomerLayout";

import ProductCard from "../../components/customer/ProductCard";

function Products() {
  const products = [
    {
      id: 1,
      title: "iPhone 15 Pro Max",
      price: "Rp 19.999.000",
      image:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
    },
    {
      id: 2,
      title: "Macbook Air M2",
      price: "Rp 16.499.000",
      image:
        "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
    },
    {
      id: 3,
      title: "Sony WH1000XM5",
      price: "Rp 4.599.000",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    },
    {
      id: 4,
      title: "Apple Watch Series 9",
      price: "Rp 6.299.000",
      image:
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
    },
    {
      id: 5,
      title: "Keyboard Mechanical",
      price: "Rp 899.000",
      image:
        "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae",
    },
    {
      id: 6,
      title: "Gaming Mouse RGB",
      price: "Rp 499.000",
      image:
        "https://images.unsplash.com/photo-1527814050087-3793815479db",
    },
  ];

  return (
    <CustomerLayout>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="mb-12">

          <p className="text-blue-600 uppercase tracking-[4px] font-black">
            Produk
          </p>

          <h1 className="text-5xl font-black mt-3">
            Semua Produk
          </h1>

        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-3 gap-7">

          {products.map((item) => (
            <ProductCard
              key={item.id}
              title={item.title}
              price={item.price}
              image={item.image}
            />
          ))}

        </div>

      </div>

    </CustomerLayout>
  );
}

export default Products;