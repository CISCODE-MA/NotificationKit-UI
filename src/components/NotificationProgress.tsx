export function NotificationProgress({
  remaining,
  duration,
}: {
  remaining: number;
  duration: number;
}) {
  const percentage = Math.max(0, Math.min(100, (remaining / duration) * 100));

  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
      <div
        className="h-full bg-black/20 transition-[width] duration-200 dark:bg-white/40"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
