
const LoadingDots = () => {
  return (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
    </div>
  );
};

export { LoadingDots };
