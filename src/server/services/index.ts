import BatchService from "./batch";
import UserService from "./user";
import AccountService from "./account";
import ContractService from "./contract";
import SessionService from "./session";
import StripeService from "./stripe";
import UserToBatchService from "./userToBatch";
import { type TRPCContext } from "../trpc";

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
    ctx: TRPCContext
}

const Services = ({ ctx }: ServicesConfig): ServicesContext => {
    return {
        batchService: new BatchService({ ctx }),
        usersService: new UserService({ ctx }),
        accountService: new AccountService({ ctx }),
        contractService: new ContractService({ ctx }),
        sessionService: new SessionService({ ctx }),
        stripeService: new StripeService({ ctx }),
        userToBatch: new UserToBatchService({ ctx })
    }
}
export default Services;