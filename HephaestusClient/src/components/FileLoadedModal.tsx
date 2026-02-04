import { FileChartColumn } from "lucide-react"



export default function FileLoadedModal(props: {FileName: string, ResetFile: React.Dispatch<React.SetStateAction<File | null>>}){


    return (
        <div className="absolute w-full h-[50px] top-[-50px] bg-[#E3803B] rounded-t-lg flex justify-between items-center">

            <div className="flex justify-center items-center flex-row pl-[20px] gap-[5px]"> 
                <FileChartColumn color="#FFF" size={30}/>

                <span className="text-white">
                    {props.FileName}
                </span> 
            </div>

            <div onClick={() => props.ResetFile(null)} className="relative flex justify-left items-center">
                <span className="absolute right-[30px] w-[13px] h-[2px] rotate-[45deg] bg-white"/>
                 <span className="absolute right-[30px] w-[13px] h-[2px] rotate-[315deg] bg-white"/>
            </div>


        </div>
    )
}