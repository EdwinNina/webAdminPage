import { etiquetas } from './data/etiquetas';
import { categorias } from './data/categorias';


// const main = async(): Promise<void> => {
//    try {
//       await prisma.tag.createMany({
//          data: etiquetas
//       })

//       await prisma.category.createMany({
//          data: categorias
//       })
//       await prisma.$disconnect()
//    } catch (error) {
//       console.error(error)
//       await prisma.$disconnect()
//       process.exit(1)
//    }
// }

// main()