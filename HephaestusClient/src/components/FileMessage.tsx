import {File} from "lucide-react"

export default function FileMessage(props: {File : File | undefined}){

    return (
        <div className="max-w-[60%] bg-[#6D717F] rounded-xl flex justify-center items-center px-4 py-3 gap-[5px]"> 
            <File color="#E3803B"/>
            <span className="block text-white primary-font whitespace-pre-wrap wrap-anywhere">
                        {props.File?.name}
            </span>
        </div>
    )
}