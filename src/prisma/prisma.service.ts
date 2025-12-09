import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { env } from 'process';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {

    const pool = new Pool({
      connectionString: env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);

    super({
      adapter,
    });
  }
}

