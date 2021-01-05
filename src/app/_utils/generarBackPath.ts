
export let obtenerPath = () => {
    
    let url: string;
 
    if (window.location.hostname == 'revestadt.sytes.net') {
        url = "http://pcweb:8083/api/";
    } else {
        url = "http://localhost:8080/api/";
    }

    return url;
}

