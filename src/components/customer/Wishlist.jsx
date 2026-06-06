import {
  Heart,
  X,
  Trash2,
  ShoppingCart,
} from "lucide-react";

function Wishlist({
  open,
  setOpen,
  items,
  setItems,
}) {
  const removeWishlist = (id) => {
    const updated = items.filter(
      (item) => item.id !== id
    );

    setItems(updated);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updated)
    );
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        className={`
          fixed inset-0 bg-black/40 z-40
          duration-300
          ${
            open
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
        `}
      />

      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 right-0 h-screen
          w-[380px]
          bg-white
          z-50
          shadow-2xl
          duration-300
          flex flex-col
          ${
            open
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        {/* HEADER */}
        <div className="h-[80px] border-b flex items-center justify-between px-6">

          <div className="flex items-center gap-3">

            <Heart
              size={22}
              className="text-red-500 fill-red-500"
            />

            <h2 className="font-black text-xl">
              Wishlist Saya
            </h2>

          </div>

          <button
            onClick={() => setOpen(false)}
          >
            <X />
          </button>

        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {items.length === 0 ? (

            <div className="h-full flex flex-col items-center justify-center text-center">

              <Heart
                size={55}
                className="text-slate-300"
              />

              <h3 className="font-black text-xl mt-5">
                Wishlist Kosong
              </h3>

              <p className="text-slate-400 text-sm mt-2">
                Simpan produk favoritmu
              </p>

            </div>

          ) : (

            items.map((item) => (

              <div
                key={item.id}
                className="border rounded-3xl p-3 flex gap-3"
              >

                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-2xl object-cover"
                />

                {/* CONTENT */}
                <div className="flex-1">

                  <h3 className="font-black text-sm line-clamp-2">
                    {item.name}
                  </h3>

                  <p className="text-blue-600 font-black mt-2">
                    Rp{" "}
                    {item.price.toLocaleString(
                      "id-ID"
                    )}
                  </p>

                  <div className="flex items-center gap-2 mt-4">

                    {/* CART */}
                    <button
                      className="
                      flex-1
                      h-11
                      rounded-xl
                      bg-blue-600
                      text-white
                      font-bold
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                    >

                      <ShoppingCart size={18} />

                      Keranjang

                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        removeWishlist(item.id)
                      }
                      className="
                      w-11
                      h-11
                      rounded-xl
                      bg-red-50
                      text-red-500
                      flex
                      items-center
                      justify-center
                    "
                    >

                      <Trash2 size={18} />

                    </button>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      </div>
    </>
  );
}

export default Wishlist;