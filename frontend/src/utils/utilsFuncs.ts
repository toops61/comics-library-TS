import { comicsFields, queryResultFields } from "./interfaces";

const bodyDom = document.querySelector('body') as HTMLBodyElement;

export  const changeBodySize = () => {
    window.innerWidth < 900 ? bodyDom.style.height = window.innerHeight + 'px' : bodyDom.style.height = '';
}

export const sortComicsFunction = (array:comicsFields[]) => {
    const newArray = [...array];
    newArray.sort((a,b) => {
        if (a.serie < b.serie) {
            return -1;
        }
        else if (a.serie === b.serie) {
            const aMonth = a.year.split('/')[0];
            const aYear = a.year.split('/')[1];
            const bMonth = b.year.split('/')[0];
            const bYear = b.year.split('/')[1];
            if (aYear < bYear) {
                return -1;
            } else if (aYear === bYear) {
                return aMonth < bMonth ? -1 : 1;
            } else {
                return 1;
            }
        } else {
            return 1;
        }
    })
    return newArray;
}

//fetch function
export const queryDynamic = async () => {
    const url = `https://eu-west-2.aws.data.mongodb-api.com/app/data-vrwfj/endpoint/displayComics`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
        }
        const json = await response.json();
        const objectResult : queryResultFields = {
            message:'',
            data:json
        }
        return objectResult;
    } catch (error) {
        const message = error instanceof Error ? error.message : '';
        const objectResult : queryResultFields = {
            message,
            data:[]
        }
        return objectResult;
    }
}