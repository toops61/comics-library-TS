import { categoriesArrayType, comicsFields, queryResultFields } from "./interfaces";

const bodyDom = document.querySelector('body') as HTMLBodyElement;

export const categoriesArray : categoriesArrayType[] = [
    {
        valueField: 'strange',
        nameField: ''
    },
    {
        valueField: 'spidey',
        nameField: ''
    },
    {
        valueField: 'special strange',
        nameField: ''
    },
    {
        valueField: 'origines',
        nameField: 'Strange Special Origines'
    },
    {
        valueField: 'titans',
        nameField: ''
    },
    {
        valueField: 'nova',
        nameField: ''
    },
    {
        valueField: 'saga',
        nameField: ''
    },
    {
        valueField: 'hulk',
        nameField: ''
    },
    {
        valueField: 'fantastiques',
        nameField: 'Les Quatre Fantastiques'
    },
    {
        valueField: 'spider-man',
        nameField: 'Spider-Man'
    },
    {
        valueField: 'xmen',
        nameField: 'Les X-Men'
    },
    {
        valueField: 'marvel classic',
        nameField: ''
    },
    {
        valueField: 'avengers',
        nameField: 'Les Vengeurs'
    },
    {
        valueField: 'special',
        nameField: 'Spécial'
    },
    {
        valueField: 'DCcomics',
        nameField: 'DC Comics'
    },
    {
        valueField: 'autre',
        nameField: ''
    }
]
export const subCategoriesArray : categoriesArrayType[] = [
    {
        valueField: 'none',
        nameField: 'Aucune'
    },
    {
        valueField: 'batman',
        nameField: ''
    },
    {
        valueField: 'justice league',
        nameField: ''
    },
    {
        valueField: 'star wars',
        nameField: ''
    },
    {
        valueField: 'cote obscur',
        nameField: 'Le côté obscur'
    }
]

export const arraySeries = ["strange","special strange","origines","spidey","saga","nova","titans","hulk","fantastiques","spider-man","xmen","avengers","DCcomics","batman","justice league"];

export  const changeBodySize = () => {
    window.innerWidth < 900 ? bodyDom.style.height = window.innerHeight + 'px' : bodyDom.style.height = '';
}

export const sortComicsFunction = (array:comicsFields[]) => {
    const newArray = [...array];
    newArray.sort((a,b) => {
        if (a.serie < b.serie) {
            return -1;
        } else if (a.serie > b.serie) {
            return 1;
        } else {
            if (a.sub_category! < b.sub_category!) {
                return -1;
            } else if (a.sub_category! > b.sub_category!) {
                return 1;
            } else {
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
            }
        }
    })
    return newArray;
}

export const sortComicsAlbums = (array:comicsFields[]) => {
    const newArray = [...array];
    newArray.sort((a,b) => a.album < b.album ? -1 : 1);
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
        //console.log(json);
        
        const objectResult : queryResultFields = {
            message:'',
            data:json
        }
        if (objectResult.data.length && "album" in objectResult.data[0]) {
            objectResult.data = objectResult.data.map(comic => ({...comic,sub_category:comic.sub_category ?? ''}));
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

export const firstLetterUpper = (text:string) => {
    const arrayWords = text.split(' ');
    const changeFirst = (word:string) => {
        const wordArray = word.split('');
        wordArray.splice(0,1,wordArray[0].toUpperCase());
        return wordArray.join('');
    }
    return arrayWords.map(word => changeFirst(word)).join(' ');
}

export const getComicName = (valueField:string) => {
    const allCategoriesArray = categoriesArray.concat(subCategoriesArray);
    const categoryFound = allCategoriesArray.find(category => category.valueField === valueField);
    const resultName = categoryFound ? (categoryFound.nameField || firstLetterUpper(categoryFound.valueField)) : valueField;
    return resultName;
}