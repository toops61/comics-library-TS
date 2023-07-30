import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { useQueryClient } from "react-query";
import { useAppSelector } from "../redux/hooks";
import { comicsFields, displayedFields, queryResultFields } from "../utils/interfaces";
import { RootState } from "../redux/store";
import { queryDynamic, sortComicsFunction } from "../utils/utilsFuncs";
import Arrow from "./Arrow";
import Comic from "./Comic";

export default function ComicsPage() {
    const connected = useAppSelector((state:RootState) => state.generalParamsSlice.connected);

    const [comicsStored, setComicsStored] = useState<comicsFields[]>([]);

    const [arrowAppears, setArrowAppears] = useState<boolean>(false);

    const [displayedComics, setDisplayedComics] = useState<displayedFields[]>([]);

    const [serieShown, setSerieShown] = useState<string>('');
    const [comicSelected, setComicSelected] = useState<comicsFields | null>(null);

    const sortComicsAlbums = (array:comicsFields[]) => {
        const newArray = [...array];
        newArray.sort((a,b) => a.album < b.album ? -1 : 1);
        return newArray;
    }

    const queryclient = useQueryClient();

    const getStoredComics = () => {
        const comicsStorage = sessionStorage.comicsStorage ? JSON.parse(sessionStorage.getItem('comicsStorage') || '') : '';
        const comicsCache = queryclient.getQueryData<queryResultFields>('comics');
        setComicsStored(comicsCache?.data.length ? comicsCache : comicsStorage);
        !comicsCache?.data && queryclient.fetchQuery(
            ['comics'],
            queryDynamic,{
                cacheTime: 7200000,
                staleTime: 7200000
        });
    }
    
    useEffect(() => {

        getStoredComics();

        sessionStorage.serieShown && setSerieShown(sessionStorage.getItem('serieShown') || '');

        const windowScroll = () => setArrowAppears(window.scrollY > 500 ? true : false);

        window.addEventListener('scroll', windowScroll);

        return () => {
        window.removeEventListener('scroll', windowScroll)
        }
    },[])

    useEffect(() => {
        if (comicsStored?.length) {
            const tempArray : displayedFields[] = [];

            const arraySeries = ["strange","special strange","origines","spidey","saga","nova","titans","hulk","fantastiques","araignee","xmen","avengers"];
            
            const handleObjects = (comic:comicsFields) => {
                const serie = !arraySeries.includes(comic.serie) ? 'divers' : comic.serie;
                const objectIndex = tempArray.findIndex(object => object.serie === serie);
                
                objectIndex !== -1 ? tempArray[objectIndex].comics.push(comic) : 
                    tempArray.push({
                        serie,
                        comics: [comic]
                    });
            }
            comicsStored.map(comic => handleObjects(comic));
            
            setDisplayedComics(tempArray.map(e => {
                return {...e,comics:e.serie === 'hulk' ? sortComicsAlbums(e.comics) : sortComicsFunction(e.comics)}
            }));
        }
    }, [comicsStored])

    const setFullscreen = (comic:comicsFields|null) => {
        setComicSelected(comic);
    }

    const setSerie = (serie:string) => {
        setSerieShown(serie);
        serie ? sessionStorage.setItem('serieShown',serie) : delete sessionStorage.serieShown;
    }

    return (
    <main className="comics-main">
        <Link className="back" to="/"></Link>
        <h1 tabIndex={0}>Comics</h1>
        {connected ? <Link to="/createComic">
            <button className="color-button">Ajouter un comic</button>
        </Link> : <></>
        }
        {comicSelected ? <div className="comic-fullscreen">
            <div className="close-window" onClick={() => setFullscreen(null)}></div>
            <div className="fullscreen-container">
                <img src={comicSelected.coverURL} alt={comicSelected.serie+comicSelected.album} />
            </div>
        </div> : null}
        <section className="comics-container">
            {displayedComics.map(serie => {
                return (
                    serieShown === serie.serie ? <div className="comics-selected" key={uuidv4()}>
                        {serie.comics.map((comic:comicsFields) => <Comic key={uuidv4()} comic={comic} setFullscreen={setFullscreen} />)}
                        <div className="close-window" onClick={() => setSerie('')}></div>
                    </div> : 
                    <div className="serie-container" key={uuidv4()} onClick={() => setSerie(serie.serie)} tabIndex={0}>
                        <div className="image-serie-container">
                            <img src={`/comics_library/images/${serie.serie}.webp`} alt={serie.serie} />
                        </div>
                        <h3>{serie.serie}</h3>
                    </div>
                )
            })}
        </section>
        {arrowAppears ? <Arrow /> : <></>}
    </main>
  )
}
