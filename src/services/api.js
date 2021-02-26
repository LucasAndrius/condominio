const baseUrl = 'https://api.b7web.com.br/devcond/api/admin';

const request = async( method, endpoint, params, token = null) =>{
    method = method.toLowerCase();
    let fullUrl = `${baseUrl}${endpoint}`;  //montando url
    let body = null;

    switch(method){
        case 'get':
            let queryString = new URLSearchParams(params) .toString();
            fullUrl += `?${queryString}`;
        break;
        case 'post':
        case 'put':
        case 'delete':
            body = JSON.stringify(params);  //transforma o objeto em string e joga no body
        break;
    }

    let headers ={'Content-Type': 'applicantion/json'};
    if(token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let req = await fetch(fullUrl, {method,headers,body});
    let json = await req.json();
    return json;  

    //api consegue fazer qualquer tipo de requisição get, put, post , delete
}

export default () => {
    return {

        getToken: () =>{
            return localStorage.getItem('token');
        },

        validateToken: async() =>{
            let token = localStorage.getItem('token');
            let json  = await request('post','/auth/validate',{},token);
            return json;
        },

        login: async (email,password) => {
            let json = await request('post','/auth/login',{email,password}); 
            return json;
        }
    };
    
}