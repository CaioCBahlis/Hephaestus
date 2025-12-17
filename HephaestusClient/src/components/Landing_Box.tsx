

export default function LandingBox(props: {Icon: JSX.Element, title: string, description: string}) {

    return (

       
        <div className='w-full h-[min(140px,9vh)] rounded-md bg-[#24150E] border-1 border-[#3E1B12] flex items-center'>

            <div className="bg-[#342417] w-[48px] h-[40px] rounded-full ml-2 flex justify-center items-center">
                {props.Icon}

            </div>


             <div className="w-full justify-center items-center justify-between text-center flex flex-col primary-font">

                <h2 className="text-white font-bold text-[13px]">  {props.title} </h2>

                <p className="w-[85%] font-light secondary-color text-[10px]"> {props.description} </p>



            </div>
           

        </div>

    )

}