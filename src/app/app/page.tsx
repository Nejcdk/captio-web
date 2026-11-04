import DesktopApp from "./DesktopApp";

// Signs in through the app's own Supabase (Apple or Google, like the folder
// invite page), then reads what the phone synced. Supabase's Redirect URLs
// must include https://captioai.app/app.
export default function AppPage() {
  return (
    <DesktopApp
      supabaseUrl={process.env.SUPABASE_URL ?? ""}
      anonKey={process.env.SUPABASE_ANON_KEY ?? ""}
      allowPreview={process.env.NODE_ENV === "development"}
    />
  );
}
