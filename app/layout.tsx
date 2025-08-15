// app/layout.tsx
import { ToastContainer } from "react-toastify";
import Sidebar from "./components/Sidebar";
import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-hidden">
        <AuthProvider>
          <ProtectedRoute>
            <DataProvider>
              <div className="bg-gray-50 flex h-screen overflow-hidden">
                {/* Sidebar — прокручиваемая колонка */}
                <div className="h-full overflow-y-auto scrollbar-none">
                  <Sidebar />
                </div>
        
                {/* Main content — правая часть */}
                <div className="flex-1 min-h-screen overflow-y-auto p-8 scrollbar-none">
                  <ToastContainer 
                    position="top-right" 
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                  />
                  {children}
                </div>
              </div>
            </DataProvider>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}