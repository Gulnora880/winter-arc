import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Snow } from "./Snow";

export function Layout() {
  return (
    <div className="min-h-screen relative">
      <Snow />
      <div className="flex relative z-10">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
