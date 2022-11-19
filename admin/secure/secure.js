
const firstname = dom('#firstname');
const lastname = dom('#lastname');
const email = dom('#email');
const password = dom('#password');
const btn = dom('.create-btn');


btn.onclick = () => {
    if(email.value !== '' && password.value !== '' && lastname.value !== '' && firstname.value !== '') {
        if(password.value.length >= 8){
            btn.innerHTML = 'Creating User Account...';
            fetch('https://parlaynplay.herokuapp.com/admin-register', {
                mode: "cors",
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': 'http://localhost:5501'},
                body: JSON.stringify({
                    email: email.value, password: password.value, firstname: firstname.value, lastname: lastname.value
                })
            }).then(res => res.json())
            .then(data => {
                if(data.success) {
                    btn.innerHTML = 'Create Admin Account';
                    toast(`${firstname.value}'s admin account has been created`);
                    domAll('input').forEach(input => {
                        input.value = '';
                    })
                    setTimeout(() => {
                        location.href = '/admin/';
                    }, 4000);
                }else{
                    btn.innerHTML = 'Admin Account';
                    M.toast({html: data.error});
                }
            }).catch(err => {
                console.log(err);
                M.toast({html: 'An error occured, try again'});
                btn.innerHTML = 'Create Admin Account';
            })
        }else{
            M.toast({html: 'Password length must be atleast 8 characters long'});
        }
    }else {
        M.toast({html: 'All fields are important'});
    }
}