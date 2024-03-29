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

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  usersToContracts: many(usersToContracts),
  batches: many(batches),
  stripeAccount: one(stripeAccounts)
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
export const batchStatusEnum = pgEnum('status', ["NOT_STARTED", "PAUSED", 'IN_PROGRESS', 'FINALIZED']);

export const batches = createTable(
  "batch",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    name: text("name").notNull(),
    contributionAmount: numeric('contributionAmount').notNull(),
    seats: integer('seats').notNull(),
    frequency: frequencyEnum('frequency').notNull(),
    status: batchStatusEnum('status').notNull().default("NOT_STARTED"),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('createdAt', {
      mode: 'date'
    }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date'
    }).notNull().defaultNow(),
    deletedAt: timestamp('deletedAt', {
      mode: 'date'
    }),
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
    contributionAmount: numeric('contributionAmount').notNull(),
    frequency: frequencyEnum('frequency').notNull(),
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
  },
  (t) => ({
    pk: primaryKey({
      name: "userId_contractId",
      columns: [t.userId, t.contractId]
    }),
  })
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

export const usersToBatches = createTable(
  "users_to_batches",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id),
    batchId: uuid("batchId")
      .notNull()
      .references(() => batches.id)
  },
  (t) => ({
    pk: primaryKey({
      name: "userId_batchId",
      columns: [t.userId, t.batchId]
    }),
  })
);

export const usersToBatchesRelations = relations(usersToBatches, ({ one }) => ({
  batch: one(batches, {
    fields: [usersToBatches.batchId],
    references: [batches.id],
  }),
  user: one(users, {
    fields: [usersToBatches.userId],
    references: [users.id],
  }),
}));

export const stripeAccounts = createTable(
  "stripe_account",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id),
    accountId: text("accountId").notNull(),
  }
);

export const stripeAccountsRelations = relations(stripeAccounts, ({ one }) => ({
  user: one(users, {
    fields: [stripeAccounts.userId],
    references: [users.id]
  })
}))