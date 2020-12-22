const Message = ({txt, score, date, userMsg=true}) => {  
    
    const emoji = score > 0.55 ? 
        (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
            </svg>
        )
    
    const side = userMsg ? "float-right" : "float-left";

    return (
        <div className={"bg-blue-500 w-4/6 text-white text-right px-2 m-2 rounded-md " + side}>
            <span>{txt}</span><br/>
            <div className="flex flex-row justify-between"> 
                <div className="w-8 -mt-4">{emoji}</div>
                <span className="text-gray-200 text-sm">{date}</span>
            </div>
        </div>
    )
}

export default Message