import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Package,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("orders")) || [];

    setOrders(saved.reverse());
  }, []);

  const tabs = [
    "Semua",
    "Menunggu Pembayaran",
    "Diproses",
    "Dikirim",
    "Selesai",
    "Komplain",
  ];

  const filteredOrders = useMemo(() => {
    let data = [...orders];

   if (activeTab !== "Semua") {

data = data.filter((o)=>{

const status =
(o.status || "")
.toLowerCase()
.trim();

const tab =
activeTab
.toLowerCase()
.trim();

return status === tab;

});

}
    if (search.trim()) {
      data = data.filter((order) =>
        order.products.some((p) =>
          p.name
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      );
    }

    return data;
  }, [orders, search, activeTab]);

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "menunggu pembayaran":
        return "bg-yellow-100 text-yellow-600";

      case "diproses":
        return "bg-blue-100 text-blue-600";

      case "dikirim":
        return "bg-purple-100 text-purple-600";

      case "selesai":
        return "bg-green-100 text-green-600";

      case "komplain":
        return "bg-red-100 text-red-600";

      default:
        return "bg-slate-100 text-slate-500";
    }
  };

  return (
    <div className="bg-[#f5f7fb] min-h-screen">

      {/* HEADER */}

      <div className="bg-white px-10 py-8 border-b">

        <div className="flex justify-between items-center">

          <h1 className="font-black text-5xl">
            DAFTAR TRANSAKSI
          </h1>

          <div className="w-[320px] relative">

            <Search
              className="absolute left-4 top-4 text-slate-400"
              size={20}
            />

            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Cari transaksi..."
              className="
              w-full
              h-14
              rounded-2xl
              bg-slate-100
              pl-12
              outline-none
              font-semibold
              "
            />

          </div>

        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* FILTER */}

        <div className="flex gap-4 flex-wrap mb-10">

          {tabs.map((tab)=>(
            <button
            key={tab}
            onClick={()=>setActiveTab(tab)}
            className={`
            px-8
            h-14
            rounded-2xl
            font-black
            uppercase
            tracking-[2px]
            duration-300

            ${
              activeTab===tab
              ?
              "bg-blue-600 text-white shadow-xl"
              :
              "bg-white border"
            }
            `}
            >

              {tab}

            </button>
          ))}

        </div>

        {/* EMPTY */}

        {filteredOrders.length===0 && (

          <div className="
          bg-white
          rounded-[40px]
          p-20
          text-center
          ">

            <Package
            size={70}
            className="
            mx-auto
            text-slate-300
            mb-8
            "
            />

            <h1 className="text-4xl font-black">

              Tidak ada transaksi

            </h1>

          </div>

        )}

        <div className="flex flex-col gap-8">

          {filteredOrders.map((order,index)=>(

            <div
            key={index}
            className="
            bg-white
            rounded-[40px]
            overflow-hidden
            border
            "
            >

              {/* TOP */}

              <div className="p-8">

                <div className="flex justify-between">

                  <div>

                    <p className="text-slate-400 font-black uppercase">
                      BELANJA
                    </p>

                    <h2 className="font-black text-3xl">

                      {new Date(
                        order.date
                      ).toLocaleDateString(
                        "id-ID",
                        {
                          day:"numeric",
                          month:"long",
                          year:"numeric"
                        }
                      )}

                    </h2>

                  </div>

                  <div className="flex gap-4 items-center">

                    <div className={`
                    px-5 py-2 rounded-full
                    font-black
                    uppercase
                    text-sm
                    ${statusColor(order.status)}
                    `}>

                      {order.status}

                    </div>

                  </div>

                </div>

                {/* PRODUCTS */}

                <div className="mt-8 flex flex-col gap-5">

                  {order.products.map((item)=>(
                    <div
                    key={item.id}
                    className="
                    bg-slate-50
                    rounded-3xl
                    p-5
                    flex
                    justify-between
                    items-center
                    "
                    >

                      <div className="flex gap-5">

                        <img
                        src={item.image}
                        className="
                        w-24
                        h-24
                        rounded-3xl
                        object-cover
                        "
                        />

                        <div>

                          <h2 className="
                          font-black
                          text-2xl
                          ">

                            {item.name}

                          </h2>

                          <p className="text-slate-500">

                            {item.qty} barang × Rp{" "}
                            {Number(
                              item.price
                            ).toLocaleString("id-ID")}

                          </p>

                        </div>

                      </div>

                      <button className="
                      px-6
                      h-12
                      rounded-2xl
                      border
                      text-blue-600
                      font-black
                      flex
                      gap-2
                      items-center
                      ">

                        <MessageSquare size={18}/>
                        Chat Seller

                      </button>

                    </div>
                  ))}

                </div>

              </div>

              {/* FOOTER */}

              <div className="
              border-t
              px-8
              py-6
              flex
              justify-between
              items-center
              ">

                <button className="
                text-blue-600
                font-black
                flex
                items-center
                gap-2
                ">

                  LIHAT DETAIL TRANSAKSI

                  <ChevronRight size={18}/>

                </button>

                <div className="flex gap-3 items-center">

                  <h1 className="
                  text-4xl
                  font-black
                  mr-8
                  ">

                    Rp{" "}
                    {Number(
                      order.total
                    ).toLocaleString("id-ID")}

                  </h1>

                  <button className="
                  px-6
                  h-12
                  rounded-2xl
                  border
                  font-black
                  ">
                    BELI LAGI
                  </button>

                  {(order.status==="Dikirim" ||
                  order.status==="Selesai") && (

                    <button className="
                    px-6
                    h-12
                    rounded-2xl
                    bg-blue-600
                    text-white
                    font-black
                    ">

                      Lacak Pesanan

                    </button>

                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Orders;