const Message = ({txt, score, date}) => {

    return (
        <div className="bg-blue-500 w-4/6 text-white text-right px-2 m-2 rounded-md">
            <span>{txt}</span><br/>
            <div className="flex flex-row justify-between"> 
                <span>{score}</span>
                <span className="text-gray-200 text-sm">{date}</span>
            </div>
        </div>
    )
}

export default Message