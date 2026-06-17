import React, { useMemo, useState } from "react";
import {
  Star,
  X,
  ThumbsUp,
  CheckCircle,
} from "lucide-react";

export default function ViewAllReviewsModal({
  isOpen,
  onClose,
  productReviews = [],
  totalReviewCount = 0,
}) {
  const [reviewFilter, setReviewFilter] = useState(null);
  const [reviewSort, setReviewSort] = useState("terbaru");
  const [photoOnly, setPhotoOnly] = useState(false);

  const filteredReviews = useMemo(() => {
    let data = [...productReviews];

    if (reviewFilter !== null) {
      data = data.filter(
        (r) => Math.round(r.rating) === reviewFilter
      );
    }

    if (photoOnly) {
      data = data.filter(
        (r) => r.images && r.images.length > 0
      );
    }

    switch (reviewSort) {
      case "tertinggi":
        data.sort((a, b) => b.rating - a.rating);
        break;

      case "terendah":
        data.sort((a, b) => a.rating - b.rating);
        break;

      default:
        data.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
        break;
    }

    return data;
  }, [
    productReviews,
    reviewFilter,
    reviewSort,
    photoOnly,
  ]);

  const handleHelpful = (review) => {
    alert(
      `Anda menandai ulasan ${review.reviewerName} sebagai membantu`
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl h-[88vh] rounded-[28px] overflow-hidden shadow-2xl flex flex-col">
        {/* HEADER */}
        <div className="border-b px-6 py-5">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                <Star
                  size={18}
                  className="fill-yellow-400 text-yellow-400"
                />
              </div>

              <div>
                <h2 className="font-black text-xl uppercase text-slate-800">
                  Semua Ulasan Pembeli
                </h2>

                <p className="text-[10px] uppercase tracking-[2px] text-slate-400 mt-1">
                  Ulasan asli dari pembeli terverifikasi (
                  {totalReviewCount} total)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* FILTER */}
        <div className="border-b px-6 py-5">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
            <div>
              <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400 mb-3">
                Filter Rating
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setReviewFilter(null)}
                  className={`h-9 px-4 rounded-xl text-xs font-bold transition ${
                    reviewFilter === null
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Semua
                </button>

                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    onClick={() =>
                      setReviewFilter(star)
                    }
                    className={`h-9 px-4 rounded-xl flex items-center gap-1 text-xs font-bold transition ${
                      reviewFilter === star
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {star}
                    <Star
                      size={12}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  </button>
                ))}
              </div>

              <p className="text-xs text-slate-500 mt-4">
                Menampilkan {filteredReviews.length} ulasan
              </p>
            </div>

            <div className="flex flex-col lg:items-end">
              <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400 mb-3">
                Media Ulasan
              </p>

              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setPhotoOnly(false)}
                  className={`h-9 px-4 rounded-xl text-xs font-bold ${
                    !photoOnly
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200"
                  }`}
                >
                  Semua Ulasan
                </button>

                <button
                  onClick={() => setPhotoOnly(true)}
                  className={`h-9 px-4 rounded-xl text-xs font-bold ${
                    photoOnly
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200"
                  }`}
                >
                  Dengan Foto (
                  {
                    productReviews.filter(
                      (r) =>
                        r.images &&
                        r.images.length > 0
                    ).length
                  }
                  )
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">
                  URUTKAN:
                </span>

                <select
                  value={reviewSort}
                  onChange={(e) =>
                    setReviewSort(e.target.value)
                  }
                  className="h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  <option value="terbaru">
                    Paling Membantu
                  </option>

                  <option value="tertinggi">
                    Rating Tertinggi
                  </option>

                  <option value="terendah">
                    Rating Terendah
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* LIST REVIEW */}
        <div className="flex-1 overflow-y-auto px-6">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className="py-6 border-b"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border flex items-center justify-center font-bold text-slate-600">
                      {review.reviewerName?.charAt(0)}
                    </div>

                    <div>
                      <h4 className="font-bold text-sm">
                        {review.reviewerName}
                      </h4>

                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[...Array(5)].map(
                            (_, index) => (
                              <Star
                                key={index}
                                size={13}
                                className={
                                  index <
                                  Math.round(
                                    review.rating
                                  )
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-slate-200"
                                }
                              />
                            )
                          )}
                        </div>

                        <span className="text-xs text-slate-400">
                          • {review.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-600 text-[10px] font-black flex items-center gap-1">
                    <CheckCircle size={11} />
                    TERVERIFIKASI
                  </div>
                </div>

                <div className="mt-4 text-[10px] uppercase tracking-[2px] text-slate-400 font-black">
                  VARIAN: {review.variant || "-"}
                </div>

                <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                  {review.comment}
                </p>

                {review.images &&
                  review.images.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {review.images.map(
                        (img, index) => (
                          <a
                            key={index}
                            href={img}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={img}
                              alt=""
                              className="w-20 h-20 rounded-xl border object-cover hover:opacity-80"
                            />
                          </a>
                        )
                      )}
                    </div>
                  )}

                <button
                  onClick={() =>
                    handleHelpful(review)
                  }
                  className="mt-4 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 flex items-center gap-2"
                >
                  <ThumbsUp size={13} />
                  Membantu ({review.helpful || 0})
                </button>
              </div>
            ))
          ) : (
            <div className="py-24 text-center text-slate-400">
              Tidak ada ulasan ditemukan
            </div>
          )}
        </div>
      </div>
    </div>
  );
}