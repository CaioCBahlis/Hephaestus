import { Paperclip } from "lucide-react"
import {useRef} from "react"

export default function FileModal(props: {IsOpen: Boolean, SetFile: React.Dispatch<React.SetStateAction<File | null>>, setModal: any}){
    const inputRef = useRef<HTMLInputElement>(null);

    if (!props.IsOpen){
        return
    }

    return (
        <ul className="relative top-[min(-60px,-7vh)] left-[50px] min-w-[125px] h-[8vh] rounded-xl bg-white"> 

            <li className="flex justify-center items-center w-full h-full border-1 border-green rounded-t-xl primary-font gap-[5px]">
                <Paperclip size={20}/>
                <span> Add Files</span>
                <input type="file" 
                       className="absolute w-full h-full bg-transparent border-0 outline-none ring-0 appearance-none text-transparent"
                       accept=".xlsx,.xls,.csv"
                       onClick={() => {inputRef.current?.click()}}
                       onChange={(e) => {
                        const MyFile: File | null = e.currentTarget.files?.[0] ?? null;
                        props.SetFile(MyFile)
                        props.setModal(false)
                    }}
                    ref={inputRef}
                />
            </li>

        </ul>
    )
}