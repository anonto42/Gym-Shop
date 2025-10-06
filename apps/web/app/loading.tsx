export default function Loading() {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-[9999]">
        <div className="w-12 h-12 border-4 border-t-[#00AEFF] border-gray-300 rounded-full animate-spin"></div>
        <p className="text-[#00AEFF] font-medium mt-4">Loading...</p>
      </div>
    );
  }
  