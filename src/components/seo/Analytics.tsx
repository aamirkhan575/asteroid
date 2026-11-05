import Script from "next/script";

/**
 * Google Analytics 4 — only rendered when NEXT_PUBLIC_GA_ID is set.
 * Loaded after the page is interactive so it never hurts Core Web Vitals.
 */
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href')||'';
var ev=h.indexOf('wa.me')>-1?'whatsapp_click':h.indexOf('tel:')===0?'phone_click':h.indexOf('mailto:')===0?'email_click':null;if(ev)gtag('event',ev,{link_url:h});});`}
      </Script>
    </>
  );
}
