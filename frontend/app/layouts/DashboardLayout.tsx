import { Outlet } from 'react-router';
import Navbar from '~/components/Navbar';
import Sidebar from '~/components/Sidebar';

export default function DashboardLayout() {
  return (
    <div className="drawer bg-base-100 lg:drawer-open min-h-screen">
      <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side z-40">
        <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
        <Sidebar />
      </div>
      <div className="drawer-content flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-x-hidden p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
