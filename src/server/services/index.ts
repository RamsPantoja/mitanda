import { type NeonDatabase } from "drizzle-orm/neon-serverless";
import BatchService from "./batch";
import { type DrizzleSchema } from "../db";
import UserService from "./user";
import AccountService from "./account";
import ContractService from "./contract";
import SessionService from "./session";
import StripeService from "./stripe";
import UserToBatchService from "./userToBatch";

export type ServicesContext = {
    batchService: BatchService
    usersService: UserService
    accountService: AccountService
    contractService: ContractService
    sessionService: SessionService,
    stripeService: StripeService
    userToBatch: UserToBatchService
}

export type ServicesConfig = {
    db: NeonDatabase<DrizzleSchema>
}

const Services = ({ db }: ServicesConfig): ServicesContext => {
    return {
        batchService: new BatchService({ db }),
        usersService: new UserService({ db }),
        accountService: new AccountService({ db }),
        contractService: new ContractService({ db }),
        sessionService: new SessionService({ db }),
        stripeService: new StripeService({ db }),
        userToBatch: new UserToBatchService({ db })
    }
}
export default Services;