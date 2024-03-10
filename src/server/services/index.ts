import { type NeonDatabase } from "drizzle-orm/neon-serverless";
import BatchService from "./batch";
import { type Session } from "next-auth";
import { type DrizzleSchema } from "../db";
import UserService from "./user";
import AccountService from "./account";
import ContractService from "./contract";
import SessionService from "./session";

export type ServicesContext = {
    batchService: BatchService
    usersService: UserService
    accountService: AccountService
    contractService: ContractService
    sessionService: SessionService
}

export type ServicesConfig = {
    db: NeonDatabase<DrizzleSchema>
    session: Session | null
}

const Services = ({ db, session }: ServicesConfig): ServicesContext => {
    return {
        batchService: new BatchService({ db, session }),
        usersService: new UserService({ db, session }),
        accountService: new AccountService({ db, session }),
        contractService: new ContractService({ db, session }),
        sessionService: new SessionService({ db, session })
    }
}
export default Services;