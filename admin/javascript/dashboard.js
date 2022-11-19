
const firstname = dom('#firstname');
const lastname = dom('#lastname');
const email = dom('#email');
const password = dom('#password');
const btn = dom('.create-btn');


btn.onclick = () => {
    if(email.value !== '' && password.value !== '' && lastname.value !== '' && firstname.value !== '') {
        const email_val = email.value;
        if(password.value.length >= 8) {
            btn.innerHTML = 'Creating User Account...';
            fetch('https://parlaynplay.herokuapp.com/register', {
                mode: "cors",
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': 'http://localhost:5501'},
                body: JSON.stringify({
                    email: email_val.toLowerCase(), password: password.value, firstname: firstname.value, lastname: lastname.value
                })
            }).then(res => res.json())
            .then(data => {
                if(data.success) {
                    btn.innerHTML = 'Create User';
                    toast(`${firstname.value}'s account has been created`);
                    domAll('input').forEach(input => {
                        input.value = '';
                    })
                }else{
                    btn.innerHTML = 'Sign In';
                    console.log(data.error);
                    M.toast({html: 'an error occured'});
                    M.toast({html: 'open console to view error'});
                }
            }).catch(err => {
                console.log(err);
                M.toast({html: 'An error occured, try again'});
                btn.innerHTML = 'Create User';
            })
        }else{
            M.toast({html: 'Password must be atleast 8 characters long'});
        }
    }else {
        M.toast({html: 'All fields are important'});
    }
}