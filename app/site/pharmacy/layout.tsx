import PageHeader from "../components/header";
import PharmacySidebar from "../components/pharmacy/pharmacy-sidebar";

export default function PharmacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <PharmacySidebar />
      <div className="flex-1 flex flex-col">
        <PageHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
