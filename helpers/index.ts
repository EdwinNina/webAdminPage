import { BadRequestException, Logger, UnauthorizedException } from '@nestjs/common';

export const convertStringInSlugFormat = (word: string) => {
   return word.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-')
}

export const handleErrorDbLog = (error: any) => {
   const logger = new Logger()

   if(error.code === "23505") throw new BadRequestException(error.detail)

   if(error.response.statusCode === 401) throw new UnauthorizedException(error.response.message)

   logger.error(error)

}