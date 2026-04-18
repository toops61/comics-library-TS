import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useAppSelector } from "../redux/hooks";
import { comicsFields, displayedFields, queryResultFields } from "../utils/interfaces";
import { RootState } from "../redux/store";
import { arraySeries, getComicName, queryDynamic, sortComicsAlbums, sortComicsFunction } from "../utils/utilsFuncs";
import Arrow from "./Arrow";
import Comic from "./Comic";
import { nanoid } from "nanoid";

export default function ComicsPage() {
    const connected = useAppSelector((state:RootState) => state.generalParamsSlice.connected);

    const [comicsStored, setComicsStored] = useState<comicsFields[]>([]);

    const [arrowAppears, setArrowAppears] = useState<boolean>(false);

    const [displayedComics, setDisplayedComics] = useState<displayedFields[]>([]);

    const [serieShown, setSerieShown] = useState<string>('');
    const [comicSelected, setComicSelected] = useState<comicsFields | null>(null);

    const queryclient = useQueryClient();

    const getStoredComics = () => {
        const comicsStorage = sessionStorage.comicsStorage ? JSON.parse(sessionStorage.getItem('comicsStorage') || '') : '';
        const comicsCache = queryclient.getQueryData<queryResultFields>('comics');
        setComicsStored(comicsCache?.data.length ? comicsCache.data : comicsStorage);
        !comicsCache?.data && queryclient.fetchQuery(
            ['comics'],
            queryDynamic,{
                cacheTime: 7200000,
                staleTime: 7200000
        });
    }

    const getDisplayedComics = () => {
        const tempArray : displayedFields[] = [];                        
            
        const handleObjects = (comic:comicsFields) => {
            const serie = !arraySeries.includes(comic.serie) ? 'divers' : (comic.serie === 'batman' || comic.serie === 'justice league' ? 'DCcomics' : comic.serie);
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

    const getPreviousNext = (next:boolean) => {
        const comicsSerie = displayedComics.find(e => e.serie === serieShown)?.comics || [];
        if (comicsSerie.length > 1 && comicSelected) {
            const selectedIndex = comicsSerie.findIndex(e => e._id === comicSelected._id);
            let newIndex = 0;
            if (selectedIndex >= 0) {
                if (next) {
                    newIndex = selectedIndex < (comicsSerie.length - 2) ? (selectedIndex+1) : 0;
                } else {
                    newIndex = selectedIndex > 0 ? (selectedIndex-1) : (comicsSerie.length - 1);
                }
            }
            setComicSelected(comicsSerie[newIndex]);
        }
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
            getDisplayedComics();
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
            <button className="change-page previous" onClick={() => getPreviousNext(false)}></button>            
            <div className="fullscreen-container">
                <img src={comicSelected.coverURL} alt={comicSelected.serie+comicSelected.album} />
            </div>
            <button className="change-page next" onClick={() => getPreviousNext(true)}></button>
        </div> : null}
        <section className="comics-container">
            {displayedComics.map(serie => {
                return (
                    serieShown === serie.serie ? <div className="comics-selected" key={nanoid()}>
                        {serie.comics.map((comic:comicsFields) => <Comic key={nanoid()} comic={comic} setFullscreen={setFullscreen} />)}
                        <div className="close-window" onClick={() => setSerie('')}></div>
                    </div> : 
                    <div className="serie-container" key={nanoid()} onClick={() => setSerie(serie.serie)} tabIndex={0}>
                        <div className="image-serie-container">
                            <img src={`./images/${serie.serie}.webp`} alt={serie.serie} />
                        </div>
                        <h3>{getComicName(serie.serie)}</h3>
                    </div>
                )
            })}
        </section>
        {arrowAppears ? <Arrow /> : <></>}
    </main>
  )
}
