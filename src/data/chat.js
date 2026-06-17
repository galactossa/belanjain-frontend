export const chats = [
  {
    id: "CHAT-001",

    customerId: 1,
    sellerId: 3,
    productId: 1,
    orderId: "ORD-001",

    messages: [
      {
        senderId: 1,
        text: "Halo kak, stok Oversize Streetwear masih ada?",
        time: "09:12",
      },

      {
        senderId: 3,
        text: "Halo kak, masih tersedia ya.",
        time: "09:14",
      },

      {
        senderId: 1,
        text: "Siap kak, saya checkout sekarang.",
        time: "09:15",
      },
    ],
  },

  {
    id: "CHAT-002",

    customerId: 6,
    sellerId: 3,
    productId: 2,
    orderId: "ORD-002",

    messages: [
      {
        senderId: 6,
        text: "Cargo Pants ukuran L masih ready?",
        time: "11:20",
      },

      {
        senderId: 3,
        text: "Masih ready kak.",
        time: "11:22",
      },
    ],
  },

  {
    id: "CHAT-003",

    customerId: 1,
    sellerId: 4,
    productId: 4,
    orderId: "ORD-004",

    messages: [
      {
        senderId: 1,
        text: "Kursinya perlu dirakit sendiri?",
        time: "13:10",
      },

      {
        senderId: 4,
        text: "Tidak kak, sudah siap pakai.",
        time: "13:12",
      },
    ],
  },

  {
    id: "CHAT-004",

    customerId: 6,
    sellerId: 5,
    productId: 8,
    orderId: "ORD-008",

    messages: [
      {
        senderId: 6,
        text: "Smart Watch ini support Android?",
        time: "15:00",
      },

      {
        senderId: 5,
        text: "Support Android dan iOS kak.",
        time: "15:03",
      },
    ],
  },

  {
    id: "CHAT-005",

    customerId: 1,
    adminId: 1,
    type: "report",

    messages: [
      {
        senderId: 1,
        text: "Admin, saya mau lapor seller atas nama Toko Elektronik. Barang yang diterima tidak sesuai dengan gambar.",
        time: "10:30",
      },

      {
        senderId: 1,
        text: "Ini barangnya rusak, padahal kondisi dijual seperti baru.",
        time: "10:31",
      },

      {
        senderId: 1,
        adminId: true,
        text: "Baik, kami sudah catat laporan Anda. Kami akan segera hubungi seller untuk verifikasi. Harap tunggu maksimal 24 jam.",
        time: "10:45",
      },
    ],
  },

  {
    id: "CHAT-006",

    sellerId: 3,
    adminId: 1,
    type: "report",

    messages: [
      {
        senderId: 3,
        text: "Admin, ada customer yang komplain barang diterima rusak tapi tidak ada bukti foto. Mohon bantuan.",
        time: "14:20",
      },

      {
        senderId: 1,
        adminId: true,
        text: "Kami akan minta bukti dari customer. Jika tidak ada bukti, maka ini tidak bisa diproses. Tunggu info lebih lanjut.",
        time: "14:35",
      },
    ],
  },

  {
    id: "CHAT-007",

    customerId: 6,
    adminId: 1,
    type: "report",

    messages: [
      {
        senderId: 6,
        text: "Admin, saya komplain. Sudah 3 hari barang belum dikirim padahal seller sudah packing.",
        time: "16:00",
      },

      {
        senderId: 1,
        adminId: true,
        text: "Mohon maaf atas keterlambatannya. Kami sudah follow up ke kurir. Barang seharusnya tiba esok hari.",
        time: "16:15",
      },

      {
        senderId: 6,
        text: "Terimakasih admin, semoga lancar.",
        time: "16:20",
      },
    ],
  },
];

export const adminChats = [
  {
    id: "ADMIN-CHAT-001",
    title: "Laporan Produk Oversize Streetwear",
    messages: [
      {
        senderId: 3,
        text: "Laporan produk Oversize Streetwear: keluhan ukuran tidak sesuai.",
        time: "08:45",
      },
      {
        senderId: 2,
        text: "Terima kasih, kami akan cek detail produk dan update status listing.",
        time: "08:50",
      },
    ],
  },
  {
    id: "ADMIN-CHAT-002",
    title: "Laporan Produk Kursi",
    messages: [
      {
        senderId: 4,
        text: "Stok kursi sudah habis, tetapi masih tampil di halaman produk.",
        time: "10:20",
      },
      {
        senderId: 2,
        text: "Kami akan segera memperbarui inventaris dan menandai produk sebagai kosong.",
        time: "10:25",
      },
    ],
  },
];
