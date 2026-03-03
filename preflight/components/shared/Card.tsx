export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`card border border-app p-6 ${className}`}>{children}</div>
  );
}
