import FloatingBar from "@/components/floating-bar";

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <FloatingBar />
    </>
  );
}
