import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    slug: "kako-opremiti-supermarket-vodic",
    content: `<p class="article-lead">Otvaranje ili renoviranje supermarketa je kompleksan proces u kojem svaka odluka utiče na krajnji rezultat — prodaju i zadovoljstvo kupaca. U ovom vodiču prolazimo kroz ključne faze opremanja, od prvog tlocrta do otvaranja vrata.</p>

<h2>1. Tlocrt i tok kupaca (Store Layout)</h2>
<p>Sve počinje sa tlocrtom. Cilj je stvoriti logičan tok kupaca (tzv. <em>customer flow</em>) koji maksimizira izloženost proizvodima, ali ne stvara gužve i frustraciju. Najčešći modeli su <strong>Grid layout</strong> (mreža) za efikasnost i <strong>Free-flow layout</strong> za specijalizovane zone.</p>
<ul>
  <li><strong>Zlatni trougao:</strong> Kupci prirodno skreću desno pri ulasku. Tu smjestite proizvode sa visokom maržom (npr. svježe voće i povrće).</li>
  <li><strong>Osnovne namirnice:</strong> Hljeb, mlijeko i meso smjestite u zadnji dio objekta kako bi kupci prošli kroz cijeli asortiman.</li>
  <li><strong>Širina prolaza:</strong> Minimalna širina za mimoilaženje dvoje kolica je 1.6m do 1.8m.</li>
</ul>

<blockquote>Dobar tlocrt nije samo estetski lijep — on je nevidljivi prodavac koji vodi kupca kroz cijeli vaš asortiman.</blockquote>

<h2>2. Rashladni sistemi — srce supermarketa</h2>
<p>Rashladna oprema je najveća investicija i najveći potrošač energije. Pravilan izbor vitrina i komora je presudan za kvalitet namirnica i isplativost objekta.</p>
<p><strong>Otvorene vs Zatvorene vitrine:</strong> Iako otvorene vitrine olakšavaju impulsivnu kupovinu, vitrine sa staklenim vratima smanjuju potrošnju energije i do 40%. Danas su standard za mliječne proizvode i pakovano meso.</p>

<h2>3. Polični sistemi i izlaganje</h2>
<p>Polični sistemi (gondole) moraju biti modularni i izdržljivi. Nosivost polica zavisi od asortimana — pića zahtijevaju ojačane police, dok su za grickalice dovoljne standardne.</p>
<ul>
  <li><strong>Pusheri i separatori:</strong> Održavaju police urednim i automatski pomjeraju proizvode naprijed.</li>
  <li><strong>Cjenovne šine i ESL:</strong> Elektronske cijene (ESL) smanjuju greške i štede vrijeme zaposlenih.</li>
</ul>

<h2>4. Checkout zona — posljednji utisak</h2>
<p>Kasa je mjesto gdje se formira posljednji utisak o vašem objektu. Dugi redovi su najčešći razlog zašto se kupci ne vraćaju.</p>
<p>Kombinacija klasičnih kasa (sa trakom) za velike kupovine i <strong>Self-checkout kasa</strong> za brze kupovine (do 10 artikala) pokazala se kao najefikasniji model za supermarkete preko 400m².</p>`,
  },
  {
    slug: "hladni-lanac-mesnica-ribarnica",
    content: `<p class="article-lead">Opremanje mesnice i ribarnice nosi specifične izazove koji se ne sreću u standardnoj maloprodaji. Očuvanje hladnog lanca, higijena i otpornost na koroziju su apsolutni prioriteti.</p>

<h2>Temperaturni režimi i tipovi hlađenja</h2>
<p>Svježe meso i riba zahtijevaju preciznu kontrolu temperature. Za razliku od pakovanih proizvoda, ovdje je vlažnost vazduha jednako važna kao i temperatura.</p>
<ul>
  <li><strong>Statičko hlađenje:</strong> Idealno za svježe meso jer ne isuši&shy;uje proizvod. Hladan vazduh prirodno pada na meso, čuvajući njegovu boju i težinu.</li>
  <li><strong>Ventilirano hlađenje sa kontrolom vlage:</strong> Koristi se u modernim vitrinama, ali zahtijeva pažljivo podešavanje kako bi se izbjeglo isušivanje.</li>
</ul>

<h2>AISI 316 — Standard za ribarnice</h2>
<p>So i vlaga u ribarnicama su izuzetno agresivni prema opremi. Standardni inox (AISI 304) može vremenom pokazati znakove korozije u ovakvim uslovima.</p>
<blockquote>Za ribarnice je obavezna upotreba AISI 316 nerđajućeg čelika (tzv. kiselootporni inox) koji sadrži molibden i pruža maksimalnu zaštitu od soli i kiselina.</blockquote>

<h2>Radne površine i komore</h2>
<p>Pored izložbenih vitrina, pozadinski dio (priprema) je ključan. Radni stolovi, panjevi i sudopere moraju biti dizajnirani bez oštrih uglova (sa zaobljenim ivicama) radi lakšeg čišćenja i održavanja HACCP standarda.</p>
<p>Hladne komore za odlaganje mesa moraju imati adekvatan kapacitet hlađenja koji može brzo oboriti temperaturu svježe dopremljene robe.</p>`,
  },
];

async function main() {
  for (const post of posts) {
    await prisma.blogPost.update({
      where: { slug: post.slug },
      data: { content: post.content },
    });
    console.log(`✅ Updated: ${post.slug}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
