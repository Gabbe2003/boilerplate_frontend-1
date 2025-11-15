import Footer from "@/components/Footer/Footer";
import Header from "../components/Header/Header";
import "../styles/globals.css";


export default function RootLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body>
        <div className="w-full flex flex-col items-center">   
          <Header />
            {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
