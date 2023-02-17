import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header";
import ListarProdutos from "../components/listarProdutos/listarProdutos";
import './produtos.css'
import firebase from "../config/firebase";
import SweetAlert from "react-bootstrap-sweetalert";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

function Produtos() {
    const db = firebase.firestore()

    const [produtos, setProdutos] = useState([])

    const [pesquisar, setPesquisar] = useState('')

    const [produtoExcluido, setProdutoExcluido] = useState('')

    const [visible, setVisible] = useState(false)

    const [confirmarProduto, setConfirmarProduto] = useState('')

    const listaProdutos = []

    useEffect(() => {
        buscarProdutosNoFirebase()
    }, [pesquisar, produtoExcluido])

    const buscarProdutosNoFirebase = () => {
        db
            .collection("produtos")
            .get()
            .then((result) => {
                result.docs.forEach((doc) => {
                    const docData = doc.data()
                    if (docData.nome.indexOf(pesquisar) >= 0 ||
                        docData.cod.indexOf(pesquisar) >= 0 ||
                        docData.produto.indexOf(pesquisar) >= 0 ||
                        docData.statusVenda.indexOf(pesquisar) >= 0) {
                        const produto = {
                            id: doc.id,
                            cod: docData.cod,
                            nome: docData.nome,
                            qntd: docData.qntd,
                            minimo: docData.estoqueMin,
                            tipo: docData.produto,
                            venda: docData.statusVenda
                        }
                        listaProdutos.push(produto)
                    }
                });

                setProdutos(listaProdutos)
            });
    }

    const deletarProduto = (produto) => {
        db
            .collection("produtos")
            .doc(produto.id)
            .delete()
            .then(() => {
                setProdutoExcluido(produto.id)
                setVisible(false)
                setConfirmarProduto('')
            })
    }

    const confirmarDeletarProduto = (produto) => {
        setConfirmarProduto(produto)
        setVisible(true)
    }

    const exportarExcel = () => {
        const informacoesCSV = [
            ['Código', 'Nome', 'Quantidade', 'Minimo', 'Tipo', 'Venda'],
            ...produtos.map(produto => [produto.cod, produto.nome, produto.qntd, produto.minimo, produto.tipo, produto.venda])
        ]

        const txt = informacoesCSV.map((linha) => linha.join('\t')).join('\r\n')

        const urlDownload = 'data:application/vbd.ms-excl,' + encodeURI(txt)
        document.getElementById('excel').setAttribute('href', urlDownload);
        document.getElementById('excel').setAttribute('download', 'produtos.xls');
    }


    const downloadPDF = () => {
        pdfMake.vfs = pdfFonts.pdfMake.vfs;

        const reportTitle = [
            {
                text: 'Produtos',
                fontSize: 15,
                bold: true,
                margin: [15, 20, 0, 45]
            }
        ];

        const dados = produtos.map((produto) => {
            return [
                { text: produto.cod, fontSize: 10, margin: [0, 2, 0, 2] },
                { text: produto.nome, fontSize: 10, margin: [0, 2, 0, 2] },
                { text: produto.qntd, fontSize: 10, margin: [0, 2, 0, 2] },
                { text: produto.minimo, fontSize: 10, margin: [0, 2, 0, 2] },
                { text: produto.tipo, fontSize: 10, margin: [0, 2, 0, 2] },
                { text: produto.venda, fontSize: 10, margin: [0, 2, 0, 2] }
            ]
        });

        const details = [
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*', '*', '*', '*'],
                    body: [
                        [
                            { text: 'Código', style: 'tableHeader', fontSize: 12, bold: true },
                            { text: 'Nome', style: 'tableHeader', fontSize: 12, bold: true },
                            { text: 'Quantidade', style: 'tableHeader', fontSize: 12, bold: true },
                            { text: 'Minimo', style: 'tableHeader', fontSize: 12, bold: true },
                            { text: 'Tipo', style: 'tableHeader', fontSize: 12, bold: true },
                            { text: 'Venda', style: 'tableHeader', fontSize: 12, bold: true }
                        ],
                        ...dados
                    ]
                },
                layout: 'lightHorizontalLines'
            }
        ];

        function Rodape(currentPage, pageCount) {
            return [
                {
                    text: currentPage + ' / ' + pageCount,
                    alignment: 'right',
                    fontSize: 9,
                    margin: [0, 10, 20, 0]
                }
            ]
        }

        const docDefinitios = {
            pageSize: 'A4',
            pageMargins: [15, 50, 15, 40],

            header: [reportTitle],
            content: [details],
            footer: Rodape
        }

        pdfMake.createPdf(docDefinitios).download('produtos');
    }

    return (
        <div className="mb-5">
            <Header />
            <div className="container produtos">
                <div>
                    <div className="row">
                        <div className="col-6">
                            <Link to='/produtos/cadastrar' className="btn btn-primary" >
                                Cadastrar produto
                            </Link>
                        </div>

                        <div className="col-6">
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Pesquisar por nome, código ou tipo"
                                    aria-describedby="button-addon2"
                                    onChange={(pesquisa) => setPesquisar(pesquisa.target.value)}
                                    value={pesquisar}
                                />
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    id="button-addon2"
                                    onClick={() => setPesquisar(pesquisar)}
                                >
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
                {produtos.length > 0 ? (
                    <div>
                        <div className="d-flex justify-content-between mb-3">

                            <div>
                                <button className="btn btn-danger btn-sm w-100" onClick={downloadPDF}>
                                    Download <img src="./images/pdf.png" alt="PDF" height={20} />
                                </button>
                            </div>

                            <div>
                                <a href="" id="excel">
                                    <button className="btn btn-success btn-sm w-100" onClick={exportarExcel}>
                                        Exportar <img src="./images/excel.png" alt="Excel" height={20} />
                                    </button>
                                </a>
                            </div>
                        </div>
                        <ListarProdutos
                            produtos={produtos}
                            deletarProduto={confirmarDeletarProduto}
                        />
                    </div>
                ) : (
                    <div className="d-flex justify-content-center">
                        <div className="alert alert-warning" role="alert">
                            Nenhum produto foi encontrado!
                        </div>
                    </div>
                )
                }

                {visible ? <SweetAlert
                    warning
                    showCancel
                    showCloseButton
                    confirmBtnText="Sim, excluir produto!"
                    confirmBtnBsStyle="danger"
                    cancelBtnText="Cancelar"
                    cancelBtnBsStyle="primary"
                    title="Deseja excluir?"
                    onConfirm={() => deletarProduto(confirmarProduto)}
                    onCancel={() => setVisible(false)}
                >
                    <p>Você está preste a excluir um produto!</p>
                    Código: {confirmarProduto.cod} Nome: {confirmarProduto.nome}
                </SweetAlert>
                    : null
                }
            </div>
        </div>
    )
}

export default Produtos;