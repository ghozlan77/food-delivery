import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

import { users } from '../db/schema/users.js';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DATABASE')
    private db: any,

    private jwtService: JwtService,
  ) {}

  // =========================
  // Register
  // =========================
  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string
  ) {
    // Check if email already exists
    const existingUser = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      throw new ConflictException(
        'Email already exists',
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10,
    );

    // Create user
    const result = await this.db
      .insert(users)
      .values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        password: users.password,
        role: users.role,
      });

    return {
      message: 'User registered successfully',
      user: result[0],
    };
  }

  // =========================
  // Login
  // =========================
  async login(
    email: string,
    password: string,
  ) {
    // Find user by email
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    const user = result[0];

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    // JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Generate JWT
    const accessToken =
      await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',

      accessToken,

      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  }
}