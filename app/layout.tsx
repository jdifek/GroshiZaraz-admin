// app/layout.tsx
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
            <div className="flex-1 p-8">{children}</div>
            <Modal />
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
