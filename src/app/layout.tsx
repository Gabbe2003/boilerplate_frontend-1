import Footer from "@/components/Footer/Footer";
import Header from "../components/Header/Header";
import "../styles/globals.css";


export default function RootLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="flex justify-center items-center">
        <div>   
          <Header />
            {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
