import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.PHARMACY_DB_URL }),
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

export const connectPharmacyDB = async () => {
  await prisma.$connect();
  console.log("[Prisma] Pharmacy DB connected");
};

export default prisma;
