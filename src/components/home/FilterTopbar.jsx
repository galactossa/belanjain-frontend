import { Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function FilterTopbar() {
  const navigate = useNavigate();

  const [search, setSearch] =
    useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim() === "") {
      navigate("/products");
    } else {
      navigate(
        `/products?search=${search}`
      );
    }
  };

  return (
    <div
      className="
      w-full
      bg-white
      border
      border-slate-200
      rounded-[28px]
      p-5
      shadow-sm
      flex
      items-center
      justify-between
      gap-5
    "
    >

      {/* SEARCH */}
      <form
        onSubmit={handleSearch}
        className="flex-1"
      >

        <div
          className="
          h-14
          bg-slate-50
          border
          border-slate-200
          rounded-2xl
          px-5
          flex
          items-center
          gap-3
        "
        >

          <Search
            size={20}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Cari produk Anda..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
            w-full
            h-full
            bg-transparent
            outline-none
            text-sm
            font-medium
            text-slate-700
            placeholder:text-slate-400
          "
          />

        </div>

      </form>

      {/* CATEGORY */}
      <select
        className="
        h-14
        px-5
        rounded-2xl
        border
        border-slate-200
        bg-white
        text-sm
        font-bold
        text-slate-700
        outline-none
      "
      >

        <option>
          Semua Kategori
        </option>

        <option>
          Elektronik
        </option>

        <option>
          Fashion
        </option>

        <option>
          Audio
        </option>

        <option>
          Laptop
        </option>

      </select>

      {/* SORT */}
      <select
        className="
        h-14
        px-5
        rounded-2xl
        border
        border-slate-200
        bg-white
        text-sm
        font-bold
        text-slate-700
        outline-none
      "
      >

        <option>
          Terbaru
        </option>

        <option>
          Harga Terendah
        </option>

        <option>
          Harga Tertinggi
        </option>

      </select>

      {/* FILTER BUTTON */}
      <button
        className="
        w-14
        h-14
        rounded-2xl
        border
        border-slate-200
        bg-white
        flex
        items-center
        justify-center
        hover:bg-slate-50
        duration-300
      "
      >

        <SlidersHorizontal
          size={20}
          className="text-slate-600"
        />

      </button>

    </div>
  );
}

export default FilterTopbar;