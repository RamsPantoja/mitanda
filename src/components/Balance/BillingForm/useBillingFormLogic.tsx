import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const billingValidationSchema = z
    .object({
        firstName: z.string({
            required_error: "Campo requerido"
        }).min(1, "Campo requerido"),
        lastName: z.string({
            required_error: "Campo requerido"
        }).min(1, "Campo requerido"),
        address: z.string({
            required_error: "Campo requerido"
        }).min(1, "Campo requerido"),
        city: z.string({
            required_error: "Campo requerido"
        }).min(1, "Campo requerido"),
        state: z.string({
            required_error: "Campo requerido"
        }).min(1, "Campo requerido"),
        postalCode: z.string({
            required_error: "Campo requerido"
        }).min(1, "Campo requerido"),
        clabe: z.string({
            required_error: "Campo requerido"
        }).min(1, "Campo requerido")
    })

export type BillingValidationSchema = z.infer<typeof billingValidationSchema>


const useBillingFormLogic = () => {
    const utils = api.useUtils();
    const [displayBillingForm, setDisplayBillingForm] = useState<boolean>(false);
    const useBillingForm = useForm<BillingValidationSchema>({
        resolver: zodResolver(billingValidationSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            state: '',
            postalCode: '',
            clabe: ''
        }
    });

    // const { mutate: createBatchMutation, isLoading: createBatchLoading } = api.batch.create.useMutation({
    //     onSuccess: async () => {
    //         useBillingForm.reset();
    //         setDisplayBillingForm(false);
    //         toast.success('Información de facturación agregada!');
    //         await utils.batch.ownUserBatches.invalidate();
    //     },
    //     onError: (error) => {
    //         console.log(error.message);
    //     },

    // })

    const onCreateBilling = (data: BillingValidationSchema) => {
        console.log(data);
    }

    return {
        onCreateBilling,
        useBillingForm,
        displayBillingForm,
        setDisplayBillingForm
    }
}

export default useBillingFormLogic;