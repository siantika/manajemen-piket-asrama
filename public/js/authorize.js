const authorize = () =>{
    const authToken = localStorage.getItem('authToken');
    if (!authToken){
        window.location.href="/unauthorize";
    }
}