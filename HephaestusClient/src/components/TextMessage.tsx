import ReactMarkdown from "react-markdown";



export default function TextMessage(props: {Text: string}){
    return (
        <div className="max-w-[60%] bg-[#6D717F] rounded-xl flex justify-center items-center px-4 py-3"> 

            <div className="block text-white primary-font whitespace-pre-wrap wrap-anywhere">
                   <ReactMarkdown>{props.Text}</ReactMarkdown>
            </div>

        </div>
    )
}