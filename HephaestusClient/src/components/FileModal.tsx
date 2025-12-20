import { Paperclip } from "lucide-react"
import {useRef} from "react"

export default function FileModal(props: {IsOpen: Boolean, SetFile: React.Dispatch<React.SetStateAction<File | null>>}){
    const inputRef = useRef<HTMLInputElement>(null);

    if (!props.IsOpen){
        return
    }

    return (
        <ul className="relative top-[min(-80px,-11vh)] left-[50px] min-w-[125px] h-[16vh] rounded-xl bg-white"> 

            <li className="flex justify-center items-center w-full h-1/3 border-1 border-green rounded-t-xl primary-font gap-[5px]">
                <Paperclip size={20}/>
                <span> Add Files</span>
                <input type="file" 
                       className="absolute w-full h-full bg-transparent border-0 outline-none ring-0 appearance-none text-transparent"
                       accept=".xlsx,.xls,.csv"
                       onClick={() => {inputRef.current?.click()}}
                       onChange={(e) => {
                        const MyFile: File | null = e.currentTarget.files?.[0] ?? null;
                        props.SetFile(MyFile)
                    }}
                    ref={inputRef}
                />
            </li>

            <li className="flex justify-center items-center w-full border-x-1 border-y-0 border-green h-1/3 primary-font"> 
                <a href="https://www.youtube.com/watch?v=Ubxu_OTfh5o"> Se Moledoi </a>

            </li>

            <li className="flex justify-center items-center w-full border-1 border-green h-1/3 rounded-b-xl primary-font"> 
                <a href="https://www.youtube.com/watch?v=Ubxu_OTfh5o" className=""> Imagina Duro </a>

            </li>

        </ul>
    )

}