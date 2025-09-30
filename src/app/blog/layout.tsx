export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto max-w-6xl px-4 pt-18 pb-8">
      {children}
    </div>
  );
}
