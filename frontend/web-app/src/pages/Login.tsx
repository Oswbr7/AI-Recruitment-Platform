import {
useState
}
from "react";

import api from "../api/axios";

import {
useAuth
}
from "../auth/AuthContext";



export default function Login()
{


const auth = useAuth();


const [email,setEmail]=useState("");

const [password,setPassword]=useState("");



async function submit()
{

const response =
await api.post(
"/auth/login",
{
email,
password
}
);


auth.login(
response.data.accessToken
);


window.location.href="/dashboard";

}



return (

<div>

<h1>
Login
</h1>


<input
placeholder="email"
value={email}
onChange={
e=>setEmail(e.target.value)
}
/>


<input
placeholder="password"
type="password"
value={password}
onChange={
e=>setPassword(e.target.value)
}
/>


<button
onClick={submit}
>
Entrar
</button>


</div>

);


}