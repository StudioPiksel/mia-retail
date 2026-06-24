import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const KATALOG = path.join(__dirname, "../public/assets/images/katalog");

function imgs(folder: string, sub: string): string[] {
  const dir = path.join(KATALOG, folder, sub);
  if (!fs.existsSync(dir)) { console.warn(`  ⚠️  Missing: ${folder}/${sub}`); return []; }
  return fs.readdirSync(dir).filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f)).sort()
    .map(f => `/assets/images/katalog/${folder}/${sub}/${f}`);
}

async function upsert(title: string, series: string, specs: string[], folder: string, sub: string, subGroup: string, order: number, subGroupOrder: number) {
  const cat = await prisma.productCategory.findUnique({ where: { slug: "rashladne-vitrine" } });
  if (!cat) throw new Error("Category not found");
  const images = imgs(folder, sub);
  const existing = await prisma.product.findFirst({ where: { title, categoryId: cat.id } });
  if (existing) {
    await prisma.product.update({ where: { id: existing.id }, data: { images: JSON.stringify(images), series, specs: JSON.stringify(specs), order, subGroup, subGroupOrder } });
    return existing.id;
  }
  const p = await prisma.product.create({ data: { title, series, specs: JSON.stringify(specs), images: JSON.stringify(images), categoryId: cat.id, order, subGroup, subGroupOrder, published: true } });
  return p.id;
}

const PRODUCTS = [
  // G0: Vertikalne
  { t:"Vertikalna vitrina — 2 vrata", s:"Vertikalna", sp:["2 vrata","Staklo","LED"], f:"rashlada", sub:"vitrina-vertikalna-2-vrata", sg:"Vertikalne rashladne vitrine", o:0, sgo:0 },
  { t:"Vertikalna vitrina — staklena vrata", s:"Vertikalna", sp:["Staklena vrata","Uspravno","LED"], f:"rashlada", sub:"vitrina-vertikalna-staklena", sg:"Vertikalne rashladne vitrine", o:1, sgo:0 },
  { t:"Samostojeća vitrina — klizna vrata", s:"Samostojeća", sp:["Klizna vrata","Samostojeća","2 modela"], f:"rashlada", sub:"vitrina-samostojeca-klizna", sg:"Vertikalne rashladne vitrine", o:2, sgo:0 },
  { t:"Samostojeća vitrina — staklene stranice", s:"Samostojeća", sp:["Panoramsko","Staklo","Samostojeća"], f:"rashlada", sub:"vitrina-samostojeca-staklene-stranice", sg:"Vertikalne rashladne vitrine", o:3, sgo:0 },
  { t:"Rashladna vitrina — staklena vrata", s:"Vitrina", sp:["Staklena vrata","Svježe","LED"], f:"rashlada", sub:"vitrina-staklena-vrata", sg:"Vertikalne rashladne vitrine", o:4, sgo:0 },
  // G1: Poslastičarnice
  { t:"Panoramska vitrina (okrugla)", s:"Panoramska", sp:["Panoramsko","Okruglo","Torte"], f:"rashlada", sub:"vitrina-panoramska-okrugla", sg:"Vitrine za poslastičarnice", o:0, sgo:1 },
  { t:"Rotaciona panoramska vitrina", s:"Rotaciona", sp:["Rotaciono","Panoramsko","Torte"], f:"rashlada", sub:"vitrina-rotaciona-panoramska", sg:"Vitrine za poslastičarnice", o:1, sgo:1 },
  { t:"Samostojeća vitrina za torte", s:"Samostojeća", sp:["Samostojeća","Torte","Više nivoa"], f:"rashlada", sub:"vitrina-samostojeca-torte", sg:"Vitrine za poslastičarnice", o:2, sgo:1 },
  { t:"Vitrina za kolače i torte", s:"Vitrina", sp:["Kolači","Torte","Prezentacija"], f:"rashlada", sub:"vitrina-za-torte-kolace", sg:"Vitrine za poslastičarnice", o:3, sgo:1 },
  { t:"Stona vitrina za kolače i sendviče", s:"Stona", sp:["Stona","Kompaktno","Sendviči"], f:"rashlada", sub:"vitrina-stona-kolaci", sg:"Vitrine za poslastičarnice", o:4, sgo:1 },
  // G2: Mini i stone
  { t:"Mini vitrina — staklena vrata", s:"Mini", sp:["Mini","Staklo","Bijela/crna"], f:"rashlada", sub:"mini-vitrina-staklena", sg:"Mini i stone rashladne vitrine", o:0, sgo:2 },
  { t:"Mini vitrina — LED osvjetljenje", s:"Mini", sp:["Mini","LED","Bijela/crna"], f:"rashlada", sub:"mini-vitrina-led", sg:"Mini i stone rashladne vitrine", o:1, sgo:2 },
  { t:"Mini vitrina — zaobljeno staklo", s:"Mini", sp:["Mini","Zaobljeno","Dizajn"], f:"rashlada", sub:"mini-vitrina-zaobljena", sg:"Mini i stone rashladne vitrine", o:2, sgo:2 },
  { t:"Mini vitrina — inox", s:"Mini", sp:["Mini","Inox","HoReCa"], f:"rashlada", sub:"mini-vitrina-inox", sg:"Mini i stone rashladne vitrine", o:3, sgo:2 },
  { t:"Mini vitrina — premium crna", s:"Premium", sp:["Premium","Crna","Dizajn"], f:"rashlada", sub:"mini-vitrina-premium-crna", sg:"Mini i stone rashladne vitrine", o:4, sgo:2 },
  { t:"Mini vitrina za kolače i pića", s:"Mini", sp:["Mini","Kolači","Pića"], f:"rashlada", sub:"mini-vitrina-kolaci-pica", sg:"Mini i stone rashladne vitrine", o:5, sgo:2 },
  // G3: JUKA pultovi
  { t:"Modena 900", s:"JUKA", sp:["Zakrivljeno staklo","Pult","LED"], f:"juka-pultovi", sub:"modena-900", sg:"JUKA — Rashladni pultovi", o:0, sgo:3 },
  { t:"Modena 1100", s:"JUKA", sp:["Veći kapacitet","Pult","LED"], f:"juka-pultovi", sub:"modena-1100", sg:"JUKA — Rashladni pultovi", o:1, sgo:3 },
  { t:"Modena 1100 SP", s:"JUKA", sp:["SP / Modern","Pult","2 izgleda"], f:"juka-pultovi", sub:"modena-1100-sp", sg:"JUKA — Rashladni pultovi", o:2, sgo:3 },
  { t:"Hawana 1150", s:"JUKA", sp:["Staklo","Pult","Elegantno"], f:"juka-pultovi", sub:"hawana-1150", sg:"JUKA — Rashladni pultovi", o:3, sgo:3 },
  // G4: JUKA ormari
  { t:"York", s:"JUKA", sp:["Zidni regal","Multidek","LED"], f:"juka-ormari", sub:"york", sg:"JUKA — Rashladni ormari i ostrva", o:0, sgo:4 },
  { t:"Parma", s:"JUKA", sp:["Vitrina","Staklo","Svježe"], f:"juka-ormari", sub:"parma", sg:"JUKA — Rashladni ormari i ostrva", o:1, sgo:4 },
  { t:"Kobe", s:"JUKA", sp:["Otvoreni regal","Multidek","LED"], f:"juka-ormari", sub:"kobe", sg:"JUKA — Rashladni ormari i ostrva", o:2, sgo:4 },
  { t:"Malmo", s:"JUKA", sp:["Klizna vrata","Zidni","LED"], f:"juka-ormari", sub:"malmo", sg:"JUKA — Rashladni ormari i ostrva", o:3, sgo:4 },
  { t:"Ryga", s:"JUKA", sp:["Staklena vrata","Napitci","LED"], f:"juka-ormari", sub:"ryga", sg:"JUKA — Rashladni ormari i ostrva", o:4, sgo:4 },
  { t:"Toronto", s:"JUKA", sp:["Fioke","Smrznuto","Uspravno"], f:"juka-ormari", sub:"toronto", sg:"JUKA — Rashladni ormari i ostrva", o:5, sgo:4 },
  { t:"Ontario", s:"JUKA", sp:["Voće/povrće","Kose police","Regal"], f:"juka-ormari", sub:"ontario", sg:"JUKA — Rashladni ormari i ostrva", o:6, sgo:4 },
  { t:"Solo", s:"JUKA", sp:["Samostojeće","Ostrvo","LED"], f:"juka-ormari", sub:"solo", sg:"JUKA — Rashladni ormari i ostrva", o:7, sgo:4 },
  { t:"Wels", s:"JUKA", sp:["Staklena vrata","Regal","LED"], f:"juka-ormari", sub:"wels", sg:"JUKA — Rashladni ormari i ostrva", o:8, sgo:4 },
  { t:"Piccoli", s:"JUKA", sp:["Kompaktno","Otvoreni","Multidek"], f:"juka-ormari", sub:"piccoli", sg:"JUKA — Rashladni ormari i ostrva", o:9, sgo:4 },
  { t:"Mini Varna", s:"JUKA", sp:["Kompaktno","Zidni","LED"], f:"juka-ormari", sub:"mini-varna", sg:"JUKA — Rashladni ormari i ostrva", o:10, sgo:4 },
  { t:"Ostrvo za sir", s:"JUKA", sp:["Ostrvo","Okruglo","Delikatese"], f:"juka-ormari", sub:"ostrvo-za-sir", sg:"JUKA — Rashladni ormari i ostrva", o:11, sgo:4 },
  { t:"Ormar za sladoled", s:"JUKA", sp:["Sladoled","Staklena vrata","Uspravno"], f:"juka-ormari", sub:"ice-cream-cabinet", sg:"JUKA — Rashladni ormari i ostrva", o:12, sgo:4 },
  // G5: JUKA kolaci
  { t:"Bellissima", s:"JUKA", sp:["Zakrivljeno","Torte","3 izvedbe"], f:"juka-kolaci", sub:"bellissima", sg:"JUKA — Vitrine za kolače i poslastice", o:0, sgo:5 },
  { t:"Lumina", s:"JUKA", sp:["Ravno staklo","Torte","Mini"], f:"juka-kolaci", sub:"lumina", sg:"JUKA — Vitrine za kolače i poslastice", o:1, sgo:5 },
  { t:"Vienna", s:"JUKA", sp:["Otvorena","Kolači","LED"], f:"juka-kolaci", sub:"vienna", sg:"JUKA — Vitrine za kolače i poslastice", o:2, sgo:5 },
  { t:"Delice", s:"JUKA", sp:["Zatvorena/Open","Kolači","LED"], f:"juka-kolaci", sub:"delice", sg:"JUKA — Vitrine za kolače i poslastice", o:3, sgo:5 },
  { t:"Capri", s:"JUKA", sp:["Kompaktno","Torte","Staklo"], f:"juka-kolaci", sub:"capri", sg:"JUKA — Vitrine za kolače i poslastice", o:4, sgo:5 },
  { t:"Carmella", s:"JUKA", sp:["Zakrivljeno","Više nivoa","Torte"], f:"juka-kolaci", sub:"carmella", sg:"JUKA — Vitrine za kolače i poslastice", o:5, sgo:5 },
  { t:"Magnum Kolači", s:"JUKA", sp:["Veliko","Torte","LED"], f:"juka-kolaci", sub:"magnum", sg:"JUKA — Vitrine za kolače i poslastice", o:6, sgo:5 },
  { t:"Dolce", s:"JUKA", sp:["Kolači","Torte","LED"], f:"juka-kolaci", sub:"dolce", sg:"JUKA — Vitrine za kolače i poslastice", o:7, sgo:5 },
  { t:"Rafaello", s:"JUKA", sp:["3 izvedbe","Kolači","LED"], f:"juka-kolaci", sub:"rafaello", sg:"JUKA — Vitrine za kolače i poslastice", o:8, sgo:5 },
  { t:"Tosti", s:"JUKA", sp:["Open","Grab&go","Sendviči"], f:"juka-kolaci", sub:"tosti", sg:"JUKA — Vitrine za kolače i poslastice", o:9, sgo:5 },
  { t:"Velvet Nevado", s:"JUKA", sp:["Pultna","Dizajn","Kolači"], f:"juka-kolaci", sub:"velvet-nevado", sg:"JUKA — Vitrine za kolače i poslastice", o:10, sgo:5 },
  // G6: JUKA sladoled
  { t:"Calipso", s:"JUKA", sp:["Konzervator","Kadice","Sladoled"], f:"juka-sladoled", sub:"calipso", sg:"JUKA — Vitrine i konzervatori za sladoled", o:0, sgo:6 },
  { t:"Cornetti", s:"JUKA", sp:["Podizno staklo","Kadice","Sladoled"], f:"juka-sladoled", sub:"cornetti", sg:"JUKA — Vitrine i konzervatori za sladoled", o:1, sgo:6 },
  { t:"Sorento", s:"JUKA", sp:["Zakrivljeno","Zanatski","Sladoled"], f:"juka-sladoled", sub:"sorento", sg:"JUKA — Vitrine i konzervatori za sladoled", o:2, sgo:6 },
  { t:"Magnum Sladoled", s:"JUKA", sp:["Veliko","Zanatski","LED"], f:"juka-sladoled", sub:"magnum-ice", sg:"JUKA — Vitrine i konzervatori za sladoled", o:3, sgo:6 },
  { t:"Velvet Ice", s:"JUKA", sp:["Dizajn","Kadice","Sladoled"], f:"juka-sladoled", sub:"velvet-ice", sg:"JUKA — Vitrine i konzervatori za sladoled", o:4, sgo:6 },
  { t:"Candy", s:"JUKA", sp:["Zaobljeno","Kadice","Sladoled"], f:"juka-sladoled", sub:"candy-ice", sg:"JUKA — Vitrine i konzervatori za sladoled", o:5, sgo:6 },
  { t:"Paradiso", s:"JUKA", sp:["Kadice","Dizajn","Sladoled"], f:"juka-sladoled", sub:"paradiso-ice", sg:"JUKA — Vitrine i konzervatori za sladoled", o:6, sgo:6 },
  { t:"Dolce Ice", s:"JUKA", sp:["Konzervator","Kadice","Sladoled"], f:"juka-sladoled", sub:"dolce-ice", sg:"JUKA — Vitrine i konzervatori za sladoled", o:7, sgo:6 },
  { t:"Rafaello Ice", s:"JUKA", sp:["Zanatski","Kadice","Sladoled"], f:"juka-sladoled", sub:"rafaello-ice", sg:"JUKA — Vitrine i konzervatori za sladoled", o:8, sgo:6 },
  { t:"Biscotti", s:"JUKA", sp:["Podizno staklo","Pult","Sladoled"], f:"juka-sladoled", sub:"biscotti", sg:"JUKA — Vitrine i konzervatori za sladoled", o:9, sgo:6 },
  { t:"Bambi", s:"JUKA", sp:["Kompaktno","Grafika","Sladoled"], f:"juka-sladoled", sub:"bambi", sg:"JUKA — Vitrine i konzervatori za sladoled", o:10, sgo:6 },
  { t:"Riksha", s:"JUKA", sp:["Mobilno","Kolica","Event"], f:"juka-sladoled", sub:"riksha", sg:"JUKA — Vitrine i konzervatori za sladoled", o:11, sgo:6 },
  { t:"Malaga", s:"JUKA", sp:["Kompaktno","Kadice","Sladoled"], f:"juka-sladoled", sub:"malaga", sg:"JUKA — Vitrine i konzervatori za sladoled", o:12, sgo:6 },
];

async function main() {
  // Delete old products without subGroup in this category
  const cat = await prisma.productCategory.findUnique({ where: { slug: "rashladne-vitrine" } });
  if (!cat) throw new Error("Category not found");
  const del = await prisma.product.deleteMany({ where: { categoryId: cat.id, subGroup: null } });
  console.log(`Deleted ${del.count} old products`);

  for (const p of PRODUCTS) {
    await upsert(p.t, p.s, p.sp, p.f, p.sub, p.sg, p.o, p.sgo);
  }
  console.log(`✅ Seeded ${PRODUCTS.length} rashladne vitrine products`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
