import { SearchX } from "lucide-react";

interface Props{

title:string;

description:string;

}

export function EmptyState({

title,

description

}:Props){

return(

<div className="flex flex-col items-center py-20">

<SearchX className="w-14 h-14 text-muted-foreground"/>

<h3 className="mt-4 text-xl font-semibold">

{title}

</h3>

<p className="text-muted-foreground">

{description}

</p>

</div>

)

}