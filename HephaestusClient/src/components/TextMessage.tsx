


export default function TextMessage(props: {Text: string}){
    return (
        <div className="max-w-[60%] bg-[#6D717F] rounded-xl flex justify-center items-center px-4 py-3"> 

            <span className="block text-white primary-font whitespace-pre-wrap wrap-anywhere">
                    {props.Text}
            </span>

        </div>
    )
}