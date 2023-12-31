import { ChangeEvent, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { alertProps, comicsFields, connectedFields, objectResultFields, queryResultFields } from "../utils/interfaces";
import { NewComic } from "../utils/classes";

export default function CreateModify(props:alertProps) {
    const initComic = new NewComic('','strange','01/1960','','');

    const [newComic, setNewComic] = useState(initComic);
    
    const queryclient = useQueryClient();
    const user = queryclient.getQueryData<connectedFields>('user');

    const navigate = useNavigate();

    const handleChange : ((e:ChangeEvent) => void) = e => {
        
        const tempObject = {...newComic};
        const target = e.target as HTMLInputElement;
        tempObject[target.name] = target.value;
        setNewComic(tempObject);
    }

    useEffect(() => {
        sessionStorage.modifiedComic && setNewComic({...JSON.parse(sessionStorage.getItem('modifiedComic') || '')});
        delete sessionStorage.modifiedComic;
    }, [])
    

    const comicFetch = async (fetchType:string) => {
        const token = user?.token;
        const url = `http://localhost:8000/${fetchType}`;
        const request = {
            method: newComic._id ? (fetchType === 'deleteComic' ? 'DELETE' : 'PUT') : 'POST',
            body: JSON.stringify(newComic),
            headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
            }
        };
        try {
            const response = await fetch(url, request);
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`)
            }
            const json : objectResultFields = await response.json();
            props.showAlert(json.message,'valid');
            setTimeout(() => {
                navigate("/comics");
            }, 1900);
            return json;
        } catch (error) {
            console.log(error);
            const message = error instanceof Error ? error.message : '';
            props.showAlert(message,'alert');
        }
    }

    const updateArray = (newData:objectResultFields) => {
        //get cache comics array
        const comicsCache = queryclient.getQueryData<queryResultFields>('comics');
        
        const previousArray : comicsFields[] = comicsCache?.data ? comicsCache?.data : [];

        //copy previous
        const previous = previousArray.map(comic => {return{...comic}});
        const oldComicIndex = previous.findIndex(comic => comic._id === newComic._id);

        //copy new one or update previous
        oldComicIndex === -1 ? previous.push(newData.data) : previous.splice(oldComicIndex,1,newComic);

        sessionStorage.setItem('comicsStorage',JSON.stringify(previous));
        
        const newObject = {message:'',data:previous};
        return newObject;
    }
    
    const { mutate:updateComic } = useMutation(() => comicFetch(newComic._id ? 'updatecomic' : 'newcomic'), {
        onSuccess: (data) => {
            data?.data && queryclient.setQueryData('comics',() => updateArray(data));
        }
    });
    
    const onSubmit : ((e:React.MouseEvent<HTMLButtonElement>) => void) = e => {
        e.preventDefault();
        updateComic();
    }

    const deleteOne = () => {
        const comicsCache = queryclient.getQueryData<queryResultFields>('comics');
        const previousArray : comicsFields[] = comicsCache?.data ? comicsCache?.data : [];
        //copy previous array
        const previous = previousArray.map(comic => {return{...comic}});
        //delete comic object from cache array
        const oldComicIndex = previous.findIndex(comic => comic._id === newComic._id);
        oldComicIndex !== -1 && previous.splice(oldComicIndex,1);

        //update storage
        sessionStorage.setItem('comicsStorage',JSON.stringify(previous));

        const newObject = {message:'',data:previous};
        return newObject;
    }

    const { mutate:deleteComic } = useMutation(() => comicFetch('deleteComic'), {
        onSuccess: (data) => {
            data?.message && queryclient.setQueryData('comics',() => deleteOne());
        }
    });

    const onDelete : ((e:React.MouseEvent<HTMLButtonElement>) => void) = e => {
        e.preventDefault();
        window.confirm('Effacer le comic ?') && deleteComic();
    }

  return (
    <main className="create-page">
        <Link className="back" to="/"></Link>
        <form className='create-container'>
            <div className='comics-inputs' tabIndex={0}>
                <label htmlFor='album'>Album</label>
                <input type='text' name='album' max='50' onChange={handleChange} value={newComic.album} required />
            </div>
            <div className='comics-inputs' tabIndex={0}>
                <label htmlFor='serie'>Série</label>
                <select name='serie' id='serie' onChange={handleChange} value={newComic.serie}>
                    <option value="strange">Strange</option>
                    <option value="spidey">Spidey</option>
                    <option value="special strange">Special Strange</option>
                    <option value="origines">Strange Special Origines</option>
                    <option value="titans">Titans</option>
                    <option value="nova">Nova</option>
                    <option value="saga">Saga</option>
                    <option value="hulk">Hulk</option>
                    <option value="fantastiques">Les Quatre Fantastiques</option>
                    <option value="araignee">L'Araignée</option>
                    <option value="xmen">Les X-Men</option>
                    <option value="marvel classic">Marvel classic</option>
                    <option value="avengers">Les Vengeurs</option>
                    <option value="special">Spécial</option>
                    <option value="DCcomics">DC Comics</option>
                    <option value="autre">Autre</option>
                </select>
            </div>
            <div className='comics-inputs' tabIndex={0}>
                <label htmlFor='year'>Parution</label>
                <input type='text' name='year' min='1945' max='2050' onChange={handleChange} value={newComic.year} required />
            </div>
            <div className='comics-inputs' tabIndex={0}>
                <label htmlFor='coverURL'>Image</label>
                <input type='text' name='coverURL' max='100' onChange={handleChange} value={newComic.coverURL} required />
            </div>
            <div className='comics-inputs' tabIndex={0}>
                <label htmlFor='bedetheque'>Infos</label>
                <input type='text' name='bedetheque' max='100' onChange={handleChange} value={newComic.bedetheque} />
            </div>
            <div className="buttons-container">
                <button onClick={onSubmit}>{newComic._id ? 'Modifier' : 'Créer'}</button>
                <button onClick={onDelete} className="delete-button">effacer</button>
            </div>
        </form>
    </main>
  )
}
