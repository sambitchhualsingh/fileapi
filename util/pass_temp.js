
const forgot_pass_template = (email,token,url) => {
    return `<html>
                <head>
                    <style>
                        *{
                            box-sizing: border-box;
                        }
                        body{
                            margin: 0;
                            height: 50vh;
                            width:100%;
                            overflow-x:hidden;
                            background-color: #ccc;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                            .container {
                            display:flex;
                            width: 100%;
                            height: 100vh;
                            background-color: #fff;
                            justify-content: center;
                            align-items: center;
                            padding: 20px;
                            color:#222;
                            gap: 30px

                        }

                        .title h1 {
                            text-align: center;
                            color:slateblue; 
                        }

                        .content{
                            text-align: center;
                        }

                        .content .btn {
                            padding: 12px 14px;
                            width: 5vw;
                            background-color: orangered;
                            color:#fff;
                            font-weight:bold;
                            font-size: 1.2rem;
                            border:none;
                            border-radius: 10px;
                            text-decoration:none;
                            cursor:pointer;
                
                        }

                        @media screen and (max-width: 768px) {
                            container {
                                width: 100%;
                                height: 100vh;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                margin-top: 100px;
                            }
                        }



                    </style>
                </head>
                <body>
                        <div class="container">
                            <div class="title">
                                <h1>Password Reset</h1>
                            </div>
                            <div class="content">
                                <p>Seems like you forgot your password for ${url}. if this is true , click below link to reset your password. </p>
                                <a href="${url}/email/${email}/token/${token}" class="btn">Reset my password</a>
                            </div>
                            <div class="note">
                                <p>if you did not forgot your password you can safely ignore this email.</p>
                            </div>
                        </div>
                </body>
            </html>`
}