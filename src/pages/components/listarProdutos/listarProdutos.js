import React from "react"
import { Link } from "react-router-dom"
import './listarProdutos.css'

function ListarProdutos({ produtos, deletarProduto }) {
    return (
        <div className="container-fluid">
            <table className="table table-bordered table-hover">
                <thead className="table-secondary">
                    <tr>
                        <th scope="col" className="col-txt">Cód.</th>
                        <th scope="col" className="text">Nome</th>
                        <th scope="col" className="col-txt">Quant.</th>
                        <th scope="col" className="col-txt">Min.</th>
                        <th scope="col" className="col-txt">Tipo</th>
                        <th scope="col" className="col-icon">Venda</th>
                        <th scope="col" className="col-btn"></th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.map((produto) => {
                        return (
                            <tr key={produto.id}>
                                <td className="text">{produto.cod}</td>
                                <td className="text">{produto.nome}</td>
                                <td className="text">
                                    {produto.qntd}
                                    {produto.qntd < produto.minimo && <i className="fa-solid fa-circle-exclamation ms-2 text-warning"></i>}
                                </td>
                                <td className="text">{produto.minimo}</td>
                                <td className="text">{produto.tipo}</td>
                                {produto.venda === 'ativado' ?
                                    <td> <i className="fa-solid fa-circle-check text-success icone"></i> </td>
                                    : <td> <i className="fa-solid fa-circle-xmark text-danger icone"></i> </td>
                                }
                                <td>
                                    <Link to={`/produtos/visualizar/${produto.id}`} aria-current="page">
                                        <i className="fa-regular fa-eye iconeBtn text-dark" ></i>
                                    </Link>

                                    <Link to={`/produtos/editar/${produto.id}`} aria-current="page">
                                        <i className="fa-regular fa-pen-to-square iconeBtn text-dark"></i>
                                    </Link>
                                    <Link to='#' onClick={() => deletarProduto(produto)}>
                                        <i className="fa-solid fa-trash iconeBtn text-dark"></i>
                                    </Link>
                                </td>
                            </tr>
                        )

                    })}
                </tbody>
            </table>
        </div>
    )
}

export default ListarProdutos;