import PageHeader from "../components/header";
import PageFooter from "../components/footer";
import Sidebar from "../components/patient/patient-sidebar";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <PageHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
      <PageFooter />
    </div>
  );
}
