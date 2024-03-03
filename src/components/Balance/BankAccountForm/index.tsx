import { Input } from "@/components/ui/input"

const BackAccountForm = ({ }) => {
    return (
        <div className="flex flex-col gap-3">
            <Input type="email" placeholder="Nombre de la tanda" />
            <Input type="email" placeholder="Cantidad de contribución (MXN)" />
            <Input type="email" placeholder="Asientos (máximo 10)" />
        </div>
    )
}

export default BackAccountForm;