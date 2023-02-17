import React, { useEffect, useRef, useState } from "react";
import Header from "../components/header";
import './cadastrar.css'
import InputMaskCurrency from "../assets/InputMaskCurrency";
import InputMaskNumber from "../assets/InputMaskNumber";
import firebase from "../config/firebase";
import { Navigate } from "react-router-dom";
import { maskCEP, maskCNPJ, maskCPF, maskDATE } from "../assets/masks";
import DropdownStates from "../components/forms/dropdownStates/dropdownStates";
import DropdownCities from "../components/forms/dropdownCities/dropdownCities";
import validarForm from "../validations/validarForm";


const initialValueCadastro = {
    cod: '',
    nome: '',
    marca: '',
    unidade: '',
    qntd: '',
    estoqueMin: '',
    produto: '',
    precoVenda: '',
    statusVenda: '',
}

const initialValueNotaFiscal = {
    produto: {
        codDeBarras: '',
        dtEmissao: '',
        dtEntrada: '',
        codFornecedor: '',
        nomeFornecedor: '',
        cnpj: '',
        unidade: '',
        precoUnitario: '',
        precoFrete: '',
        precoTotal: ''
    },
    destinatario: {
        nomeDestinatario: '',
        cpf: '',
        endereco: '',
        complemento: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
    },
}

function Cadastrar() {

    const [cadastro, setCadastro] = useState(initialValueCadastro)

    const [notaFiscal, setNotaFiscal] = useState(initialValueNotaFiscal)

    const [display, setDisplay] = useState('none')

    const [sucesso, setSucesso] = useState('')

    const [messageAlert, setMessageAlert] = useState('')

    const min = 1
    const max = 100000

    const numeroAleatorioRef = useRef(((Math.random() * Math.random(max)) * (min * max) + (max * min)).toFixed(0))

    const fabricadoRef = useRef(false)

    const compradoRef = useRef(false)

    const ativadoRef = useRef(false)

    const desativadoRef = useRef(false)

    const db = firebase.firestore()

    useEffect(() => {
        setNotaFiscal({
            ...notaFiscal,
            destinatario: {
                ...notaFiscal.destinatario,
                cidade: ''
            }
        })
    }, [notaFiscal.destinatario.estado])





    const fabricado = () => {
        setNotaFiscal(initialValueNotaFiscal)
        Array.from(document.forms[0]).forEach(input => {
            if (input.id === 'obrigatorioNotaFiscal') {
                input.classList.remove('is-invalid')
                input.classList.remove('is-valid')
            }
        })

        if (fabricadoRef.current === false) {
            fabricadoRef.current = true
            setCadastro({ ...cadastro, produto: 'fabricado' })
            if (display === 'block') {
                setDisplay('none')
                compradoRef.current = false
            }
        } else {
            setCadastro({ ...cadastro, produto: '' })
            fabricadoRef.current = false
        }

    }


    const comprado = () => {
        if (display === 'none') {
            setCadastro({ ...cadastro, produto: 'comprado' })
            compradoRef.current = true
            fabricadoRef.current = false
            setDisplay('block')
        } else {
            compradoRef.current = false
            setDisplay('none')
            setCadastro({ ...cadastro, produto: '' })
        }
    }

    const ativado = () => {

        if (ativadoRef.current === false) {
            setCadastro({ ...cadastro, statusVenda: 'ativado' })
            ativadoRef.current = true
            desativadoRef.current = false
        } else {
            setCadastro({ ...cadastro, statusVenda: '' })
            ativadoRef.current = false
        }
    }

    const desativado = () => {
        if (desativadoRef.current === false) {
            setCadastro({ ...cadastro, statusVenda: 'desativado' })
            desativadoRef.current = true
            ativadoRef.current = false
        } else {
            setCadastro({ ...cadastro, statusVenda: '' })
            desativadoRef.current = false
        }
    }

    const salvar = () => {
        cadastro.cod = numeroAleatorioRef.current
        const campoVazio = ''.length
        let formCompleto = true

        validarForm(cadastro.produto)

        Array.from(document.forms[0]).forEach(campo => {
            if (campo.classList[2] === 'is-invalid' || campo.classList[1] === 'is-invalid') {
                formCompleto = false
            }
        })

        if (!formCompleto) {
            return setMessageAlert('Preencha os campos obrigátorios!*')
        } else {
            setMessageAlert('')
        }



        if (cadastro.produto === 'comprado') {
            cadastro.notaFiscal = notaFiscal
            if (notaFiscal.produto.precoFrete == campoVazio) {
                notaFiscal.produto.precoFrete = 'R$ 0'
                setNotaFiscal({ ...notaFiscal, produto: { ...notaFiscal.produto, precoFrete: 'R$ 0' } })
            }
        } else {
            delete cadastro.notaFiscal
        }

        if (cadastro.qntd == campoVazio) {
            cadastro.qntd = 0
            setCadastro({ ...cadastro, qntd: 0 })
        }

        if (cadastro.estoqueMin == campoVazio) {
            cadastro.estoqueMin = 0
            setCadastro({ ...cadastro, estoqueMin: 0 })
        }

        if (cadastro.precoVenda == campoVazio) {
            cadastro.precoVenda = 'R$ 0'
            setCadastro({ ...cadastro, precoVenda: 'R$ 0' })
        }

        db
            .collection("produtos")
            .add(cadastro)
            .then(() => {
                Array.from(document.forms[0]).forEach(campo => {
                    campo.classList.remove('is-valid')
                    campo.classList.remove('is-invalid')
                })
                setSucesso(true)
                setCadastro(initialValueCadastro)
                setNotaFiscal(initialValueNotaFiscal)
                compradoRef.current = false
                fabricadoRef.current = false
                ativadoRef.current = false
                desativadoRef.current = false
                setMessageAlert('')
                setDisplay('none')
            })
            .catch((erro) => {
                console.log(erro)
                setMessageAlert('Erro! Erro ao salvar o cadastro.')
                setSucesso(false)
            });
    }


    const limpar = () => {
        Array.from(document.forms[0]).forEach(campo => {
            campo.classList.remove('is-valid')
            campo.classList.remove('is-invalid')
        })
        setCadastro(initialValueCadastro)
        setNotaFiscal(initialValueNotaFiscal)
        compradoRef.current = false
        fabricadoRef.current = false
        ativadoRef.current = false
        desativadoRef.current = false
        setMessageAlert('')
        setDisplay('none')

    }

    return (
        <div className="mb-5">
            <Header />
            <div className="container cadastrar">
                <form className="row g-3">
                    <p>Cadastro de produto</p>
                    <div className="col-md-2">
                        <label className="form-label">Código*</label>
                        <input
                            className="form-control"
                            type='text'
                            placeholder="Código"
                            value={numeroAleatorioRef.current}
                            disabled
                        />
                    </div>

                    <div className="col-md-5">
                        <label className="form-label">Nome*</label>
                        <input
                            id="obrigatorioCadastro"
                            className="form-control"
                            type='text'
                            placeholder="Nome do produto"
                            onChange={(nome) =>
                                setCadastro({ ...cadastro, nome: nome.target.value.trimStart() })}
                            value={cadastro.nome}
                        />
                    </div>

                    <div className="col-md-2">
                        <label className="form-label">Marca*</label>
                        <input
                            id="obrigatorioCadastro"
                            className="form-control"
                            type='text'
                            placeholder="Marca"
                            onChange={(marca) =>
                                setCadastro({ ...cadastro, marca: marca.target.value.trimStart() })}
                            value={cadastro.marca}
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Unidade*</label>
                        <input
                            id="obrigatorioCadastro"
                            className="form-control"
                            type='text'
                            placeholder="M², unidade, cm, peça e etc."
                            onChange={(unidade) =>
                                setCadastro({ ...cadastro, unidade: unidade.target.value.trimStart() })}
                            value={cadastro.unidade}
                        />
                    </div>

                    <div className="col-md-2">
                        <label className="form-label">Quantidade</label>
                        <input
                            className="form-control"
                            type='number'
                            placeholder="10"
                            onChange={(qntd) =>
                                setCadastro({ ...cadastro, qntd: qntd.target.value })}
                            value={cadastro.qntd}
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Estoque minimo</label>
                        <input
                            className="form-control"
                            type='number'
                            placeholder="20"
                            onChange={(estoqueMin) =>
                                setCadastro({ ...cadastro, estoqueMin: estoqueMin.target.value })}
                            value={cadastro.estoqueMin}
                        />
                    </div>


                    <fieldset className="col mt-2">
                        <label className="pt-2">Produto*:</label>
                        <div className="col">
                            <div className="form-check">
                                <input
                                    id="obrigatorioCadastro"
                                    className="form-check-input"
                                    type="radio"
                                    name="produto"
                                    value={cadastro.produto}
                                    onClick={fabricado}
                                    checked={fabricadoRef.current}
                                    readOnly
                                />
                                <label className="form-check-label">
                                    Fabricado
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    id="obrigatorioCadastro"
                                    className="form-check-input"
                                    type="radio"
                                    name="produto"
                                    value={cadastro.produto}
                                    onClick={comprado}
                                    checked={compradoRef.current}
                                    readOnly
                                />
                                <label className="form-check-label">
                                    Comprado
                                </label>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="col mt-2">
                        <label className="pt-2">Venda*:</label>
                        <div className="col">
                            <div className="form-check">
                                <input
                                    id="obrigatorioCadastro"
                                    className="form-check-input"
                                    type="radio"
                                    name="venda"
                                    value={cadastro.statusVenda}
                                    onClick={ativado}
                                    checked={ativadoRef.current}
                                    readOnly
                                />
                                <label className="form-check-label">
                                    Ativado
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    id="obrigatorioCadastro"
                                    className="form-check-input"
                                    type="radio"
                                    name="venda"
                                    value={cadastro.statusVenda}
                                    onClick={desativado}
                                    checked={desativadoRef.current}
                                    readOnly
                                />
                                <label className="form-check-label">
                                    Desativado
                                </label>
                            </div>
                        </div>
                    </fieldset>

                    <div style={{ display: display }}>
                        <p>Produto</p>

                        <div className="row g-3" >
                            <div className="col-md-6">
                                <label className="form-label">Código de barras*</label>
                                <input
                                    id="obrigatorioNotaFiscal"
                                    className="form-control"
                                    type='text'
                                    placeholder="Código de barras"
                                    onChange={(codDeBarras) => setNotaFiscal({
                                        ...notaFiscal,
                                        produto: {
                                            ...notaFiscal.produto,
                                            codDeBarras: codDeBarras.target.value.trimStart()
                                        }
                                    })}
                                    value={notaFiscal.produto.codDeBarras}
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Data de emissão*</label>
                                <input
                                    id="obrigatorioNotaFiscalData"
                                    className="form-control"
                                    type='text'
                                    placeholder="__/__/____"
                                    onChange={(dtEmissao) => setNotaFiscal({
                                        ...notaFiscal,
                                        produto: {
                                            ...notaFiscal.produto,
                                            dtEmissao: maskDATE(dtEmissao.target.value)
                                        }
                                    })}
                                    value={notaFiscal.produto.dtEmissao}
                                    maxLength={10}
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Data de entrada*</label>
                                <input
                                    id="obrigatorioNotaFiscalData"
                                    className="form-control"
                                    type='text'
                                    placeholder="__/__/____"
                                    onChange={(dtEntrada) => setNotaFiscal({
                                        ...notaFiscal,
                                        produto: {
                                            ...notaFiscal.produto,
                                            dtEntrada: maskDATE(dtEntrada.target.value)
                                        }
                                    })}
                                    value={notaFiscal.produto.dtEntrada}
                                    maxLength={10}
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Código fornecedor*</label>
                                <input
                                    id="obrigatorioNotaFiscal"
                                    className="form-control"
                                    type='text'
                                    placeholder="Cód. Fornecedor"
                                    onChange={(codFornecedor) =>
                                        setNotaFiscal({
                                            ...notaFiscal,
                                            produto: {
                                                ...notaFiscal.produto,
                                                codFornecedor: codFornecedor.target.value.trimStart()
                                            }
                                        })}
                                    value={notaFiscal.produto.codFornecedor}
                                />
                            </div>

                            <div className="col-md-5">
                                <label className="form-label">Nome fornecedor*</label>
                                <input
                                    id="obrigatorioNotaFiscal"
                                    className="form-control"
                                    type='text'
                                    placeholder="Nome do fornecedor"
                                    onChange={(nomeFornecedor) =>
                                        setNotaFiscal({
                                            ...notaFiscal,
                                            produto: {
                                                ...notaFiscal.produto,
                                                nomeFornecedor: nomeFornecedor.target.value.trimStart()
                                            }
                                        })}
                                    value={notaFiscal.produto.nomeFornecedor}

                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">CNPJ*</label>
                                <input
                                    id="obrigatorioNotaFiscalCnpj"
                                    className="form-control"
                                    type='text'
                                    placeholder="__.___.___/____-__"
                                    onChange={(cnpj) => setNotaFiscal({
                                        ...notaFiscal,
                                        produto: {
                                            ...notaFiscal.produto,
                                            cnpj: maskCNPJ(cnpj.target.value)
                                        }
                                    })}
                                    value={notaFiscal.produto.cnpj}
                                    maxLength={18}
                                />
                            </div>

                            <p className="mt-4 mb-0">Destinatário</p>

                            <div className="col-md-5">
                                <label className="form-label">Nome / Razão social*</label>
                                <input
                                    id="obrigatorioNotaFiscal"
                                    className="form-control"
                                    type='text'
                                    placeholder="Nome / Razão social"
                                    onChange={(nomeDestinatario) => setNotaFiscal({
                                        ...notaFiscal,
                                        destinatario: {
                                            ...notaFiscal.destinatario,
                                            nomeDestinatario: nomeDestinatario.target.value.trimStart()
                                        }
                                    })}
                                    value={notaFiscal.destinatario.nomeDestinatario}
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">CPF*</label>
                                <input
                                    id="obrigatorioNotaFiscalCpf"
                                    className="form-control"
                                    type='text'
                                    placeholder="___.___.___-__"
                                    onChange={(cpf) => setNotaFiscal({
                                        ...notaFiscal,
                                        destinatario: {
                                            ...notaFiscal.destinatario,
                                            cpf: maskCPF(cpf.target.value)
                                        }
                                    })}
                                    value={notaFiscal.destinatario.cpf}
                                    maxLength={14}
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">CEP*</label>
                                <input
                                    id="obrigatorioNotaFiscalCep"
                                    className="form-control"
                                    type='text'
                                    placeholder="_____-___"
                                    onChange={(cep) => setNotaFiscal({
                                        ...notaFiscal,
                                        destinatario: {
                                            ...notaFiscal.destinatario,
                                            cep: maskCEP(cep.target.value)
                                        }
                                    })}
                                    value={notaFiscal.destinatario.cep}
                                    maxLength={9}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Endereço*</label>
                                <input
                                    id="obrigatorioNotaFiscal"
                                    type="text"
                                    className="form-control"
                                    placeholder="Rua Emilio Pacheco"
                                    onChange={(endereco) => setNotaFiscal({
                                        ...notaFiscal,
                                        destinatario: {
                                            ...notaFiscal.destinatario,
                                            endereco: endereco.target.value.trimStart()
                                        }
                                    })}
                                    value={notaFiscal.destinatario.endereco}
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Complemento</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Apto, casa e etc."
                                    onChange={(complemento) => setNotaFiscal({
                                        ...notaFiscal,
                                        destinatario: {
                                            ...notaFiscal.destinatario,
                                            complemento: complemento.target.value.trimStart()
                                        }
                                    })}
                                    value={notaFiscal.destinatario.complemento}
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Bairro*</label>
                                <input
                                    id="obrigatorioNotaFiscal"
                                    className="form-control"
                                    type='text'
                                    placeholder="Estreito"
                                    onChange={(bairro) =>
                                        setNotaFiscal({
                                            ...notaFiscal,
                                            destinatario: {
                                                ...notaFiscal.destinatario,
                                                bairro: bairro.target.value.trimStart()
                                            }
                                        })}
                                    value={notaFiscal.destinatario.bairro}
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">Estado*</label>
                                <DropdownStates
                                    id="obrigatorioNotaFiscal"
                                    className="form-select form-control"
                                    onChange={(estado) =>
                                        setNotaFiscal({
                                            ...notaFiscal,
                                            destinatario: {
                                                ...notaFiscal.destinatario,
                                                estado: estado.target.value.trimStart()
                                            }
                                        })}
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">Cidade*</label>
                                <DropdownCities
                                    id="obrigatorioNotaFiscal"
                                    className="form-select form-control"
                                    state={notaFiscal.destinatario.estado}
                                    onChange={(cidade) =>
                                        setNotaFiscal({
                                            ...notaFiscal,
                                            destinatario: {
                                                ...notaFiscal.destinatario,
                                                cidade: cidade.target.value.trimStart()
                                            }
                                        })}
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">Número*</label>
                                <InputMaskNumber
                                    id="obrigatorioNotaFiscal"
                                    className="form-control"
                                    type='text'
                                    placeholder="Nº 000"
                                    onChange={(numero) =>
                                        setNotaFiscal({
                                            ...notaFiscal,
                                            destinatario: {
                                                ...notaFiscal.destinatario,
                                                numero: numero.target.value.trimStart()
                                            }
                                        })}
                                    value={notaFiscal.destinatario.numero}
                                />
                            </div>




                            <div className="col-md-3">
                                <label className="form-label">Unidade*</label>
                                <input
                                    id="obrigatorioNotaFiscal"
                                    className="form-control"
                                    type='text'
                                    placeholder="M², unidade, cm, peça e etc."
                                    onChange={(unidade) =>
                                        setNotaFiscal({
                                            ...notaFiscal,
                                            produto: {
                                                ...notaFiscal.produto,
                                                unidade: unidade.target.value.trimStart()
                                            }
                                        })}
                                    value={notaFiscal.produto.unidade}
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">R$ Unitário*</label>
                                <InputMaskCurrency
                                    id="obrigatorioNotaFiscal"
                                    className="form-control"
                                    type='text'
                                    placeholder="R$ 0,00"
                                    onChange={(precoUnitario) => setNotaFiscal({
                                        ...notaFiscal,
                                        produto: {
                                            ...notaFiscal.produto,
                                            precoUnitario: precoUnitario.target.value
                                        }
                                    })}
                                    value={notaFiscal.produto.precoUnitario}
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">R$ Frete</label>
                                <InputMaskCurrency
                                    className="form-control"
                                    type='text'
                                    placeholder="R$ 0,00"
                                    onChange={(precoFrete) => setNotaFiscal({
                                        ...notaFiscal,
                                        produto: {
                                            ...notaFiscal.produto,
                                            precoFrete: precoFrete.target.value
                                        }
                                    })}
                                    value={notaFiscal.produto.precoFrete}
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">R$ Total*</label>
                                <InputMaskCurrency
                                    id="obrigatorioNotaFiscal"
                                    className="form-control"
                                    type='text'
                                    placeholder="R$ 0,00"
                                    onChange={(precoTotal) => setNotaFiscal({
                                        ...notaFiscal,
                                        produto: {
                                            ...notaFiscal.produto,
                                            precoTotal: precoTotal.target.value
                                        }
                                    })}
                                    value={notaFiscal.produto.precoTotal}
                                />
                            </div>
                        </div>

                    </div>

                    <div className="col-md-2">
                        <label className="form-label">R$ Venda</label>
                        <InputMaskCurrency
                            className="form-control"
                            type='text'
                            placeholder="R$ 0,00"
                            onChange={(precoVenda) =>
                                setCadastro({ ...cadastro, precoVenda: precoVenda.target.value })}
                            value={cadastro.precoVenda}
                        />
                    </div>

                </form>

            </div>

            {messageAlert.length > 0 && (<div className="d-flex justify-content-center">
                <div className="alert alert-danger" role="alert">
                    {messageAlert}
                </div>
            </div>)}
            {sucesso == true ? <Navigate to='/produtos' /> : null}


            <div className="d-flex justify-content-center">
                <button type="button" className="btn btn-danger me-4" onClick={limpar}>
                    <i className="fa-solid fa-trash"></i>
                </button>
                <button type="submit" className="btn btn-primary ms-4" onClick={salvar}>
                    <i className="fa-solid fa-check"></i>
                </button>

            </div>

        </div>
    )
}

export default Cadastrar;