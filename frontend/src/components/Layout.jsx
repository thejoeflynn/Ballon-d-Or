import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

export default function Layout() {
  return (
    <>
      <a href="#app-main" className="skip-link">Skip to main content</a>
      <div className="app-shell">
        <Sidebar />
        <main id="app-main" className="app-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}
