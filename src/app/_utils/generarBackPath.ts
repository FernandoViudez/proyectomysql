
export let obtenerPath = () => {
    
    let url: string;

    if (window.location.hostname == 'http://localhost:4200/') {
        url = "http://localhost:8080/api/";
    } else {
        url = "http://pcweb:8080/api/";
    }

    return url;
}

