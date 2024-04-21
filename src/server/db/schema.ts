import { relations, sql } from "drizzle-orm";
import {
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => name);

export const suscriptionEnum = pgEnum('suscription', ["BASIC", "PREMIUM"]);

export const users = createTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: text("image"),
  suscription: suscriptionEnum("suscription").notNull().default("BASIC"),
  createdAt: timestamp('createdAt', {
    mode: 'date'
  }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', {
    mode: 'date'
  }).notNull().defaultNow()
});

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  usersToContracts: many(usersToContracts),
  usersToBatches: many(usersToBatches),
  batches: many(batches),
  stripeAccount: one(stripeAccounts, {
    fields: [users.id],
    references: [stripeAccounts.userId]
  }),
  payments: many(payments),
  batchContributions: many(batchContributions),
  withdrawalsLog: many(withdrawalsLog)
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
    }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date'
    }).notNull().defaultNow()
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
export const batchStatusEnum = pgEnum('batch_status', ["NOT_STARTED", "PAUSED", 'IN_PROGRESS', 'FINISHED']);

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
    }).notNull().notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date'
    }).notNull().notNull().defaultNow(),
    deletedAt: timestamp('deletedAt', {
      mode: 'date'
    }),
    contractId: uuid("contractId")
      .notNull()
      .references(() => contracts.id)
  },
)

export const batchesRelations = relations(batches, ({ one, many }) => ({
  contract: one(contracts, {
    fields: [batches.contractId],
    references: [contracts.id]
  }),
  user: one(users, {
    fields: [batches.userId],
    references: [users.id]
  }),
  batchRegisters: many(batchRegisters),
  batchContributions: many(batchContributions),
  withdrawalsLog: many(withdrawalsLog)
}));

export const contracts = createTable(
  "contract",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    contributionAmount: numeric('contributionAmount').notNull(),
    frequency: frequencyEnum('frequency').notNull(),
    createdAt: timestamp('createdAt', {
      mode: 'date'
    }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date'
    }).notNull().defaultNow(),
  },
)

export const contractsRelations = relations(contracts, ({ many }) => ({
  usersToContracts: many(usersToContracts)
}));

export const usersToContracts = createTable(
  "user_to_contract",
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
  "user_to_batch",
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
    onboarding: boolean("onboarding").notNull().default(false),
    createdAt: timestamp('createdAt', {
      mode: 'date'
    }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date'
    }).notNull().defaultNow(),
  }
);

export const stripeAccountsRelations = relations(stripeAccounts, ({ one }) => ({
  user: one(users, {
    fields: [stripeAccounts.userId],
    references: [users.id]
  })
}));

export const batchRegisterStatusEnum = pgEnum("batch_register_status", ["NOT_STARTED", "IN_PROGRESS", "FINISHED"]);

export const batchRegisters = createTable(
  "batch_register",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    batchId: uuid("batchId")
      .notNull()
      .references(() => batches.id),
    frequency: frequencyEnum("frequency").notNull(),
    status: batchRegisterStatusEnum("status").notNull().default("NOT_STARTED"),
    startDate: date("startDate", { mode: "date" }).notNull(),
    endDate: date("endDate", { mode: "date" }).notNull(),
    batchNumber: integer('batchNumber').notNull(),
    contributionAmount: numeric('contributionAmount').notNull().default("0"),
    withdraw: boolean("withdraw").notNull().default(false),
    recipientId: uuid("recipientId")
      .references(() => users.id).notNull(),
    createdAt: timestamp('createdAt', {
      mode: 'date'
    }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date'
    }).notNull().defaultNow(),
  }
);

export const batchRegistersRelations = relations(batchRegisters, ({ one, many }) => ({
  batch: one(batches, {
    fields: [batchRegisters.batchId],
    references: [batches.id]
  }),
  recipient: one(users, {
    fields: [batchRegisters.recipientId],
    references: [users.id]
  }),
  batchContributions: many(batchContributions),
  withdrawalsLog: many(withdrawalsLog)
}));

export const paymentCaseEnum = pgEnum('payment_case', ["BATCH", "CROWDFUNDING", "SUSCRIPTION"]);

export const payments = createTable(
  "payment",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id),
    checkoutSessionId: text("checkoutSessionId").notNull(),
    paymentCase: paymentCaseEnum("paymentCase").notNull(),
    createdAt: timestamp('createdAt', {
      mode: 'date'
    }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date'
    }).notNull().defaultNow(),
  }
);

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id]
  })
}));

export const batchContributions = createTable(
  "batch_contribution",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id),
    batchId: uuid("batchId")
      .notNull()
      .references(() => batches.id),
    batchRegisterId: uuid("batchRegisterId")
      .notNull()
      .references(() => batchRegisters.id),
    amount: numeric('amount').notNull(),
    paymentId: uuid("paymentId")
      .notNull()
      .references(() => payments.id),
    createdAt: timestamp('createdAt', {
      mode: 'date'
    }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date'
    }).notNull().defaultNow(),
  }
);

export const batchContributionsRelations = relations(batchContributions, ({ one }) => ({
  user: one(users, {
    fields: [batchContributions.userId],
    references: [users.id]
  }),
  payment: one(payments, {
    fields: [batchContributions.paymentId],
    references: [payments.id]
  }),
  batch: one(batches, {
    fields: [batchContributions.batchId],
    references: [batches.id]
  }),
  batchRegister: one(batchRegisters, {
    fields: [batchContributions.batchRegisterId],
    references: [batchRegisters.id]
  }),
}));

export const nofitications = createTable(
  "notification",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    content: text("content").notNull(),
    iconUrl: text("iconUrl").notNull(),
    link: text("link").notNull(),
    seen: boolean("seen").notNull().default(false),
    receiverId: uuid("receiverId")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('createdAt', {
      mode: 'date'
    }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date'
    }).notNull().defaultNow(),
  }
);

export const nofiticationsRelations = relations(nofitications, ({ one }) => ({
  receiver: one(users, {
    fields: [nofitications.receiverId],
    references: [users.id]
  })
}))

export const batchRequestTypeEnum = pgEnum("batch_request_type", ["START", "PAUSE", 'ACTIVATE', 'FINISH']);
export const batchRequestStatusEnum = pgEnum("batch_request_status", ["SENT", "ACCEPTED"]);

export const batchRequests = createTable(
  "batch_request",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    batchId: uuid("batchId")
      .notNull()
      .references(() => batches.id),
    type: batchRequestTypeEnum("type").notNull(),
    status: batchRequestStatusEnum("status").notNull(),
    createdAt: timestamp('createdAt', {
      mode: 'date'
    }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date'
    }).notNull().defaultNow(),
  }
);

export const batchRequestsRelations = relations(batchRequests, ({ one, many }) => ({
  batch: one(batches, {
    fields: [batchRequests.batchId],
    references: [batches.id]
  }),
  batchRequestsToUsers: many(batchRequestsToUsers)
}))

export const batchRequestsToUsers = createTable(
  "batch_request_to_user",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id),
    batchRequestId: uuid("batchRequestId")
      .notNull()
      .references(() => batchRequests.id),
    check: boolean("check").notNull().default(false),
    createdAt: timestamp('createdAt', {
      mode: 'date'
    }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date'
    }).notNull().defaultNow(),
  }
);

export const batchRequestsToUsersRelations = relations(batchRequestsToUsers, ({ one }) => ({
  user: one(users, {
    fields: [batchRequestsToUsers.userId],
    references: [users.id]
  }),
  batchRequest: one(batchRequests, {
    fields: [batchRequestsToUsers.batchRequestId],
    references: [batchRequests.id]
  }),
}))

export const withdrawalsLog = createTable(
  'withdrawal_logs',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    userId: uuid('userId').notNull().references(() => users.id),
    amount: numeric('amount').notNull(),
    batchRegisterId: uuid('batchRegisterId').notNull().references(() => batchRegisters.id),
    batchId: uuid('batchId').notNull().references(() => batches.id),
    createdAt: timestamp('createdAt', {
      mode: 'date'
    })
  }
)

export const withdrawalRelations = relations(withdrawalsLog, ({ one }) => ({
  user: one(users, {
    fields: [withdrawalsLog.userId],
    references: [users.id]
  }),
  register: one(batchRegisters, {
    fields: [withdrawalsLog.batchRegisterId],
    references: [batchRegisters.id]
  }),
  batch: one(batches, {
    fields: [withdrawalsLog.batchId],
    references: [batches.id]
  })
}))