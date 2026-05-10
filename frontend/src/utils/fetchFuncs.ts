import { alertProps, queryResultFields } from "./interfaces";

//fetch function
export const queryDynamic = async () => {
    const url = `https://comics-library-api.onrender.com/comics`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`)
        }
        const json : queryResultFields = await response.json();
        //console.log(json);
        
        if (json.data.length && "album" in json.data[0]) {
            json.data = json.data.map(comic => ({...comic,sub_category:comic.sub_category ?? ''}));
        }
        return json;
    } catch (error) {
        const message = error instanceof Error ? error.message : '';
        const objectResult : queryResultFields = {
            message,
            data:[]
        }
        return objectResult;
    }
}

export const disconnectUser = async (showAlert:alertProps) => {
        const url = 'https://comics-library-api.onrender.com/logout';

        const request = {
            method: 'POST',
            headers: {
            "Content-Type": "application/json"
            },
            credentials: "include" as RequestCredentials
        };
        try {
            const response = await fetch(url, request);
            if (!response.ok) {
                throw new Error(`Erreur de déconnexion : ${response.status}`)
            }
            const json = await response.json();            
            return json;
        } catch (error) {
            console.log(error);
            const message = error instanceof Error ? error.message : '';
            showAlert(message,'alert');
        }
    };

export const handleRefresh = async () => {
    const url = 'https://comics-library-api.onrender.com/refresh';

    const request = {
        method: 'POST',
        headers: {
        "Content-Type": "application/json"
        },
        credentials: "include" as RequestCredentials
    };
    
    try {
        const response = await fetch(url, request);

        if (!response.ok) {
            throw new Error(`Erreur de reconnexion : ${response.status}`)
        }
        return response.ok;
    } catch (error) {
        console.log(error);
    }
}

export const checkConnection = async () => {
    const url = `https://comics-library-api.onrender.com/check`;

    const request = {
        method:'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include" as RequestCredentials
    };
    try {
        const response = await fetch(url, request);
        if (!response.ok) {
            throw new Error(`Erreur de connexion : ${response.status}`)
        }
        const json = await response.json();            
        return json;
    } catch (error) {
        console.log(error);
        const message = error instanceof Error ? error.message : '';
        return { success:false,message };
    }
}