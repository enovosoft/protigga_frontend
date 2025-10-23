import { cn } from "@/lib/utils";

function Loading({ text = "Loading", className = "" }) {
  return (
    <div
      className={cn(
        `fixed inset-0 bg-primary/80 backdrop-blur-[2px] flex items-center justify-center z-50`,
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

        <div className="text-white text-lg font-medium flex items-center">
          {text}
          <span className="inline-flex ml-1">
            <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
              .
            </span>
            <span
              className="animate-bounce"
              style={{ animationDelay: "200ms" }}
            >
              .
            </span>
            <span
              className="animate-bounce"
              style={{ animationDelay: "400ms" }}
            >
              .
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Loading;
