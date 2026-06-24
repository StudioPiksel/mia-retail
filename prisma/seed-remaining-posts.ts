import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    slug: "self-checkout-kada-se-isplati",
    title: "Self-checkout i moderna zona naplate: kada se isplati",
    excerpt: "Samouslužne kase (self-checkout) smanjuju redove i ubrzavaju naplatu. Analiziramo kada se isplate, kako ih kombinovati sa klasičnim kasama i šta donose.",
    category: "Trendovi",
    thumbnail: "/assets/images/blog/blog-self-checkout.jpg",
    content: `<p class="article-lead">Samouslužne kase (Self-checkout - SCO) više nisu ekskluzivitet velikih lanaca. Sa padom cijena tehnologije i promjenom navika kupaca, SCO postaje standard i u manjim formatima.</p>

<h2>Zašto uvesti Self-checkout?</h2>
<p>Glavni benefiti uvođenja SCO sistema su:</p>
<ul>
  <li><strong>Smanjenje redova:</strong> Na prostor jedne klasične kase mogu se postaviti 2 do 3 samouslužne kase.</li>
  <li><strong>Optimizacija radne snage:</strong> Jedan zaposleni može nadgledati 4 do 6 SCO kasa, oslobađajući osoblje za rad na policama ili usluživanje kupaca.</li>
  <li><strong>Zadovoljstvo mlađih kupaca:</strong> Generacije Y i Z preferiraju brzu, beskontaktnu kupovinu bez interakcije.</li>
</ul>

<h2>Kada se SCO zaista isplati?</h2>
<p>Iako donosi mnoge prednosti, SCO nije rješenje za svaki objekat. Najveći povrat investicije (ROI) pokazuje se u objektima gdje:</p>
<ul>
  <li>Preko 40% transakcija čine male kupovine (do 10 artikala).</li>
  <li>Postoje jasni "špicevi" u toku dana (npr. pauza za ručak, kraj radnog vremena) kada se stvaraju usko grla.</li>
  <li>Je dominantno bezgotovinsko plaćanje (Card-only SCO kase su značajno jeftinije i lakše za održavanje od onih sa gotovinom).</li>
</ul>

<blockquote>Uvođenje SCO sistema ne znači ukidanje klasičnih kasa. Najbolji rezultati se postižu hibridnim modelom: klasične kase za velike nedjeljne kupovine i SCO zona za brze, dnevne kupovine.</blockquote>`,
  },
  {
    slug: "staticko-vs-ventilirano-hladjenje",
    title: "Statičko vs ventilirano hlađenje: kako izabrati pravi frižider",
    excerpt: "Detaljno objašnjenje razlike između statičkog i ventiliranog (dinamičkog) hlađenja u komercijalnim frižiderima i vitrinama. Šta izabrati za meso, a šta za piće?",
    category: "Vodiči",
    thumbnail: "/assets/images/blog/blog-cooling-tech.jpg",
    content: `<p class="article-lead">Jedno od najčešćih pitanja pri opremanju maloprodajnih i HoReCa objekata je izbor tipa hlađenja. Pogrešan izbor može dovesti do kvarenja robe, isušivanja proizvoda ili visoke potrošnje energije.</p>

<h2>Statičko hlađenje</h2>
<p>Statičko hlađenje radi na principu prirodne cirkulacije vazduha — hladan vazduh je teži i pada na dno, dok se topliji diže prema isparivaču. U ovim uređajima ne postoji ventilator koji miješa vazduh.</p>
<p><strong>Prednosti:</strong> Ne isušuje proizvode. Idealno je za svježe meso, svježu ribu, sireve i nepakovane delikatese.<br />
<strong>Mane:</strong> Neravnomjerna temperatura (na dnu je hladnije nego na vrhu) i sporije obaranje temperature nakon otvaranja vrata.</p>

<h2>Ventilirano (dinamičko) hlađenje</h2>
<p>Ventilirano hlađenje koristi ventilatore koji konstantno miješaju hladan vazduh unutar uređaja, osiguravajući istu temperaturu u svakom uglu.</p>
<p><strong>Prednosti:</strong> Brzo hlađenje i ravnomjerna temperatura. Idealno za pića, pakovane proizvode, mliječne proizvode u ambalaži i slastice.<br />
<strong>Mane:</strong> Može isušiti nepakovane proizvode ako nisu adekvatno zaštićeni.</p>

<blockquote>Pravilo palca: Ako proizvod nije pakovan i osjetljiv je na isušivanje (meso, riba) — birajte statičko hlađenje. Za sve pakovano i za pića — ventilirano hlađenje je efikasnije.</blockquote>

<h2>Hibridna rješenja</h2>
<p>Moderni proizvođači često nude hibridna rješenja — vitrine sa blagom ventilacijom i kontrolom vlažnosti (tzv. <em>semi-ventilated</em>), koje kombinuju najbolje od oba svijeta. Konsultujte se sa stručnjacima prije finalne odluke.</p>`,
  },
];

async function main() {
  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: { ...post, published: true, publishedAt: new Date() },
    });
    console.log(`✅ ${post.slug}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
