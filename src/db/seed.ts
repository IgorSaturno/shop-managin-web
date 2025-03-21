import { faker } from "@faker-js/faker";
import { users, stores } from "./schema";
import { db } from "./connection";
import chalk from "chalk";

/**
 * Reset database
 */

await db.delete(users);
await db.delete(stores);

console.log(chalk.yellow("✔ Databese reset!"));

/**
 * Create customers
 */

await db.insert(users).values([
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: "customer",
  },
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: "customer",
  },
]);

console.log(chalk.yellow("✔ Created customers!"));

/**
 * Create manager
 */

const [manager] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: "admin@admin.com",
      role: "manager",
    },
  ])
  .returning({
    id: users.id,
  });

if (!manager) {
  throw new Error("Manager user creation failed");
}

console.log(chalk.yellow("✔ Created manager!"));

/**
 * Create store
 */
await db.insert(stores).values([
  {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    managerId: manager.id,
  },
]);

console.log(chalk.yellow("✔ Created store!"));
console.log(chalk.greenBright("Database seeded successfully!"));

process.exit(0);
