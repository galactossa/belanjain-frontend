function CategoryCard({ title, image }) {
  return (
    <div className="bg-white rounded-[30px] border p-6 hover:-translate-y-2 duration-300 shadow-sm cursor-pointer">

      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover rounded-2xl"
      />

      <h2 className="text-xl font-black text-center mt-5">
        {title}
      </h2>

    </div>
  );
}

export default CategoryCard;