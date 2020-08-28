import {useState} from 'react';
import Router from 'next/router';
import useRequest from '../hooks/use-request';

const NewProduto = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [img, setsImg] = useState('');
    const {doRequest, errors} = useRequest({
        url: '/api/produtos',
        method: 'post',
        body: {
            title,
            price,
            img,
            category
        },
        onSuccess: () => {Router.push('/')}
    });

    const onSubmit = (event)=>{
        event.preventDefault();
        doRequest();
    }

    const onBlur = () =>{
        const value = parseFloat(price);
        if(isNaN(value)){
            return;
        }

        setPrice(value.toFixed(2));
    }

    return (<div className="container">
        <h1>Produto create</h1>
           <form onSubmit={onSubmit}>
               <div className="form-group">
                   <label>Title</label>
                   <input
                    value={title}
                    onChange= {(e)=> setTitle(e.target.value)} 
                    className="form-control"
                    />
               </div>
               <div className="form-group">
                   <label>Preço</label>
                   <input
                    value={price}
                    onBlur={onBlur}
                    onChange= {(e)=> setPrice(e.target.value)}
                    className="form-control" />
               </div>
               <div className="form-group">
                   <label>Categoria</label>
                   <input 
                    value={category}
                    onChange= {(e)=> setCategory(e.target.value)}
                    className="form-control" />
               </div>
               <div className="form-group">
                   <label>Imagem</label>
                   <input
                    value={img}
                    onChange= {(e)=> setImg(e.target.value)}
                    className="form-control" />
               </div>
               {errors}
           </form>
    </div>)
}

export default NewProduto;