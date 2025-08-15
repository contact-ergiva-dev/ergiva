import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Additional fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        
        {/* Tawk.to Live Chat - Optional (Disabled for now to prevent errors) */}
        {/* Uncomment and add NEXT_PUBLIC_TAWK_TO_ID to .env.local to enable */}
        {false && process.env.NEXT_PUBLIC_TAWK_TO_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/${process.env.NEXT_PUBLIC_TAWK_TO_ID}/default';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
                })();
              `,
            }}
          />
        )}

        {/* Google Analytics - Add your GA4 measurement ID */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}

        {/* Structured Data for Healthcare Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalOrganization",
              "name": "Ergiva",
              "description": "Professional physiotherapy services at your home in Delhi NCR",
              "url": "https://ergiva.com",
              "logo": "https://ergiva.com/images/logo.png",
              "telephone": "+91-92112-15116",
              "email": "support@ergiva.com",
              "address": {
                "@type": "PostalAddress",
                "addressRegion": "Delhi NCR",
                "addressCountry": "IN"
              },
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 28.6139,
                  "longitude": 77.2090
                },
                "geoRadius": "50000"
              },
              "medicalSpecialty": "Physiotherapy",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Physiotherapy Services and Products",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "MedicalProcedure",
                      "name": "Home Physiotherapy"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "TENS Machines"
                    }
                  }
                ]
              },
              "openingHours": "Mo-Su 09:00-21:00",
              "sameAs": [
                "https://www.facebook.com/ergiva",
                "https://www.instagram.com/ergiva",
                "https://www.linkedin.com/company/ergiva"
              ]
            }),
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
        
        {/* WhatsApp Widget */}
        <div id="whatsapp-widget" />
      </body>
    </Html>
  );
}