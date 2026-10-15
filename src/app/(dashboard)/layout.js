import AuthGuard from "@/components/dashboard/layout/AuthGuard";
import Footer from "@/components/dashboard/layout/Footer";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import TopBar from "@/components/dashboard/layout/TopBar";

export default function DashboardLayout({ children }) {
  return (
    <html
      lang="en"
      data-layout="vertical"
      data-topbar="light"
      data-sidebar="dark"
      data-sidebar-size="lg"
      data-sidebar-image="none"
      data-preloader="disable"
      data-theme="default"
      data-theme-colors="default"
    >
      <head>
        {/* Keep this order, same as the template */}
        <link
          href="/dashboard/assets/css/bootstrap.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="/dashboard/assets/css/icons.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="/dashboard/assets/css/app.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="/dashboard/assets/css/custom.min.css"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body>
        <AuthGuard>
          <div id="layout-wrapper">
            <TopBar />
            <Sidebar />

            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">{children}</div>
              </div>
              <Footer />
            </div>
          </div>
        </AuthGuard>
      </body>
    </html>
  );
}
