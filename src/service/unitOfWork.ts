import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
class UnitOfWork {
  db: PrismaClient;
  constructor() {
    this.db = prisma;
  }

  execute = async (work: any) => {
    const result = await this.db.$transaction(async (action: any) => {
      return await work(action);
    });
    return result;
  };

  disconnec = async () => {
    await this.db.$disconnect();
  };
}

export default UnitOfWork;
