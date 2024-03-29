import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { MitandaButton } from "./MitandaButton"

type CustomAlertDialogProps = {
    trigger?: JSX.Element
    title: string
    description: string
    cancelText: string
    actionText: string
    onAction: () => void
    onCancel: () => void
    open: boolean
    isPending: boolean
}

const CustomAlertDialog = ({ trigger, title, description, cancelText, actionText, onAction, onCancel, open, isPending }: CustomAlertDialogProps) => {
    return (
        <AlertDialog
            open={open}
        >
            {
                trigger &&
                <AlertDialogTrigger asChild>
                    {trigger}
                </AlertDialogTrigger>
            }
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <MitandaButton variant='secondary' disabled={isPending} onClick={onCancel}>
                            {cancelText}
                        </MitandaButton>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <MitandaButton isPending={isPending} onClick={onAction}>
                            {actionText}
                        </MitandaButton>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CustomAlertDialog;