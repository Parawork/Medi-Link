import Sidebar from "../components/patient/patient-sidebar";
import PageHeader from "../components/header";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* <Header /> */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <PageHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
