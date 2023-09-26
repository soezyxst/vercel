import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

const ms = [
  { NIM: 13122001, Nama: "Malik Ahmad Zulkarnain Irawan" },
  { NIM: 13122002, Nama: "Inggar Pratiwi" },
  { NIM: 13122003, Nama: "Raudhah Yahya Kuddah" },
  { NIM: 13122004, Nama: "Nadhifa Tsaniyah Adira" },
  { NIM: 13122005, Nama: "Alief Putra Richarda" },
  { NIM: 13122006, Nama: "Widya Candra Asri" },
  { NIM: 13122007, Nama: "Muhammad Wafizia" },
  { NIM: 13122008, Nama: "Muhammad Abdunnafi A" },
  { NIM: 13122009, Nama: "Josh Felix Rajagukguk" },
  { NIM: 13122010, Nama: "Akeyla Reshad Krisnasyahbana" },
  { NIM: 13122011, Nama: "Rafi Danish Muliaputra" },
  { NIM: 13122012, Nama: "Albert Mika Freddy Siagian" },
  { NIM: 13122013, Nama: "Namira Khairani Azzahra" },
  { NIM: 13122014, Nama: "M.Ukkasya Raya" },
  { NIM: 13122015, Nama: "Muhammad Ariq Asshidqi" },
  { NIM: 13122016, Nama: "Gibran Raditya Umran" },
  { NIM: 13122017, Nama: "Nabiel Falih Utama" },
  { NIM: 13122018, Nama: "Devasandro Tegar Arni" },
  { NIM: 13122019, Nama: "Muhammad Fajar Yusuf" },
  { NIM: 13122020, Nama: "Luthfi Muhammad Zulfikar" },
  { NIM: 13122021, Nama: "Fauziah Fitri" },
  { NIM: 13122022, Nama: "Khalif Gibran Abhinaya" },
  { NIM: 13122023, Nama: "Azka Prama Septiandra Pamungkas" },
  { NIM: 13122024, Nama: "Robie Neil Julian Nababan" },
  { NIM: 13122025, Nama: "Riza Azzam Burhani" },
  { NIM: 13122026, Nama: "Jeremy Fernando Silaban" },
  { NIM: 13122027, Nama: "Daffa Asyhada Bilyast" },
  { NIM: 13122028, Nama: "Isaac Cornelius" },
  { NIM: 13122029, Nama: "Muhammad Alfi Hidayatullah" },
  { NIM: 13122030, Nama: "Muhammad Ivan Prayata Gaeahanny" },
  { NIM: 13122031, Nama: "Marvin Pradipta Abinowo" },
  { NIM: 13122032, Nama: "Danisworo Pradiptandaru Widodo" },
  { NIM: 13122033, Nama: "Muhammad Rizky Bagaskara" },
  { NIM: 13122034, Nama: "Juan Aaron Norata" },
  { NIM: 13122035, Nama: "Abimanyu Akmal Widodo" },
  { NIM: 13122036, Nama: "Muhamad Rakha I. Pragusta" },
  { NIM: 13122037, Nama: "Muhammad Fikri Zidandaru" },
  { NIM: 13122038, Nama: "Muhammad Farel Asshiddiqy" },
  { NIM: 13122039, Nama: "Shalahuddin" },
  { NIM: 13122040, Nama: "Hardianto Kodanta" },
  { NIM: 13122041, Nama: "Jasmine Nurul H" },
  { NIM: 13122042, Nama: "Fahrezy Risky Ahmady" },
  { NIM: 13122043, Nama: "Aryo Satya Wirawan" },
  { NIM: 13122044, Nama: "Raisa Madania Daryono" },
  { NIM: 13122045, Nama: "Raqa Duratul Akbar" },
  { NIM: 13122046, Nama: "Muhammad Farid Ali" },
  { NIM: 13122047, Nama: "Lanang Zaid Ibrahim" },
  { NIM: 13122048, Nama: "Evan Nathanael" },
  { NIM: 13122049, Nama: "Nyoman Surya Ananta Wijaya" },
  { NIM: 13122050, Nama: "Ryan Rivandi" },
  { NIM: 13122051, Nama: "Yulio Arian Dharma" },
  { NIM: 13122052, Nama: "Riza Hilmy Muttaqin" },
  { NIM: 13122053, Nama: "Bryan Lie" },
  { NIM: 13122054, Nama: "Azka Faiza Aruna" },
  { NIM: 13122055, Nama: "Irlo Eldriansha Achmad Fadhilla" },
  { NIM: 13122056, Nama: "Mikhail arsyad fadhila" },
  { NIM: 13122057, Nama: "Lintang Nugrahaning Mukti" },
  { NIM: 13122058, Nama: "Radhita Andaru Danakitri" },
  { NIM: 13122059, Nama: "Muhammad Reivaldi" },
  { NIM: 13122060, Nama: "Dolfa Junito Prasetyo" },
  { NIM: 13122061, Nama: "Bram Wiratma" },
  { NIM: 13122062, Nama: "Kasih Mulan Sari" },
  { NIM: 13122063, Nama: "Maulidya Riana Thalia Latuconsina" },
  { NIM: 13122064, Nama: "Khansa Syafiya Setyawan" },
  { NIM: 13122065, Nama: "Nabila Syifa Wardhani" },
  { NIM: 13122066, Nama: "Juan Leonardo" },
  { NIM: 13122067, Nama: "Muhammad Zaiq Azmi" },
  { NIM: 13122068, Nama: "Axel Wicaksana Faustine Santoso" },
  { NIM: 13122069, Nama: "Mikael Amadeus Tristanarendra" },
  { NIM: 13122070, Nama: "Rayhan Alawin Satrio" },
  { NIM: 13122071, Nama: "Naufal Radithya Dwinugraha" },
  { NIM: 13122072, Nama: "Jovan Bagus Waskito" },
  { NIM: 13122073, Nama: "Gresdo Guido Surya Robaga Malau" },
  { NIM: 13122074, Nama: "Sandrina Agatha Sinaga" },
  { NIM: 13122075, Nama: "Hilman Aufazaka Alhakim" },
  { NIM: 13122076, Nama: "Muhammad Rizky Amiruddin" },
  { NIM: 13122077, Nama: "Irfan Yafi Pranoto" },
  { NIM: 13122078, Nama: "Agusto Theodorus Rangga" },
  { NIM: 13122079, Nama: "Hannarisa Tania Adhidana" },
  { NIM: 13122080, Nama: "Adi Haditya Nursyam" },
  { NIM: 13122081, Nama: "Marvel Putra Purnawan" },
  { NIM: 13122082, Nama: "Ezra Noveraldo Kawi" },
  { NIM: 13122083, Nama: "Olivia Maria Tarawan" },
  { NIM: 13122084, Nama: "Kelvin Keldiamana Keliat" },
  { NIM: 13122085, Nama: "Abdiel Faiz Daffa Putra" },
  { NIM: 13122086, Nama: "Dzaki Dwiandra Shaumil Ghifari" },
  { NIM: 13122087, Nama: "Fawwaz Athar Suandhito" },
  { NIM: 13122088, Nama: "Abdul Azis Sulaeman" },
  { NIM: 13122089, Nama: "Muhammad Dhia Fauzan" },
  { NIM: 13122090, Nama: "Muhammad Luthfan Ahsani" },
  { NIM: 13122091, Nama: "Nicholas Patrick" },
  { NIM: 13122092, Nama: "Muhammad Azriel Ikramullah" },
  { NIM: 13122093, Nama: "Muhammad Noval Tores" },
  { NIM: 13122094, Nama: "Farraz Alif Hernando" },
  { NIM: 13122095, Nama: "Arifsani Amirrul Rasyidhin" },
  { NIM: 13122096, Nama: "Frenaldi Sam Faidiban" },
  { NIM: 13122097, Nama: "Ahmad Zaki Ramadhan" },
  { NIM: 13122098, Nama: "Boni Ernesto Damanik" },
  { NIM: 13122099, Nama: "Muammar Nabiel Devandra" },
  { NIM: 13122100, Nama: "Dita Ardiyanto" },
  { NIM: 13122101, Nama: "Yehezkiel Christiant Situmorang" },
  { NIM: 13122102, Nama: "Farrel Aimannabhan Prayanto" },
  { NIM: 13122103, Nama: "Muhamad Novian Akbar" },
  { NIM: 13122104, Nama: "Faryl Rashne Aydin" },
  { NIM: 13122105, Nama: "muhammad zykhra rauf arrahman" },
  { NIM: 13122106, Nama: "Satya Firmansyah" },
  { NIM: 13122107, Nama: "Daryl John Sayangbati" },
  { NIM: 13122108, Nama: "haidar raif achyar" },
  { NIM: 13122109, Nama: "M. Raisa Fahmi Firmansyah" },
  { NIM: 13122110, Nama: "Ikram Mulhaqqi" },
  { NIM: 13122111, Nama: "Astrella Sakanti Dewandaru" },
  { NIM: 13122112, Nama: "Hadid Kusuma Ryandi" },
  { NIM: 13122113, Nama: "abdullah Muhammad faiz" },
  { NIM: 13122114, Nama: "Jujur Satria Yudhatama" },
  { NIM: 13122115, Nama: "Rasendriya Michelle L G" },
  { NIM: 13122116, Nama: "IG.A.N Bagus Dhiva Citrajaya" },
  { NIM: 13122117, Nama: "Mahatma Ridwan Suryasa" },
  { NIM: 13122118, Nama: "Z. Dhia Lesmawan" },
  { NIM: 13122119, Nama: "Dylan Aurelius" },
  { NIM: 13122120, Nama: "Farrell Zia Kurniawan" },
  { NIM: 13122121, Nama: "Arta Aulia Affif" },
  { NIM: 13122122, Nama: "Muhammad Zaki Richard Wiguna S" },
  { NIM: 13122123, Nama: "Zahran Aris Athaillah" },
  { NIM: 13122124, Nama: "Abraham Satria Nugroho" },
  { NIM: 13122125, Nama: "Fergie Marcel Wijaya" },
  { NIM: 13122126, Nama: "Tandevin Michael Todo Tambunan" },
  { NIM: 13122127, Nama: "Deva Lazuardi Prabantoro" },
  { NIM: 13122128, Nama: "Dharma Jalu Prawirodirya" },
  { NIM: 13122129, Nama: "Muhammad Khairul Anam" },
  { NIM: 13122130, Nama: "Muhammad Calvin Pasya" },
  { NIM: 13122131, Nama: "Alfiedo Aryaputra Pongrante" },
  { NIM: 13122132, Nama: "Nicko Andreas" },
  { NIM: 13122133, Nama: "Marcel Jason Yaparto" },
  { NIM: 13122134, Nama: "Hezron Hans M Sraun" },
  { NIM: 13122135, Nama: "Rahmad Ibnu Aqmal Ramadhan" },
  { NIM: 13122136, Nama: "Joshua Brilliant Agustha Gunawan" },
  { NIM: 13122137, Nama: "Ryuki Kawata Sukami Nasution" },
  { NIM: 13122138, Nama: "Edwina Tanisha Kristanty" },
  { NIM: 13122139, Nama: "Muhammad Daffa Azzaini" },
  { NIM: 13122140, Nama: "Justin Florensiano Sumeisey" },
  { NIM: 13122141, Nama: "M. Naufal Dhiaulhaq" },
  { NIM: 13122142, Nama: "Carla Carmeline Sontana" },
  { NIM: 13122143, Nama: "Adam Adyatma" },
  { NIM: 13122144, Nama: "Juan Adidarma Subagia" },
  { NIM: 13122145, Nama: "Ancella Gusti Ayu Puspaningtyas" },
  { NIM: 13122146, Nama: "Rafael Albert Renato Panjaitan" },
  { NIM: 13122147, Nama: "Imam Ar Rayyan" },
  { NIM: 13122148, Nama: "Ryan Fernaldy" },
  { NIM: 13122149, Nama: "Gravin Hotasi Zakharia" },
  { NIM: 13122150, Nama: "Fitra Faza Maula" },
  { NIM: 13122151, Nama: "Muhammad Rizal Ibrahim" },
  { NIM: 13122152, Nama: "Muhammad Fathan Haqqani" },
  { NIM: 13122153, Nama: "Muhammad Thoriq Rashin Praja" },
  { NIM: 13122154, Nama: "Joy Russell Simangunsong" },
  { NIM: 13122155, Nama: "Shafa Raisa Hazet" },
  { NIM: 13122156, Nama: "Leonardo Santoso" },
  { NIM: 13122157, Nama: "Muhammad Ghulam Abdillah" },
  { NIM: 13122158, Nama: "Aaron Levy Mandari" },
  { NIM: 13122159, Nama: "Ruben Rabbani" },
  { NIM: 13122160, Nama: "Nathan Alfred Sebastian" },
  { NIM: 13122161, Nama: "Rakha Abdillah Firdaus" },
  { NIM: 13122162, Nama: "Juan Pisente" },
  { NIM: 13122164, Nama: "M Raihan Ridho Zidan" },
  { NIM: 13122166, Nama: "Gabriella Natania N. Situngkir" },
  { NIM: 13122167, Nama: "Samuel Filippo Sugianto" },
  { NIM: 13122169, Nama: "Muhammad Made Zulfikar Arifin" },
  { NIM: 13122170, Nama: "Rumi Robbani Rafsanjani" },
  { NIM: 13122171, Nama: "Muhammad Rizky" },
  { NIM: 13122172, Nama: "Kenisha Kendra Susetio" },
  { NIM: 13122173, Nama: "As Shiffa Siti Hazar" },
  { NIM: 13122174, Nama: "David Truly Aristo Sitanggang" },
  { NIM: 13122175, Nama: "Mahatma Raditya" },
  { NIM: 13122176, Nama: "Rayyan Ghiffari Nusaly" },
  { NIM: 13122177, Nama: "Bima Bhadrikananda" },
  { NIM: 13122178, Nama: "roman satrio" },
  { NIM: 13122181, Nama: "Matthew Horas Silalahi" },
  { NIM: 13122182, Nama: "Attar Aqeel Pasha" },
  { NIM: 13122183, Nama: "Ariya Cittaparami" },
  { NIM: 13122184, Nama: "Ophelia Jeanne Santo" },
  { NIM: 13122185, Nama: "Fadheel Bintang Makarim" },
  { NIM: 13122189, Nama: "Edric Geoffrey Pasaribu" },
  { NIM: 13122190, Nama: "Muhammad Bintang Iftitah" },
  { NIM: 13122191, Nama: "Erlangga Pratama Hartoto" },
  { NIM: 13122192, Nama: "Benedict Jeremy Trisna" },
  { NIM: 13122193, Nama: "Muhammad Riqza Aryadila" },
  { NIM: 13122194, Nama: "Gusti Muhammad Arsyad Gafli" },
  { NIM: 13122195, Nama: "Harits Surya Finmuro" },
  { NIM: 13122196, Nama: "Muhammad Akeyla Pradana Cahyadi" },
  { NIM: 13122197, Nama: "Reyhan Ubadillah" },
  { NIM: 13122198, Nama: "Muhammad Zhafran Fawwaz" },
  { NIM: 13122199, Nama: "amira soraya nizar" },
  { NIM: 13122200, Nama: "Amabel Ariandi Sulindra" },
  { NIM: 13122202, Nama: "Naufal Aflah Athallah" },
];

function generateToken(n: number) {
  const chars =
    "1234567890";
  let token = "";
  for (let i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}
const tokens: string[] = []

for (let i = 0; i < 10000; i++) {
  let token = generateToken(16)
  while (tokens.includes(token)) {
    token = generateToken(16)
  }
  tokens.push(token)
}

const bikes = [1, 2, 3, 4, 5, 6]

async function main() {
  await Promise.all(
    ms.map(async (m) => {
      return await prisma.user.create({
        data: {
          nim: m.NIM.toString(),
          passwordHash: await hash(m.NIM.toString(), 10),
          role: Role.USER,
          profile: {
            create: {
              name: m.Nama,
              prodi: "Teknik Mesin",
            },
          },
        },
      });
    }
    )
  );

  // await Promise.all(
  //   tokens.map(async (token) => {
  //     return await prisma.bikeToken.create({
  //       data: {
  //         token: token,
  //       }
  //     })
  //   })
  // )

  await Promise.all(
    bikes.map(async (bike) => {
      return await prisma.bike.create({
        data: {
          number: bike,
        }
      })
    })
  )
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
