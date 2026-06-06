import CustomerLayout from "../../layouts/CustomerLayout";

import CategoryCard from "../../components/customer/CategoryCard";

function Categories() {
  const categories = [
    {
      id: 1,
      title: "Elektronik",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    },
    {
      id: 2,
      title: "Fashion",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    },
    {
      id: 3,
      title: "Gaming",
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e",
    },
    {
      id: 4,
      title: "Aksesoris",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    },
    {
      id: 5,
      title: "Laptop",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    },
    {
      id: 6,
      title: "Audio",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    },
  ];

  return (
    <CustomerLayout>

      <div className="max-w-7xl mx-auto px-6 py-12">

        <p className="text-blue-600 uppercase tracking-[4px] font-black">
          Kategori
        </p>

        <h1 className="text-5xl font-black mt-3 mb-12">
          Semua Kategori
        </h1>

        <div className="grid grid-cols-3 gap-7">

          {categories.map((item) => (
            <CategoryCard
              key={item.id}
              title={item.title}
              image={item.image}
            />
          ))}

        </div>

      </div>

    </CustomerLayout>
  );
}

export default Categories;