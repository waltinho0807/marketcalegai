import React, { useState } from 'react';
import Head from 'next/head';

export default props => {

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (

        <Head>
                <meta charset="UTF-8" />
                <meta name="description" content="Ogani Template" />
                <meta name="keywords" content="Ogani, unica, creative, html" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <title>Mercado</title>


                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;600;900&display=swap" rel="stylesheet" />


                <link rel="stylesheet" href="/static/css/bootstrap.min.css" type="text/css" />
                <link rel="stylesheet" href="/static/css/font-awesome.min.css" type="text/css" />
                <link rel="stylesheet" href="/static/css/elegant-icons.css" type="text/css" />
                <link rel="stylesheet" href="/static/css/nice-select.css" type="text/css" />
                <link rel="stylesheet" href="/static/css/jquery-ui.min.css" type="text/css" />
                <link rel="stylesheet" href="/static/css/owl.carousel.min.css" type="text/css" />
                <link rel="stylesheet" href="/static/css/slicknav.min.css" type="text/css" />
                <link rel="stylesheet" href="/static/css/style.css" type="text/css"></link>
                 
         </Head>
           
    );
}