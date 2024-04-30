import BatchService from "./batch";
import UserService from "./user";
import AccountService from "./account";
import ContractService from "./contract";
import SessionService from "./session";
import StripeService from "./stripe";
import UserToBatchService from "./userToBatch";
import { type TRPCContext } from "../trpc";
import BatchContributionService from "./batchContribution";
import BatchRegisterService from "./batchRegister";
import BatchRequestService from "./batchRequest";
import MailService from "./mail";
import NotificationService from "./notification";


export type ServicesContext = {
    batchService: BatchService
    usersService: UserService
    accountService: AccountService
    contractService: ContractService
    sessionService: SessionService
    stripeService: StripeService
    userToBatch: UserToBatchService
    batchContribution: BatchContributionService
    batchRegisterService: BatchRegisterService
    batchRequestService: BatchRequestService
    mailService: MailService
    notificationService: NotificationService
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
        userToBatch: new UserToBatchService({ ctx }),
        batchContribution: new BatchContributionService({ ctx }),
        batchRegisterService: new BatchRegisterService({ ctx }),
        batchRequestService: new BatchRequestService({ ctx }),
        mailService: new MailService({ ctx }),
        notificationService: new NotificationService({ ctx })
    }
}

export default Services;