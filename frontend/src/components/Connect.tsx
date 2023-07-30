import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { alertProps, connectedFields, userFields } from "../utils/interfaces";
import { updateGeneralParams } from "../redux/generalParamsSlice";
import { useAppDispatch } from "../redux/hooks";

export default function Connect(props:alertProps) {
    const [userObject, setUserObject] = useState<userFields>({
        email:'',
        password:''
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleChange : ((e:ChangeEvent) => void) = e => {
        const tempObject = {...userObject};
        const target = e.target as HTMLInputElement;
        tempObject[target.name] = target.value;
        setUserObject({...tempObject});
    }

    const fetchPost = async () => {
        const url = 'http://localhost:8000/login';

        const request = {
            method: 'POST',
            body: JSON.stringify(userObject),
            headers: {
            "Content-Type": "application/json"
            }
        };
        try {
            const response = await fetch(url, request);
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`)
            }
            const json = await response.json();
            const email = json.data.email;
            const userLogged:connectedFields = {
                id: json.data._id,
                email: email,
                token: json.token
            }
            dispatch(updateGeneralParams({connected:true}));
            props.showAlert(json.message,'valid');
            return userLogged;
        } catch (error) {
            console.log(error);
            const message = error instanceof Error ? error.message : '';
            props.showAlert(message,'alert');
        }
    }
  
    const { isLoading,refetch,data } = useQuery(['user'],
    fetchPost,{
        enabled: false,
        cacheTime: 1800000,
        staleTime: 1800000
    })

    data?.token && setTimeout(() => {
        navigate("/comics");
    }, 1000);

    //API fetch requete POST pour formulaire
    const connectSubmit : ((e:FormEvent) => void) = e => {
        e.preventDefault();
        if (userObject.email && userObject.password) refetch();
    }

    useEffect(() => {
    dispatch(updateGeneralParams({isLoading}));
  }, [isLoading])

  return (
    <main className="connect-page">
        <Link className="back" to="/"></Link>
        <form className='connect-container'>
            <div className='user-inputs' tabIndex={0}>
                <label htmlFor='email'>Mail</label>
                <input type='text' name='email' max='50' onChange={handleChange} value={userObject.email} required />
            </div>
            <div className='user-inputs' tabIndex={0}>
                <label htmlFor='password'>Mot de passe</label>
                <input type='password' name='password' max='50' onChange={handleChange} value={userObject.password} required />
            </div>
            <div className="buttons-container">
                {/* <button onClick={subscribeSubmit}>Créer</button> */}
                <button onClick={connectSubmit}>Connecter</button>
                {/* <button onClick={subscribeCall}>inscription</button> */}
            </div>
        </form>
    </main>
  )
}
