// import ProductCard from "./ProductCard";

// function FlashSale() {
//   const products = [
//     {
//       id: 1,
//       title: "iPhone 15 Pro Max",
//       price: "Rp 19.999.000",
//       image:
//         "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
//     },
//     {
//       id: 2,
//       title: "Macbook Air M2",
//       price: "Rp 16.499.000",
//       image:
//         "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
//     },
//     {
//       id: 3,
//       title: "Sony WH-1000XM5",
//       price: "Rp 4.599.000",
//       image:
//         "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
//     },
//     {
//       id: 4,
//       title: "Apple Watch Series 9",
//       price: "Rp 6.299.000",
//       image:
//         "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
//     },
//   ];

//   return (
//     <section className="max-w-7xl mx-auto px-6 mt-20">

//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-10">

//         <div>

//           <p className="text-blue-600 font-black uppercase tracking-[4px]">
//             Flash Sale
//           </p>

//           <h1 className="text-5xl font-black mt-3">
//             Promo Hari Ini
//           </h1>

//         </div>

//         <button className="h-14 px-7 rounded-2xl bg-blue-600 text-white font-bold">

//           Lihat Semua

//         </button>

//       </div>

//       {/* PRODUCTS */}
//       <div className="grid grid-cols-4 gap-7">

//         {products.map((item) => (
//           <ProductCard
//             key={item.id}
//             image={item.image}
//             title={item.title}
//             price={item.price}
//           />
//         ))}

//       </div>

//     </section>
//   );
// }

// export default FlashSale;