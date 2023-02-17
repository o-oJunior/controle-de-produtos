import React, { useEffect, useRef, useState } from "react";
import Header from "../components/header";
import './venda.css'
import firebase from "../config/firebase";
import InputMaskCurrency from "../assets/InputMaskCurrency";

function Venda() {
    const db = firebase.firestore()

    const [pesquisar, setPesquisar] = useState('')
    const [texto, setTexto] = useState('')
    const [produto, setProduto] = useState('')
    const [messageAlert, setMessageAlert] = useState('')
    const [messageError, setMessageError] = useState('')
    const [produtoVendido, setProdutoVendido] = useState({ qntdVendida: '', precoTotal: '' })
    let idRef = useRef(0)


    useEffect(() => {
        buscarProdutosNoFirebase()
        somarTotal()
    }, [pesquisar, produtoVendido.qntdVendida])

    const buscarProdutosNoFirebase = () => {
        db
            .collection("produtos")
            .get()
            .then((result) => {
                result.docs.forEach((doc) => {
                    const docData = doc.data()
                    if (docData.nome == pesquisar || docData.cod == pesquisar) {
                        if (docData.statusVenda === 'ativado') {

                            const produto = {
                                cod: docData.cod,
                                nome: docData.nome,
                                qntd: docData.qntd,
                                precoVenda: docData.precoVenda,
                                produto: docData.produto,
                                statusVenda: docData.statusVenda
                            }

                            idRef.current = doc.id

                            setProduto(produto)
                            setMessageAlert('')
                            setTexto('')
                            setPesquisar('')
                        }
                    } else {
                        setMessageAlert('Produto não encontrado!')
                    }
                });
            });
    }

    const pesquisarTextoEnter = (e) => {
        if (e.key === 'Enter') {
            Array.from(document.forms[0]).forEach(campo => {
                campo.classList.remove('is-invalid')
            })
            setPesquisar(texto)
            setMessageError('')
        }
    }

    const pesquisarTextoOnClick = () => {
        Array.from(document.forms[0]).forEach(campo => {
            campo.classList.remove('is-invalid')
        })
        setPesquisar(texto)
        setMessageError('')
    }

    const confirmarVenda = () => {
        produto.qntd = Number(produto.qntd) - Number(produtoVendido.qntdVendida)
        setProduto({...produto, qntd: produto.qntd})
        db
            .collection("produtos")
            .doc(idRef.current)
            .update(produto)
            .then(() => {
                Array.from(document.forms[0]).forEach(campo => {
                    campo.classList.remove('is-invalid')
                })
            })
            .catch((e) => {
                console.log(e)
            });

    }

    const apagar = () => {
        Array.from(document.forms[0]).forEach(campo => {
            campo.value = ''
        })
        setProduto('')
        setMessageError('')
    }

    const somarTotal = () => {
        if (produto.qntd > 0) {
            const precoUnitario = Number(
                produto.precoVenda.replace('R$ ', '').replace('.', '').replace(',', '.'))
                .toFixed(2)

            const somaTotal = precoUnitario * produtoVendido.qntdVendida

            setProdutoVendido({
                ...produtoVendido, precoTotal: `${somaTotal},00`
            })
        }
    }

    if(Number(produtoVendido.qntdVendida) > Number(produto.qntd)){
        setProdutoVendido({...produtoVendido, qntdVendida: produto.qntd})
    } else if (Number(produtoVendido.qntdVendida) < 0 ){
        setProdutoVendido({...produtoVendido, qntdVendida: 0})
    }

    return (
        <div>
            <Header />
            <div className="container venda">
                <div className="d-flex justify-content-center">
                    <div className="col-6">
                        <div className="input-group mb-3">
                            <input
                                id="inputPesquisar"
                                type="text"
                                className="form-control"
                                placeholder="Pesquisar por nome ou código"
                                onKeyDown={pesquisarTextoEnter}
                                onChange={(texto) => setTexto(texto.target.value)}
                                value={texto}
                            />
                            <button
                                className="btn btn-primary"
                                type="submit"
                                id="pesquisar"
                                onClick={pesquisarTextoOnClick}
                            >
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </div>
                    </div>
                </div>
                {messageAlert.length > 0 && pesquisar.length > 0 && (
                    <div className="d-flex justify-content-center">
                        <div className="alert alert-warning" role="alert">
                            {messageAlert}
                        </div>
                    </div>
                )}
                <div className="form">
                    <form className="row g-3">
                        <span className="titulo">Simulador de venda do produto</span>

                        <div className="col-md-2">
                            <label className="form-label">Código do Produto</label>
                            <input
                                className="form-control"
                                type='text'
                                placeholder="Código"
                                value={produto.cod}
                                disabled
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Nome</label>
                            <input
                                id="obrigatorioCadastro"
                                className="form-control"
                                type='text'
                                placeholder="Nome do produto"
                                value={produto.nome}
                                disabled
                            />
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Tipo</label>
                            <input
                                id="obrigatorioCadastro"
                                className="form-control"
                                type='text'
                                placeholder="Tipo do produto"
                                value={produto.produto}
                                disabled
                            />
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Quantidade</label>
                            <input
                                id="qntdVendida"
                                className="form-control"
                                type='number'
                                placeholder="0"
                                onChange={(qntd) =>
                                    setProdutoVendido({ ...produtoVendido, qntdVendida: qntd.target.value })
                                }
                                value={produtoVendido.qntdVendida}
                            />
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Estoque</label>
                            <input
                                className="form-control"
                                type='number'
                                placeholder="0"
                                value={produto.qntd}
                                disabled
                            />
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">R$ Unitário</label>
                            <input
                                className="form-control"
                                type='text'
                                placeholder="R$ 0,00"
                                value={produto.precoVenda}
                                disabled
                            />
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">R$ Total</label>
                            <InputMaskCurrency
                                className="form-control"
                                type='text'
                                placeholder="R$ 0,00"
                                value={produtoVendido.precoTotal}
                                disabled
                            />
                        </div>

                    </form>
                </div>
                {messageError.length > 0 && (
                    <div className="d-flex justify-content-center">
                        <div className="alert alert-danger" role="alert">
                            {messageError}
                        </div>
                    </div>
                )}

                <div className="d-flex justify-content-center col-12">
                    <button type="button" className="btn btn-danger me-4" onClick={apagar}>
                        <i className="fa-solid fa-trash"></i>
                    </button>

                    <button type="button" className="btn btn-primary" onClick={confirmarVenda}>
                        <i className="fa-solid fa-brazilian-real-sign"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Venda