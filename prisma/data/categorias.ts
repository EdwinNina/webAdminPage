import { convertStringInSlugFormat } from '../../helpers/index';
import { v4 as uuid } from 'uuid'

export const categorias = [
   {
      id: uuid(),
      title: 'desarrollo web',
      slug: convertStringInSlugFormat('desarrollo web'),
   },
   {
      id: uuid(),
      title: 'diseño de paginas',
      slug: convertStringInSlugFormat('diseño de paginas')
   },
   {
      id: uuid(),
      title: 'administracion de servidores',
      slug: convertStringInSlugFormat('administracion de servidores')
   },
   {
      id: uuid(),
      title: 'electronica',
      slug: convertStringInSlugFormat('electronica')
   },
   {
      id: uuid(),
      title: 'administracion de redes',
      slug: convertStringInSlugFormat('administracion de redes')
   },
   {
      id: uuid(),
      title: 'administracion de bases de datos',
      slug: convertStringInSlugFormat('administracion de bases de datos')
   },
   {
      id: uuid(),
      title: 'desarrollo de software',
      slug: convertStringInSlugFormat('desarrollo de software')
   },
   {
      id: uuid(),
      title: 'desarrollo de aplicaciones moviles',
      slug: convertStringInSlugFormat('desarrollo de aplicaciones moviles')
   },
];