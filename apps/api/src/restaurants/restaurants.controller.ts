import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service.js';
import { CreateRestaurantDto } from './dto/create.restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update.restaurant.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtPayload } from '@food-delivery/types';
import { UserRole } from '@food-delivery/types';
import { Request as ExpressRequest } from 'express';

type AuthRequest = ExpressRequest & { user: JwtPayload };

@Controller('restaurants')
export class RestaurantsController {
    
constructor(private restaurantsService: RestaurantsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  create(@Request() req: AuthRequest, @Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(req.user.sub, dto);
  }

  @Get('mine')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  findMine(@Request() req: AuthRequest) {
    return this.restaurantsService.findMine(req.user.sub);
  }

  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  update(
    @Param('id') id: string,
    @Request() req: AuthRequest,
    @Body() dto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(id, req.user.sub, dto);
  }
}
