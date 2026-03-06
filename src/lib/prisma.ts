import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️ DATABASE_URL not found. Prisma will be initialized lazily.')
    }
    return new PrismaClient()
  }
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

export const prisma = new Proxy({} as ReturnType<typeof prismaClientSingleton>, {
  get: (target, prop) => {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = prismaClientSingleton()
    }
    return (globalForPrisma.prisma as any)[prop]
  }
})
