import React, {useState, useEffect} from  'react';
import Router from 'next/router'
import useRequest from '../hooks/use-request';

import Head from '../../components/auth/Head';
import Javascript from '../../components/auth/Javascript';

const SignIn = (data) => {

    const [email, setEmail] =  useState('');
    const [password, setPassword] = useState('');
	const { doRequest, errors } = useRequest({
		url: '/api/users/signin',
		method: 'post',
		body: {
		  email,
		  password
		},
		onSuccess: () => Router.push('/')
	  });
	
	  const onSubmit = async event => {
		event.preventDefault();
	
		await doRequest();
	  };
	

    return (
      <div>
        
        <Head />
        <div>
        <div className="limiter">
		<div className="container-login100">
			<div className="wrap-login100 p-l-50 p-r-50 p-t-77 p-b-30">
				<form onSubmit={onSubmit} className="login100-form validate-form">
					<span className="login100-form-title p-b-55">
						Login
					</span>

					<div class="wrap-input100 validate-input m-b-16" data-validate = "Valid email is required: ex@abc.xyz">
                        <input 
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value)
                        }}
                        className="input100" 
                        type="text" 
                        name="email" 
                        placeholder="Email" />

						<span className="focus-input100"></span>
						<span className="symbol-input100">
							<span className="lnr lnr-envelope"></span>
						</span>
					</div>

					<div className="wrap-input100 validate-input m-b-16" data-validate = "Password is required">
                        <input
                         value={password}
                         onChange={e => {
                             setPassword(e.target.value);
                         }}
                         className="input100" 
                         type="password" 
                         name="pass" 
                         placeholder="Password" />
						<span className="focus-input100"></span>
						<span className="symbol-input100">
							<span className="lnr lnr-lock"></span>
						</span>
					</div>

					<div className="contact100-form-checkbox m-l-4">
						<input className="input-checkbox100" id="ckb1" type="checkbox" name="remember-me" />
						<label className="label-checkbox100" for="ckb1">
							Relembre me
						</label>
					</div>
					
					<div className="container-login100-form-btn p-t-25">
					{errors}
						<button className="login100-form-btn">
							Login
						</button>
					</div>

					<div className="text-center w-full p-t-42 p-b-22">
						<span className="txt1">
							Ou entre com
						</span>
					</div>

					<a href="#" className="btn-face m-b-10">
						<i class="fa fa-facebook-official"></i>
						Facebook
					</a>

					<a href="#" className="btn-google m-b-10">
						<img src="/static/login/images/icons/icon-google.png" alt="GOOGLE" />
						Google
					</a>

					<div className="text-center w-full p-t-115">
						<span class="txt1">
							Não é um membro?
						</span>

						<a className="txt1 bo1 hov1" href="/auth/signup">
							Entre Agora							
						</a>
					</div>
				</form>
			</div>
		</div>
	</div>
        </div>
        <Javascript />
  
  
      </div>
    );
  }
  
 export default SignIn;