import {
  Heart,
  ShoppingCart,
} from "lucide-react";

function ProductCard({
  image,
  title,
  price,
}) {
  return (
    <div className="bg-white rounded-[30px] border p-5 shadow-sm hover:-translate-y-2 duration-300">

      <img
        src={image}
        alt={title}
        className="w-full h-56 object-cover rounded-2xl"
      />

      <h2 className="text-xl font-black mt-5 line-clamp-1">
        {title}
      </h2>

      <p className="text-blue-600 font-black text-2xl mt-3">
        {price}
      </p>

      <div className="flex items-center gap-3 mt-6">

        <button className="flex-1 h-12 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 duration-300">

          Beli

        </button>

        <button className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">

          <Heart size={18} />

        </button>

        <button className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">

          <ShoppingCart size={18} />

        </button>

      </div>

    </div>
  );
}

export default ProductCard;