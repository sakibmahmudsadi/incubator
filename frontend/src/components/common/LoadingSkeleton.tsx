interface LoadingSkeletonProps {
  className?: string;
}

export default function LoadingSkeleton({ className = "" }: LoadingSkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-white/[0.07] shadow-inner shadow-white/5 ${className}`}
      aria-hidden="true"
    />
  );
}
