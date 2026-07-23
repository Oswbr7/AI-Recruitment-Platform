import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface Props{

value:string;

onChange:(value:string)=>void;

placeholder?:string;

}

export function SearchInput({

value,

onChange,

placeholder

}:Props){

return(

<div className="relative">

<Search className="absolute left-3 top-3 h-4 w-4"/>

<Input

className="pl-9"

placeholder={placeholder}

value={value}

onChange={e=>onChange(e.target.value)}

/>

</div>

)

}