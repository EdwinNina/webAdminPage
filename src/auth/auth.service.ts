import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { handleErrorDbLog } from 'helpers';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from 'src/roles/roles.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
   constructor(
      @InjectRepository(User)
      private authRepository: Repository<User>,
      private jwtService: JwtService,
      private roleService: RolesService,
   ) {}

   private generateJwt(payload: JwtPayload) {
      return this.jwtService.sign(payload);
   }

   async register(registerDto: RegisterDto) {
      try {
         const { password, ...body } = registerDto;

         const defaultRole = await this.roleService.getDefaultRole();

         const user = await this.authRepository.create({
            ...body,
            roles: [defaultRole],
            password: bcrypt.hashSync(password, 10)
         });

         const newUser = await this.authRepository.save(user);

         delete newUser.password;

         const { id, roles, ...restUser } = newUser;
         return {
            user: {
               ...restUser,
               roles: roles.map( role => role.name)
            },
            jwt: this.generateJwt({ id }),
         };
      } catch (error) {
         handleErrorDbLog(error);
      }
   }

   async login(loginDto: LoginDto) {
      const { email, password } = loginDto
      try {
         const user = await this.authRepository.findOne({
            where: {
            email: email.toLowerCase()
            },
            select: { email: true, password: true, id: true, username: true },
         });
   
         if (!user) throw new UnauthorizedException(`User not found with email ${email}`);
   
         if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('The password is not correct');
         delete user.password;
         const { id, roles, ...restUser } = user;

         return {
            user: {
               ...restUser,
               roles: roles.map( role => role.name)
            },
            jwt: this.generateJwt({ id }),
         };
      } catch (error) {
         handleErrorDbLog(error);
      }
   }
}
