import { signOut } from "@/lib/auth";
import { requireUser } from "@/lib/requireUser";

export default async function PharmacyDashboard() {
  const user = await requireUser("PHARMACY"); // Note: You're requiring PHARMACY role but component is named PatientDashboard

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Hello {user.name}</h1>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Log Out
        </button>
      </form>
    </div>
  );
}
