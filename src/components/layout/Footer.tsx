import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="site-footer" id="kontakt">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image src="/assets/images/logo/mia-retail-solutions-vectorized-clean.svg" alt="MIA Retail Solutions" className="footer-logo" width={160} height={40} />
            <p>Partner za opremanje maloprodajnih i HoReCa objekata na ključ. Projektujemo, isporučujemo i montiramo — na rok i bez kompromisa.</p>
          </div>
          <div className="footer-nav">
            <h5>Rješenja</h5>
            <ul>
              <li><Link href="/rjesenja/supermarketi">Supermarketi & Maloprodaja</Link></li>
              <li><Link href="/rjesenja/mesnice-ribarnice">Mesnice & Ribarnice</Link></li>
              <li><Link href="/rjesenja/horeca">HoReCa & Ugostiteljstvo</Link></li>
              <li><Link href="/rjesenja/pekare">Pekare & Poslastičarnice</Link></li>
              <li><Link href="/rjesenja/apoteke-drogerije">Apoteke & Drogerije</Link></li>
            </ul>
          </div>
          <div className="footer-nav">
            <h5>Kompanija</h5>
            <ul>
              <li><Link href="/o-nama">O nama</Link></li>
              <li><Link href="/realizacije">Realizacije</Link></li>
              <li><Link href="/dizajn-enterijera">Dizajn enterijera</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/kontakt">Kontakt</Link></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h5>Kontakt</h5>
            <p>Cetinjski put bb<br />81000 Podgorica, Crna Gora</p>
            <p><a href="tel:+38267038777">+382 67 038 777</a></p>
            <p><a href="mailto:info@miaretailsolutions.com">info@miaretailsolutions.com</a></p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} MIA Retail Solutions. Sva prava zadržana.</p>
        </div>
      </div>
    </footer>
  );
}
