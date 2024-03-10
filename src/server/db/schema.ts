import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  numeric,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { z } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => name);

export const users = createTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: text("image"),
  createdAt: timestamp('createdAt', {
    mode: 'date'
  }).defaultNow(),
  updatedAt: timestamp('updatedAt', {
    mode: 'date'
  }).defaultNow()
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  usersToContracts: many(usersToContracts),
  batches: many(batches)
}));

export const accounts = createTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id),
    type: text("type")
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
    createdAt: timestamp('createdAt', {
      mode: 'date'
    }).defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date'
    }).defaultNow()
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: text("sessionToken")
      .notNull()
      .primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const frequencyEnum = pgEnum('frequency', ['WEEKLY', 'MONTHLY', 'BIWEEKLY']);

export const batches = createTable(
  "batch",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    name: text("name"),
    contributionAmount: numeric('contributionAmount'),
    seats: integer('seats'),
    frequency: frequencyEnum('frequency'),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('createdAt', {
      mode: 'date'
    }).defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date'
    }).defaultNow(),
    contractId: uuid("contractId")
      .notNull()
      .references(() => contracts.id)
  },
)

export const batchesRelations = relations(batches, ({ one }) => ({
  contract: one(contracts, {
    fields: [batches.contractId],
    references: [contracts.id]
  }),
  user: one(users, {
    fields: [batches.userId],
    references: [users.id]
  })
}));

export const contracts = createTable(
  "contract",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    contributionAmount: numeric('contributionAmount'),
    frequency: frequencyEnum('frequency'),
    createdAt: timestamp('createdAt', {
      mode: 'date'
    }).defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date'
    }).defaultNow(),
  },
)

export const contractsRelations = relations(contracts, ({ many }) => ({
  usersToContracts: many(usersToContracts)
}));

export const usersToContracts = createTable(
  "users_to_contracts",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id),
    contractId: uuid("contractId")
      .notNull()
      .references(() => contracts.id)
  }
)


export const usersToContractsRelations = relations(usersToContracts, ({ one }) => ({
  contract: one(contracts, {
    fields: [usersToContracts.contractId],
    references: [contracts.id],
  }),
  user: one(users, {
    fields: [usersToContracts.userId],
    references: [users.id],
  }),
}));
