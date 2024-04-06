import MessageInput from "./MessageInput";
import Messages from "./Messages";

const Chat = () => {
    return (
        <div className="flex flex-col gap-2 bg-blackNormal h-full">
            <p className="text-lg font-bold text-whiteMain"># Canal de texto</p>
            <div className=" h-full">
                <Messages />
            </div>
            <MessageInput />
        </div>
    )
}

export default Chat;