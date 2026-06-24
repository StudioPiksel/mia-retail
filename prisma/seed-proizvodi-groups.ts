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

async function upsert(title: string, series: string, specs: string[], folder: string, sub: string, catSlug: string, subGroup: string, order: number, subGroupOrder: number) {
  const cat = await prisma.productCategory.findUnique({ where: { slug: catSlug } });
  if (!cat) { console.warn(`Cat not found: ${catSlug}`); return ""; }
  const images = imgs(folder, sub);
  const existing = await prisma.product.findFirst({ where: { title, categoryId: cat.id } });
  if (existing) {
    await prisma.product.update({ where: { id: existing.id }, data: { images: JSON.stringify(images), series, specs: JSON.stringify(specs), order, subGroup, subGroupOrder } });
    return existing.id;
  }
  const p = await prisma.product.create({ data: { title, series, specs: JSON.stringify(specs), images: JSON.stringify(images), categoryId: cat.id, order, subGroup, subGroupOrder, published: true } });
  return p.id;
}

async function main() {
  console.log("🌱 Seeding product groups...\n");

  // ── INOX KUHINJA ──────────────────────────────────────────────────
  console.log("📁 Inox kuhinja");
  const inox = [
    // G1: Inox oprema za radni prostor
    { t:"Inox radni stolovi i pultovi", s:"Radni prostor", sp:["AISI 316","Po mjeri","Higijenski"], f:"inox", sub:"radni-stolovi", sg:"Inox oprema za radni prostor", o:0, sgo:0 },
    { t:"Sudopere i umivaonici", s:"Higijena", sp:["Sudopere","Umivaonici","Higijena"], f:"inox", sub:"sudopere", sg:"Inox oprema za radni prostor", o:1, sgo:0 },
    { t:"Inox police", s:"Skladištenje", sp:["Police","Inox","Skladište"], f:"inox", sub:"police-inox", sg:"Inox oprema za radni prostor", o:2, sgo:0 },
    { t:"Nape i ventilacija", s:"Ventilacija", sp:["Filteri","AISI 304","Po mjeri"], f:"inox", sub:"nape", sg:"Inox oprema za radni prostor", o:3, sgo:0 },
    { t:"Zidni ormarići i elementi", s:"Zidni", sp:["Zidno","Inox","Higijenski"], f:"inox", sub:"zidni-ormarici", sg:"Inox oprema za radni prostor", o:4, sgo:0 },
    { t:"Kante za otpad", s:"Otpad", sp:["Higijenski","Pedalna","Inox"], f:"inox", sub:"kante-otpad", sg:"Inox oprema za radni prostor", o:5, sgo:0 },
    { t:"Kolica za serviranje", s:"Serviranje", sp:["Mobilno","Inox","Serviranje"], f:"inox", sub:"kolica-serviranje", sg:"Inox oprema za radni prostor", o:6, sgo:0 },
    { t:"Inox oprema po mjeri", s:"Custom", sp:["Custom","AISI 316","Po narudžbi"], f:"inox", sub:"inox-po-mjeri", sg:"Inox oprema za radni prostor", o:7, sgo:0 },
    { t:"Panjevi za meso", s:"Meso", sp:["Drveni","Polietilen","HACCP"], f:"inox", sub:"panj-meso", sg:"Inox oprema za radni prostor", o:8, sgo:0 },
    // G2: Termička oprema
    { t:"Konvekcijske rerne", s:"Rerne", sp:["Konvekcija","Gas/Struja","Programabilno"], f:"inox", sub:"konvekcijska-rerna", sg:"Termička oprema i peći", o:0, sgo:1 },
    { t:"Kombi rerne", s:"Rerne", sp:["Paro-konvekcija","HACCP","Programabilno"], f:"inox", sub:"combi-rerna", sg:"Termička oprema i peći", o:1, sgo:1 },
    { t:"Pizza peći", s:"Pizza", sp:["Pizza","Kamen","Profesionalno"], f:"inox", sub:"pizza-pec", sg:"Termička oprema i peći", o:2, sgo:1 },
    { t:"Mini pizza peć", s:"Mini Pizza", sp:["Kompaktno","Pizza","Brzo"], f:"inox", sub:"mini-pizza-pec", sg:"Termička oprema i peći", o:3, sgo:1 },
    { t:"Električne friteze", s:"Friteza", sp:["Termička","Struja","Profesionalno"], f:"inox", sub:"friteza", sg:"Termička oprema i peći", o:4, sgo:1 },
    { t:"Roštilji i grilovi", s:"Gril", sp:["Gas/Struja","Gril","Roštilj"], f:"inox", sub:"rostilj-gril", sg:"Termička oprema i peći", o:5, sgo:1 },
    { t:"Roštilj na ćumur", s:"Ćumur", sp:["Ćumur","Roštilj na ćumur","Gas"], f:"inox", sub:"rostilj-cumur", sg:"Termička oprema i peći", o:6, sgo:1 },
    { t:"Bain-marie", s:"Bain-marie", sp:["Topla linija","Voda","Posude GN"], f:"inox", sub:"bain-marie", sg:"Termička oprema i peći", o:7, sgo:1 },
    { t:"Hot dog aparati", s:"Hot Dog", sp:["Hot Dog","Kobasice","Rotaciono"], f:"inox", sub:"hot-dog", sg:"Termička oprema i peći", o:8, sgo:1 },
    { t:"Toasteri", s:"Toaster", sp:["Tost","Kompaktno","Brzo"], f:"inox", sub:"toaster", sg:"Termička oprema i peći", o:9, sgo:1 },
    { t:"Vok ploče", s:"Vok", sp:["Vok","Gas","Profesionalno"], f:"inox", sub:"vok-ploca", sg:"Termička oprema i peći", o:10, sgo:1 },
    { t:"Mikrotalasne peći", s:"Mikro", sp:["Mikrotalasna","Brzo","Profesionalno"], f:"inox", sub:"mikrotalasna", sg:"Termička oprema i peći", o:11, sgo:1 },
    { t:"Brze rerne", s:"Brza rerna", sp:["Brza","Kompaktno","Svestrano"], f:"inox", sub:"brza-rerna", sg:"Termička oprema i peći", o:12, sgo:1 },
    { t:"Pizza pekači", s:"Pekač", sp:["Pizza","Aluminij","Čelik"], f:"inox", sub:"pizza-pekaci", sg:"Termička oprema i peći", o:13, sgo:1 },
    { t:"Sprave za pljeskavice", s:"Pljeskavica", sp:["Pljeskavica","Profesionalno","Inox"], f:"inox", sub:"sprava-pljeskavice", sg:"Termička oprema i peći", o:14, sgo:1 },
    // G3: Priprema
    { t:"Mesoreznice", s:"Rezanje", sp:["Rezač","Inox","Profesionalno"], f:"inox", sub:"mesoreznica", sg:"Priprema mesa, povrća i tijesta", o:0, sgo:2 },
    { t:"Mlinovi za meso", s:"Mlin", sp:["Mljevenje","Inox","Profesionalno"], f:"inox", sub:"mlin-meso", sg:"Priprema mesa, povrća i tijesta", o:1, sgo:2 },
    { t:"Mješalice za tijesto", s:"Mješalica", sp:["Tijesto","Spiralna","Profesionalno"], f:"inox", sub:"mjesalica-tijesto", sg:"Priprema mesa, povrća i tijesta", o:2, sgo:2 },
    { t:"Kuhinjski i štapni mikseri", s:"Mikser", sp:["Miješanje","Blender","Profesionalno"], f:"inox", sub:"kuhinjski-mikser", sg:"Priprema mesa, povrća i tijesta", o:3, sgo:2 },
    { t:"Rezači povrća", s:"Rezač", sp:["Povrće","Brzo","Profesionalno"], f:"inox", sub:"rezac-povrce", sg:"Priprema mesa, povrća i tijesta", o:4, sgo:2 },
    { t:"Ljuštioci krompira", s:"Ljuštioc", sp:["Krompir","Inox","Profesionalno"], f:"inox", sub:"ljustilica-krompir", sg:"Priprema mesa, povrća i tijesta", o:5, sgo:2 },
    { t:"Robot Coupe procesori", s:"Robot Coupe", sp:["Food processor","Profesionalno","Multifunkcija"], f:"inox", sub:"robot-coupe", sg:"Priprema mesa, povrća i tijesta", o:6, sgo:2 },
    { t:"Vakuum aparati", s:"Vakuum", sp:["Vakuum","Pakovanje","Svježe"], f:"inox", sub:"vakuum-aparat", sg:"Priprema mesa, povrća i tijesta", o:7, sgo:2 },
    { t:"Blenderi i sokovnici", s:"Blender", sp:["Blender","Sok","Profesionalno"], f:"inox", sub:"blender", sg:"Priprema mesa, povrća i tijesta", o:8, sgo:2 },
    { t:"Sokovnici", s:"Sokovnik", sp:["Cijeđenje","Svježe","Brzo"], f:"inox", sub:"sokovnik", sg:"Priprema mesa, povrća i tijesta", o:9, sgo:2 },
    { t:"Sous Vide aparati", s:"Sous Vide", sp:["Sous Vide","Precizno","Profesionalno"], f:"inox", sub:"sous-vide", sg:"Priprema mesa, povrća i tijesta", o:10, sgo:2 },
    // G4: Kafa
    { t:"Espresso aparati", s:"Kafa", sp:["Espresso","Profesionalno","Kapučino"], f:"inox", sub:"espresso-aparat", sg:"Aparati za kafu i napitke", o:0, sgo:3 },
    { t:"Automatski aparati za kafu", s:"Kafa", sp:["Automatski","Kafa","Touchscreen"], f:"inox", sub:"automatski-aparat-kafu", sg:"Aparati za kafu i napitke", o:1, sgo:3 },
    { t:"Mlinovi za kafu", s:"Mlin kafu", sp:["Mljevenje","Kafa","Svježe"], f:"inox", sub:"mlin-kafu", sg:"Aparati za kafu i napitke", o:2, sgo:3 },
    { t:"Aparati za mlijeko i napitke", s:"Mlijeko", sp:["Mlijeko","Napitak","Toplo"], f:"inox", sub:"uredjaj-mlijeko", sg:"Aparati za kafu i napitke", o:3, sgo:3 },
    { t:"Dispenzeri za napitke", s:"Dispenser", sp:["Piće","Voda","Sok"], f:"inox", sub:"dispenzeri", sg:"Aparati za kafu i napitke", o:4, sgo:3 },
    { t:"Aparati za vafle", s:"Vafli", sp:["Vafli","Krhko","Profesionalno"], f:"inox", sub:"aparat-vafle", sg:"Aparati za kafu i napitke", o:5, sgo:3 },
    // G5: Pranje
    { t:"Mašine za pranje posuđa", s:"Dishwasher", sp:["Mašinsko pranje","Profesionalno","HACCP"], f:"inox", sub:"masina-sudje", sg:"Mašine za pranje posuđa", o:0, sgo:4 },
    { t:"Mašine za pranje čaša", s:"Pranje čaša", sp:["Čaše","Brzo","Higijenska"], f:"inox", sub:"masina-case", sg:"Mašine za pranje posuđa", o:1, sgo:4 },
    { t:"Mašine sa haubicom", s:"Hauba", sp:["Hauba","Velika kapaciteta","Profesionalno"], f:"inox", sub:"masina-haube", sg:"Mašine za pranje posuđa", o:2, sgo:4 },
    { t:"Mašine za pranje pribora", s:"Pribor", sp:["Pribor","Korpe","Higijenski"], f:"inox", sub:"masina-utensil", sg:"Mašine za pranje posuđa", o:3, sgo:4 },
    // G6: Posuđe
    { t:"GN posude i poklopci", s:"GN", sp:["GN 1/1","Inox","Poklopci"], f:"inox", sub:"gn-posude", sg:"Posuđe i catering oprema", o:0, sgo:5 },
    { t:"Posude za serviranje", s:"Serviranje", sp:["Serviranje","Inox","Catering"], f:"inox", sub:"posude-serviranje", sg:"Posuđe i catering oprema", o:1, sgo:5 },
    { t:"Lonci i tiganji", s:"Posuđe", sp:["Inox","Lonci","Tiganji"], f:"inox", sub:"lonci-tiganji", sg:"Posuđe i catering oprema", o:2, sgo:5 },
    { t:"Servirne linije za kantinu", s:"Kantina", sp:["Toplo/hladno","Kantina","Linija"], f:"inox", sub:"servirne-linije", sg:"Posuđe i catering oprema", o:3, sgo:5 },
    { t:"Kuhinjska vaga", s:"Vaga", sp:["Preciznost","Inox","HACCP"], f:"inox", sub:"kuhinjska-vaga", sg:"Posuđe i catering oprema", o:4, sgo:5 },
  ];

  for (const p of inox) await upsert(p.t, p.s, p.sp, p.f, p.sub, "inox-kuhinja", p.sg, p.o, p.sgo);
  console.log(`  ✅ inox: ${inox.length} products`);

  // ── FRIZIDERI & KOMORE ────────────────────────────────────────────
  console.log("📁 Frižideri & komore");
  const friz = [
    { t:"Vertikalni frižider — staklena vrata", s:"Vertikalni", sp:["Staklena vrata","Uspravno","LED"], f:"rashlada", sub:"frizider-vertikalni-staklena-vrata", sg:"Frižideri i rashladni ormari", o:0, sgo:0 },
    { t:"Vertikalni frižider — puna vrata", s:"Vertikalni", sp:["Puna vrata","Skladište","Uspravno"], f:"rashlada", sub:"frizider-vertikalni-puna-vrata", sg:"Frižideri i rashladni ormari", o:1, sgo:0 },
    { t:"Profesionalni rashladni ormar", s:"Profesionalni", sp:["Profesionalno","Puna vrata","2 kapaciteta"], f:"rashlada", sub:"ormar-profesionalni-puna-vrata", sg:"Frižideri i rashladni ormari", o:2, sgo:0 },
    { t:"Podpultni frižideri", s:"Podpultni", sp:["Podpultno","HoReCa","Inox"], f:"rashlada", sub:"podpultni-frizider", sg:"Frižideri i rashladni ormari", o:3, sgo:0 },
    { t:"Zamrzivač", s:"Zamrzivač", sp:["Smrznuto","-18°C","Profesionalno"], f:"rashlada", sub:"zamrzivac", sg:"Zamrzivači", o:0, sgo:1 },
    { t:"Podpultni zamrzivač", s:"Podpultni", sp:["Podpultno","Smrznuto","HoReCa"], f:"rashlada", sub:"zamrzivac-podpultni", sg:"Zamrzivači", o:1, sgo:1 },
    { t:"Profesionalni zamrzivač", s:"Profesionalni", sp:["Profesionalno","Zamrzivač","Veliki kapacitet"], f:"rashlada", sub:"zamrzivac-profesionalni", sg:"Zamrzivači", o:2, sgo:1 },
    { t:"Saladeta sa GN nadgradnjom", s:"Saladeta", sp:["GN","Saladeta","Rashladni radni sto"], f:"rashlada", sub:"saladeta-gn", sg:"Rashladni radni stolovi (saladete)", o:0, sgo:2 },
    { t:"Rashladni radni sto sa fiokama", s:"Radni sto", sp:["Fioke","Rashladni","Inox"], f:"rashlada", sub:"radni-sto-fioke", sg:"Rashladni radni stolovi (saladete)", o:1, sgo:2 },
    { t:"Podpultni rashladni sto", s:"Podpultni sto", sp:["Podpultno","Rashladni","Inox"], f:"rashlada", sub:"podpultni-sto", sg:"Rashladni radni stolovi (saladete)", o:2, sgo:2 },
    { t:"Šok komore (Blast Chiller)", s:"Blast chiller", sp:["Brzo hlađenje","Šok","HACCP"], f:"rashlada", sub:"sok-komora", sg:"Šok komore i ledomati", o:0, sgo:3 },
    { t:"Ledomati", s:"Ledomat", sp:["Led","Kocke","Ljuspice"], f:"rashlada", sub:"ledomat", sg:"Šok komore i ledomati", o:1, sgo:3 },
  ];
  for (const p of friz) await upsert(p.t, p.s, p.sp, p.f, p.sub, "frizideri-komore", p.sg, p.o, p.sgo);
  console.log(`  ✅ frizideri: ${friz.length} products`);

  // ── POLIČNI SISTEMI ───────────────────────────────────────────────
  console.log("📁 Polični sistemi");
  const pol = [
    { t:"Cjenovne šine", s:"Slimline", sp:["Slimline","Modularno","Uredno"], f:"polica", sub:"cjenovne-sine", sg:"Prikaz cijena", o:0, sgo:0 },
    { t:"Držači cijena za kukice", s:"Držači", sp:["Kukice","Fleksibilno","Jasno"], f:"polica", sub:"drzaci-kukice", sg:"Prikaz cijena", o:1, sgo:0 },
    { t:"Držači za ESL cjenovnike", s:"ESL", sp:["ESL","Digitalno","Centralno"], f:"polica", sub:"esl-drzaci", sg:"Prikaz cijena", o:2, sgo:0 },
    { t:"Papirne cjenovne trake", s:"Trake", sp:["Papirno","Univerzalno","Ekonomično"], f:"polica", sub:"papirne-trake", sg:"Prikaz cijena", o:3, sgo:0 },
    { t:"Automatsko poravnavanje (pusheri)", s:"Pusheri", sp:["Automatski","Pusheri","Uredno"], f:"polica", sub:"automatsko-poravnavanje", sg:"Upravljanje policama", o:0, sgo:1 },
    { t:"Ručno poravnavanje (faceri)", s:"Facer", sp:["Ručni","Facer","Fleksibilno"], f:"polica", sub:"rucno-poravnavanje", sg:"Upravljanje policama", o:1, sgo:1 },
    { t:"Pregrade za police", s:"Pregrade", sp:["Pregrade","Separatori","Uredno"], f:"polica", sub:"pregrade-police", sg:"Upravljanje policama", o:2, sgo:1 },
    { t:"Svježi proizvodi — ambient display", s:"FreshCase", sp:["FreshCase","Ambient","Svježe"], f:"polica", sub:"svjezi-ambient", sg:"Svježi i nepakovani proizvodi", o:0, sgo:2 },
    { t:"Svježi proizvodi — hladni raspon (coolers)", s:"Cooler", sp:["Cooler","Hladno","Svježe"], f:"polica", sub:"svjezi-coolers", sg:"Svježi i nepakovani proizvodi", o:1, sgo:2 },
    { t:"Posude za doziranje", s:"Dozator", sp:["Doziranje","Unpakovano","Bulk"], f:"polica", sub:"posude-doziranje", sg:"Svježi i nepakovani proizvodi", o:2, sgo:2 },
    { t:"Gravitacione posude za bulk", s:"Gravitacione", sp:["Gravitaciono","Bulk","Svježe"], f:"polica", sub:"gravitacione-posude", sg:"Svježi i nepakovani proizvodi", o:3, sgo:2 },
    { t:"Posude za tečnost", s:"Tečnost", sp:["Tečnost","Doziranje","Unpakovano"], f:"polica", sub:"posude-tecnost", sg:"Svježi i nepakovani proizvodi", o:4, sgo:2 },
    { t:"Samostojeći display elementi", s:"Display", sp:["Standalone","Display","Vizualno"], f:"polica", sub:"samostojeci-elementi", sg:"Impulsna i promotivna prodaja", o:0, sgo:3 },
    { t:"Unakrsno izlaganje", s:"Cross", sp:["Cross-merchandising","Impulsno","Atraktivno"], f:"polica", sub:"unakrsno-izlaganje", sg:"Impulsna i promotivna prodaja", o:1, sgo:3 },
    { t:"Nadznaci za prolaze i odjeljenja", s:"Signage", sp:["Navigacija","Velika slova","Vidljivo"], f:"polica", sub:"nadznaci-oznake", sg:"Komunikacija u prodavnici", o:0, sgo:4 },
    { t:"Promocija na ivici police", s:"Promo", sp:["Promo","Ivica","Shelf-edge"], f:"polica", sub:"promocija-ivica", sg:"Komunikacija u prodavnici", o:1, sgo:4 },
    { t:"Ramovi i stalci za komunikaciju", s:"Rám", sp:["Ramovi","Stalci","A4/A3"], f:"polica", sub:"ramovi-stalci", sg:"Komunikacija u prodavnici", o:2, sgo:4 },
    { t:"Tacne za police", s:"Tacna", sp:["Tacne","Police","Prezentacija"], f:"polica", sub:"tacne-police", sg:"Komunikacija u prodavnici", o:3, sgo:4 },
    { t:"Zaštita od krađe", s:"Loss Prevention", sp:["Sigurnost","Anti-theft","Senzori"], f:"polica", sub:"zastita-kradje", sg:"Zaštita od krađe", o:0, sgo:5 },
    { t:"Rasvjeta za police", s:"Ad-Lite", sp:["LED","Rasvjeta","Ad-Lite"], f:"polica", sub:"rasvjeta-police", sg:"Zaštita od krađe", o:1, sgo:5 },
  ];
  for (const p of pol) await upsert(p.t, p.s, p.sp, p.f, p.sub, "policni-sistemi", p.sg, p.o, p.sgo);
  console.log(`  ✅ policni: ${pol.length} products`);

  // ── KOLICA & KORPE ────────────────────────────────────────────────
  console.log("📁 Kolica & korpe");
  const kol = [
    { t:"Korpa Mini 80L", s:"Eko Color", sp:["80 L","Eko Color","Brend boja"], f:"kolica-korpe", sub:"korpa-mini-80l", sg:"Ručne korpe za kupovinu", o:0, sgo:0 },
    { t:"Korpa Mini 90L", s:"Glamour", sp:["90 L","Glamour","Ergonomski"], f:"kolica-korpe", sub:"korpa-mini-90l", sg:"Ručne korpe za kupovinu", o:1, sgo:0 },
    { t:"Korpa Samba 130L", s:"Samba", sp:["130 L","Samba","Glamour"], f:"kolica-korpe", sub:"korpa-samba-130l", sg:"Ručne korpe za kupovinu", o:2, sgo:0 },
    { t:"Korpa Midi 160L", s:"Midi", sp:["160 L","Midi","Reciklirano"], f:"kolica-korpe", sub:"korpa-midi-160l", sg:"Ručne korpe za kupovinu", o:3, sgo:0 },
    { t:"Korpa Maxi 210L", s:"Maxi", sp:["210 L","Maxi","Brend boja"], f:"kolica-korpe", sub:"korpa-maxi-210l", sg:"Ručne korpe za kupovinu", o:4, sgo:0 },
    { t:"Korpa Panaro", s:"Panaro", sp:["Panaro","Kompaktno","Dizajn"], f:"kolica-korpe", sub:"korpa-panaro", sg:"Ručne korpe za kupovinu", o:5, sgo:0 },
    { t:"Korpa PET Basket", s:"PET", sp:["Reciklirani PET","Eko","Brend boja"], f:"kolica-korpe", sub:"korpa-pet-basket", sg:"Ručne korpe za kupovinu", o:6, sgo:0 },
    { t:"Korpa Twinst", s:"Twinst", sp:["Twinst","Dizajn","Brend boja"], f:"kolica-korpe", sub:"korpa-twinst", sg:"Ručne korpe za kupovinu", o:7, sgo:0 },
    { t:"Avant 80", s:"Avant", sp:["80 L","Avant","Kompaktno"], f:"kolica-korpe", sub:"kolica-avant-80", sg:"Kolica za kupovinu (Avant serija)", o:0, sgo:1 },
    { t:"Avant 106", s:"Avant", sp:["106 L","Avant","Standard"], f:"kolica-korpe", sub:"kolica-avant-106", sg:"Kolica za kupovinu (Avant serija)", o:1, sgo:1 },
    { t:"Avant 130", s:"Avant", sp:["130 L","Avant","Ergonomski"], f:"kolica-korpe", sub:"kolica-avant-130", sg:"Kolica za kupovinu (Avant serija)", o:2, sgo:1 },
    { t:"Avant 185", s:"Avant", sp:["185 L","Avant","Veliki"], f:"kolica-korpe", sub:"kolica-avant-185", sg:"Kolica za kupovinu (Avant serija)", o:3, sgo:1 },
    { t:"Avant 210", s:"Avant", sp:["210 L","Avant","XL"], f:"kolica-korpe", sub:"kolica-avant-210", sg:"Kolica za kupovinu (Avant serija)", o:4, sgo:1 },
    { t:"Classic serija", s:"Classic", sp:["Classic","Žičana","Ergonomski"], f:"kolica-korpe", sub:"kolica-classic", sg:"Kolica za kupovinu (Avant serija)", o:5, sgo:1 },
    { t:"Dječja kolica Kid Car", s:"Kid Car", sp:["Djeca","Zabavno","Brend"], f:"kolica-korpe", sub:"kolica-djecja-kid-car", sg:"Specijalna i transportna kolica", o:0, sgo:2 },
    { t:"Kolica pristupačna (invalidska)", s:"Pristupačna", sp:["Invalidska","Pristupačno","Prilagođeno"], f:"kolica-korpe", sub:"kolica-pristupacna", sg:"Specijalna i transportna kolica", o:1, sgo:2 },
    { t:"Transportna kolica Vario", s:"Vario", sp:["Transport","Vario","Višenamjenski"], f:"kolica-korpe", sub:"kolica-transportna-vario", sg:"Specijalna i transportna kolica", o:2, sgo:2 },
  ];
  for (const p of kol) await upsert(p.t, p.s, p.sp, p.f, p.sub, "kolica-korpe", p.sg, p.o, p.sgo);
  console.log(`  ✅ kolica: ${kol.length} products`);

  // ── CHECKOUT & KASE ───────────────────────────────────────────────
  console.log("📁 Checkout & kase");
  const chk = [
    { t:"Standard kasa pult", s:"Standard", sp:["Standard","Ergonomski","Izdržljivo"], f:"checkout-kase", sub:"kasa-standard", sg:"Kasa pultovi — zona naplate", o:0, sgo:0 },
    { t:"Standard Plus pult", s:"Standard Plus", sp:["Standard+","Više prostora","Modularno"], f:"checkout-kase", sub:"kasa-standard-plus", sg:"Kasa pultovi — zona naplate", o:1, sgo:0 },
    { t:"Premium kasa pult", s:"Premium", sp:["Premium","Dizajn","Brending"], f:"checkout-kase", sub:"kasa-premium", sg:"Kasa pultovi — zona naplate", o:2, sgo:0 },
    { t:"Premium Light pult", s:"Premium Light", sp:["Premium","Light","Estetika"], f:"checkout-kase", sub:"kasa-premium-light", sg:"Kasa pultovi — zona naplate", o:3, sgo:0 },
    { t:"Convenience kasa pult", s:"Convenience", sp:["Convenience","Kompaktno","Brzo"], f:"checkout-kase", sub:"kasa-convenience", sg:"Kasa pultovi — zona naplate", o:4, sgo:0 },
    { t:"Lime Light pult", s:"Lime Light", sp:["Dizajn","Vizualno","Premium"], f:"checkout-kase", sub:"kasa-lime-light", sg:"Kasa pultovi — zona naplate", o:5, sgo:0 },
    { t:"Lime Line pult", s:"Lime Line", sp:["Linija","Minimalistički","Moderno"], f:"checkout-kase", sub:"kasa-lime-line", sg:"Kasa pultovi — zona naplate", o:6, sgo:0 },
    { t:"Modularni kasa pultovi", s:"Modularni", sp:["Modularno","Fleksibilno","Custom"], f:"checkout-kase", sub:"kasa-modularni", sg:"Kasa pultovi — zona naplate", o:7, sgo:0 },
    { t:"Mini kase", s:"Mini", sp:["Mini","Kompaktno","Convenience"], f:"checkout-kase", sub:"kasa-mini", sg:"Kasa pultovi — zona naplate", o:8, sgo:0 },
    { t:"Impulsni kasa pult", s:"Impulsni", sp:["Impulsna zona","Kompaktno","Prilagođeno"], f:"checkout-kase", sub:"kasa-impulsni", sg:"Kasa pultovi — zona naplate", o:9, sgo:0 },
    { t:"Sklopivi kasa pult", s:"Sklopivi", sp:["Sklopivo","Maloprodaja","Mobilno"], f:"checkout-kase", sub:"kasa-sklopivi", sg:"Kasa pultovi — zona naplate", o:10, sgo:0 },
    { t:"SmartPos self-checkout", s:"SmartPos", sp:["Self-checkout","Touchscreen","Netris"], f:"checkout-kase", sub:"self-smartpos", sg:"Samouslužni uređaji i self-checkout", o:0, sgo:1 },
    { t:"SmartPos Light", s:"SmartPos Light", sp:["Kompaktno","Self-checkout","Card-only"], f:"checkout-kase", sub:"self-smartpos-light", sg:"Samouslužni uređaji i self-checkout", o:1, sgo:1 },
    { t:"Netris self-checkout", s:"Netris", sp:["Netris","Kompaktno","Card-only"], f:"checkout-kase", sub:"self-netris", sg:"Samouslužni uređaji i self-checkout", o:2, sgo:1 },
    { t:"MainBox kiosk", s:"MainBox", sp:["Kiosk","Informacijski","Touch"], f:"checkout-kase", sub:"self-mainbox", sg:"Samouslužni uređaji i self-checkout", o:3, sgo:1 },
    { t:"Kiosk za narudžbe", s:"Kiosk", sp:["Narudžba","Touch","QSR"], f:"checkout-kase", sub:"self-kiosk", sg:"Samouslužni uređaji i self-checkout", o:4, sgo:1 },
    { t:"FoodBox samousluga", s:"FoodBox", sp:["FoodBox","Hrana","Samousluga"], f:"checkout-kase", sub:"self-foodbox", sg:"Samouslužni uređaji i self-checkout", o:5, sgo:1 },
    { t:"FoodBox za prodavnice", s:"FoodBox Pro", sp:["FoodBox","Prodavnica","Samousluga"], f:"checkout-kase", sub:"self-foodbox-prodavnica", sg:"Samouslužni uređaji i self-checkout", o:6, sgo:1 },
    { t:"RVM reciklaža ambalaže", s:"RVM", sp:["Reciklaža","Ambalaža","RVM"], f:"checkout-kase", sub:"self-reciklaza", sg:"Samouslužni uređaji i self-checkout", o:7, sgo:1 },
  ];
  for (const p of chk) await upsert(p.t, p.s, p.sp, p.f, p.sub, "checkout-kase", p.sg, p.o, p.sgo);
  console.log(`  ✅ checkout: ${chk.length} products`);

  // ── USMJERAVANJE ──────────────────────────────────────────────────
  console.log("📁 Usmjeravanje");
  const usm = [
    { t:"Elektronski ulaz Porta'e Infra", s:"Porta'e", sp:["Elektronski","Infra senzor","Automatsko"], f:"usmjeravanje-barijere", sub:"elektronski-porta-infra", sg:"Ulazno-izlazne barijere i turniketi", o:0, sgo:0 },
    { t:"Elektronski ulaz Porta'e Radar", s:"Porta'e", sp:["Elektronski","Radar","Jednosmjerno"], f:"usmjeravanje-barijere", sub:"elektronski-porta-radar", sg:"Ulazno-izlazne barijere i turniketi", o:1, sgo:0 },
    { t:"Mehanički ulaz Porta M1", s:"Porta M1", sp:["Mehanički","Jednosmjerno","Bez napajanja"], f:"usmjeravanje-barijere", sub:"mehanicki-porta-m1", sg:"Ulazno-izlazne barijere i turniketi", o:2, sgo:0 },
    { t:"Barijera za kasu Porta C2", s:"Porta C2", sp:["Kasa zona","Usmjeravanje","Brava"], f:"usmjeravanje-barijere", sub:"barijere-porta-c2", sg:"Ulazno-izlazne barijere i turniketi", o:3, sgo:0 },
    { t:"Barijere sa katancem", s:"Katanac", sp:["Katanac","Sigurnost","Mehaničko"], f:"usmjeravanje-barijere", sub:"barijere-katanac", sg:"Ulazno-izlazne barijere i turniketi", o:4, sgo:0 },
    { t:"Vertikalni turniket", s:"Turniket", sp:["Turniket","Vertikalni","Kontrola pristupa"], f:"usmjeravanje-barijere", sub:"turniket-vertikalni", sg:"Ulazno-izlazne barijere i turniketi", o:5, sgo:0 },
    { t:"AlphaGate", s:"ITAB", sp:["Automatski","AlphaGate","ITAB"], f:"usmjeravanje-itab", sub:"alphagate", sg:"ITAB ulazne i izlazne kapije", o:0, sgo:1 },
    { t:"SigmaGate", s:"ITAB", sp:["Automatski","SigmaGate","ITAB"], f:"usmjeravanje-itab", sub:"sigmagate", sg:"ITAB ulazne i izlazne kapije", o:1, sgo:1 },
    { t:"CentroGate", s:"ITAB", sp:["CentroGate","ITAB","Srednja veličina"], f:"usmjeravanje-itab", sub:"centrogate", sg:"ITAB ulazne i izlazne kapije", o:2, sgo:1 },
    { t:"ExitFlow", s:"ITAB", sp:["ExitFlow","Jednosmjerno","Izlaz"], f:"usmjeravanje-itab", sub:"exitflow", sg:"ITAB ulazne i izlazne kapije", o:3, sgo:1 },
    { t:"Sesame kapije", s:"ITAB", sp:["Sesame","Kompaktno","ITAB"], f:"usmjeravanje-itab", sub:"sesame", sg:"ITAB ulazne i izlazne kapije", o:4, sgo:1 },
    { t:"Mehaničke kapije", s:"ITAB", sp:["Mehaničke","Kapije","Čelik"], f:"usmjeravanje-itab", sub:"mehanicke-kapije", sg:"ITAB ulazne i izlazne kapije", o:5, sgo:1 },
    { t:"ScanMaster", s:"ITAB", sp:["ScanMaster","Skeniranje","Self-scan"], f:"usmjeravanje-itab", sub:"scanmaster", sg:"ITAB ulazne i izlazne kapije", o:6, sgo:1 },
    { t:"Checkout Closer", s:"ITAB", sp:["Checkout Closer","Zatvaranje","Fleksibilno"], f:"usmjeravanje-itab", sub:"checkout-closer", sg:"ITAB ulazne i izlazne kapije", o:7, sgo:1 },
    { t:"Barijere i pregrade ITAB", s:"ITAB", sp:["Barijere","Pregrade","Usmjeravanje"], f:"usmjeravanje-itab", sub:"barijere-pregrade", sg:"ITAB ulazne i izlazne kapije", o:8, sgo:1 },
  ];
  for (const p of usm) await upsert(p.t, p.s, p.sp, p.f, p.sub, "usmjeravanje", p.sg, p.o, p.sgo);
  console.log(`  ✅ usmjeravanje: ${usm.length} products`);

  console.log("\n✅ All product groups seeded!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
