import React, { useState } from 'react';
import Head from 'next/head';

export default props => {

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (

        <Head>
            <title>Entre</title>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            <link rel="icon" type="image/png" href="/static/login/images/icons/favicon.ico" />

            <link rel="stylesheet" type="text/css" href="/static/login/vendor/bootstrap/css/bootstrap.min.css" />

            <link rel="stylesheet" type="text/css" href="/static/login/fonts/font-awesome-4.7.0/css/font-awesome.min.css" />

            <link rel="stylesheet" type="text/css" href="/static/login/fonts/Linearicons-Free-v1.0.0/icon-font.min.css" />

            <link rel="stylesheet" type="text/css" href="/static/login/vendor/animate/animate.css" />

            <link rel="stylesheet" type="text/css" href="/static/login/vendor/css-hamburgers/hamburgers.min.css" />

            <link rel="stylesheet" type="text/css" href="/static/login/vendor/select2/select2.min.css" />

            <link rel="stylesheet" type="text/css" href="/static/login/css/util.css" />
            <link rel="stylesheet" type="text/css" href="/static/login/css/main.css" />

        </Head>

    );
}