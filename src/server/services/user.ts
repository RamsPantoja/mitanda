import { type users } from "../db/schema";
import { type TRPCContext } from "../trpc";

type UserServiceContructor = {
    ctx: TRPCContext
}

export type User = typeof users.$inferSelect;

class UserService {
    ctx: TRPCContext

    constructor({ ctx }: UserServiceContructor) {
        this.ctx = ctx;
    }

    async create(data: number) {
        return data;
    }
}

export default UserService;