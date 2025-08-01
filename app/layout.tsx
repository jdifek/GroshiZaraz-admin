// app/layout.tsx
import { ToastContainer } from "react-toastify";
import Modal from "./components/Modal";
import Sidebar from "./components/Sidebar";
import { DataProvider } from "./context/DataContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DataProvider>
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="flex-1 p-8">{children}</div>
            <Modal />
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
