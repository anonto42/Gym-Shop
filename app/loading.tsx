export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-[#00AEFF] rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading...</p>
    </div>
  );
}