import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header/Header";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { Toaster } from "react-hot-toast";

import "./globals.css";

export const metadata = {
  title: "Headless Store",
  description: "Modern headless ecommerce frontend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        <CartProvider>
          <WishlistProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            
            {/* Toast Notifications */}
            <Toaster 
              position="bottom-center"
              reverseOrder={false}
              toastOptions={{
                duration: 2500,
                style: {
                  background: '#1a1a1a',
                  color: '#fff',
                  padding: '12px 20px',
                  borderRadius: '50px',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                  minWidth: '250px',
                  textAlign: 'center',
                },
                success: {
                  style: {
                    background: '#000',
                  },
                },
                error: {
                  style: {
                    background: '#dc2626',
                  },
                },
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}