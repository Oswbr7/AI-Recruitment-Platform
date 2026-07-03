import {
useAuth
}
from "../auth/AuthContext";


export default function Dashboard()
{


const auth = useAuth();



return (

<div>

<h1>
Dashboard
</h1>


<p>
Usuario autenticado
</p>


<button
onClick={auth.logout}
>
Cerrar sesión
</button>


</div>

);


}