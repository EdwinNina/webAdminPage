import { Controller, Get } from '@nestjs/common';
import { SeedsService } from './seeds.service';

@Controller('seeds')
export class SeedsController {
  constructor(private readonly seedsService: SeedsService) {}

  @Get()
  insertDataDB(){
    return this.seedsService.insertDataDB();
  }

  @Get('roles')
  insertRoleSeed(){
    return this.seedsService.insertRolesDB();
  }
}
