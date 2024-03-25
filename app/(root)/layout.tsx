import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Script src="//code.tidio.co/9pxzmbvbk5i0rc12uenspxpze6jebbet.js" >
      </Script>

      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-7P8L3DE44X"></Script>
      <Script>
        {
          `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-7P8L3DE44X');
         `
        }

      </Script>
      <Footer />
    </div>
  );
}
