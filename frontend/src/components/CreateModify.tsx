import { ChangeEvent, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { alertProps, comicsFields, objectResultFields, queryResultFields } from "../utils/interfaces";
import { NewComic } from "../utils/classes";
import { categoriesArray, firstLetterUpper, subCategoriesArray } from "../utils/utilsFuncs";
import { handleRefresh } from "../utils/fetchFuncs";

export default function CreateModify({showAlert}:{showAlert:alertProps}) {
    const initComic = new NewComic('','strange','','01/1960','','');

    const [newComic, setNewComic] = useState(initComic);
    
    const queryclient = useQueryClient();

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
        const url = `https://comics-library-api.onrender.com/${fetchType}`;
        let method = 'POST';

        if (newComic._id) {
            method = fetchType === 'deleteComic' ? 'DELETE' : 'PUT';
        }

        const request = {
            method,
            body: JSON.stringify(newComic),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include" as RequestCredentials
        };
        try {
            let response = await fetch(url, request);
            
            // if access token checks failed
            if (response.status === 401) {
                const refreshResponse = await handleRefresh();

                if (!refreshResponse) return {success:false,message:'Vous devez vous reconnecter ...'};

                response = await fetch(url, request);
            }
            
            if (!response.ok) {
                const json : objectResultFields = await response.json();
                throw new Error(`Erreur HTTP : ${response.status}${json?.message ? (', ' + json.message) : ''}`)
            }

            const json : objectResultFields = await response.json();
            showAlert(json.message,'valid');
            setTimeout(() => {
                navigate("/comics");
            }, 1900);
            return json;
        } catch (error) {
            console.log(error);
            const message = error instanceof Error ? error.message : '';
            showAlert(message,'alert');
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
        oldComicIndex === -1 ? previous.push(newData.data!) : previous.splice(oldComicIndex,1,newComic);

        sessionStorage.setItem('comicsStorage',JSON.stringify(previous));
        
        const newObject = {message:'',data:previous};
        return newObject;
    }
    
    const { mutate:updateComic } = useMutation(() => comicFetch(newComic._id ? 'updatecomic' : 'newcomic'), {
        onSuccess: data => {
            if (data?.success && data.data) queryclient.setQueryData('comics',() => updateArray(data));
        }
    });
    
    const onSubmit : ((e:React.MouseEvent<HTMLButtonElement>) => void) = e => {
        e.preventDefault();
        updateComic();
    }

    const deleteOne = () => {
        const comicsCache = queryclient.getQueryData<queryResultFields>('comics');
        const previousArray : comicsFields[] = comicsCache?.data || [];
        //copy previous array
        const previous = previousArray.map(comic => ({...comic}));
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
            if (data?.success && data.data) queryclient.setQueryData('comics',() => deleteOne());
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
                    {categoriesArray.map((field,index) => <option key={field.valueField+index} value={field.valueField}>{field.nameField || firstLetterUpper(field.valueField)}</option>)}
                </select>
            </div>
            <div className='comics-inputs' tabIndex={0}>
                <label htmlFor='sub_category'>Sous- catégorie</label>
                <select name='sub_category' id='sub_category' onChange={handleChange} value={newComic.sub_category}>
                    {subCategoriesArray.map((field,index) => <option key={field.valueField+index} value={field.valueField}>{field.nameField || firstLetterUpper(field.valueField)}</option>)}
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
