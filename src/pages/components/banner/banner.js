import React from "react";
import { Link } from "react-router-dom";
import './banner.css'

function Banner() {
    return (
        <section className="banner">
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <span className="titleBanner">Esse sistema é responsável por gerenciar os seus produtos!</span>

                            <p className="mt-5">Vantagens:</p>
                            <ul>
                                <li>Prático</li>
                                <li>Ágil</li>
                                <li>Sem risco de perder o arquivo</li>
                                <li>Exportar Excel e PDF</li>
                            </ul>

                            <p className="mt-5">Acesse a página de produtos no botão abaixo!</p>
                            <Link to='/produtos' className="btn btn-primary text-white">Produtos</Link>
                        </div>

                        <div className="col-lg-6 areaImage">
                            <img src="/images/controle_estoque.jpg" alt="Controle de estoque eficiente" width={600} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


export default Banner