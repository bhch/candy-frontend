import axios from 'axios';


export var BASE_API_URL;

if (process.env.NODE_ENV === 'production') {
    BASE_API_URL = window.candy.base_api_url || '/candy/api/v1/';
} else {
    BASE_API_URL = 'http://localhost:8000/candy/api/v1/';
}


const API_ENDPOINTS = {
    init: BASE_API_URL + 'init/',

    login: BASE_API_URL + 'login/',
    logout: BASE_API_URL + 'logout/',

    home: BASE_API_URL + 'home/',
};


export default class API {
    constructor(name) {
        this.endpoint = BASE_API_URL + name + '/';
    }

    createEntity(data, queryString) {
        let promise = new Promise((resolve, reject) => {
            axios.post(this.endpoint + '?' + queryString, data)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
        
        return promise;
    }

    deleteEntity(id, queryString) {
        return axios.delete(this.endpoint + id + '/?' + queryString);
    }

    updateEntity(id, data, queryString) {
        return axios.patch(this.endpoint + id + '/?' + queryString, data);
    }

    getList(queryString) {
        if (queryString === undefined)
            queryString = '';

        return axios.get(this.endpoint + '?' + queryString);
    }

    getOne(id, queryString) {
        if (queryString === undefined)
            queryString = '';

        let promise = new Promise((resolve, reject) => {
            axios.get(this.endpoint + id + '/?' + queryString)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });

        return promise;
    }
}