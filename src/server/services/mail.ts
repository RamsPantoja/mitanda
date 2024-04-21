import { Resend } from 'resend';
import { type TRPCContext } from "../trpc";
import { env } from '@/env';

type MailServiceContructor = {
    ctx: TRPCContext
}

type SendInput = {
    to: string[]
    from: string
    subject: string
    html: string
}

class MailService {
    ctx: TRPCContext
    resend: Resend

    constructor({ ctx }: MailServiceContructor) {
        this.ctx = ctx;
        this.resend = new Resend(env.RESEND_KEY);
    }

    public async send(input: SendInput) {
        await this.resend.emails.send({
            from: input.from,
            to: input.to,
            subject: input.subject,
            html: input.html
        });
    }
}

export default MailService;