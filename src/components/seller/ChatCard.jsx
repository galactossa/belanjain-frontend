// import {
//   MessageCircle,
//   Clock,
// } from "lucide-react";

// function ChatCard({
//   name,
//   message,
//   time,
//   active,
// }) {
//   return (
//     <div
//       className={`p-5 rounded-[28px] border duration-300 cursor-pointer hover:shadow-lg ${
//         active
//           ? "bg-blue-600 text-white border-blue-600"
//           : "bg-white hover:bg-slate-50"
//       }`}
//     >

//       <div className="flex items-start justify-between">

//         {/* LEFT */}
//         <div className="flex items-center gap-4">

//           {/* AVATAR */}
//           <div
//             className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${
//               active
//                 ? "bg-white text-blue-600"
//                 : "bg-blue-100 text-blue-600"
//             }`}
//           >

//             {name.charAt(0)}

//           </div>

//           {/* TEXT */}
//           <div>

//             <h2
//               className={`font-black text-lg ${
//                 active
//                   ? "text-white"
//                   : "text-slate-900"
//               }`}
//             >

//               {name}

//             </h2>

//             <p
//               className={`text-sm mt-1 ${
//                 active
//                   ? "text-blue-100"
//                   : "text-slate-500"
//               }`}
//             >

//               {message}

//             </p>

//           </div>

//         </div>

//         {/* RIGHT */}
//         <div className="flex flex-col items-end gap-3">

//           <div
//             className={`flex items-center gap-1 text-sm ${
//               active
//                 ? "text-blue-100"
//                 : "text-slate-400"
//             }`}
//           >

//             <Clock size={14} />

//             {time}

//           </div>

//           <div
//             className={`w-10 h-10 rounded-xl flex items-center justify-center ${
//               active
//                 ? "bg-white text-blue-600"
//                 : "bg-slate-100 text-slate-500"
//             }`}
//           >

//             <MessageCircle size={18} />

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default ChatCard;