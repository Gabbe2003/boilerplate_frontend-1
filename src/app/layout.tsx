import Footer from "@/components/Footer/Footer";
import Header from "../components/Header/Header";
import "../styles/globals.css";


export default function RootLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="flex justify-center items-center">
        <div className="w-[70%]"> {/* This div controls the width, padding, margin at root-level */}
          <Header />
            {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
