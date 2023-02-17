import React, { useEffect, useRef, useState } from "react";
import Header from "../components/header";
import InputMaskCurrency from "../assets/InputMaskCurrency";
import InputMaskNumber from "../assets/InputMaskNumber";
import firebase from "../config/firebase";
import './editar.css'
import { Link, Navigate, useParams } from "react-router-dom";
import { maskCEP, maskCNPJ, maskCPF, maskDATE } from "../assets/masks";
import validarForm from "../validations/validarForm";
import SweetAlert from "react-bootstrap-sweetalert";

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

function Editar() {
    const { id } = useParams()

    const [cadastro, setCadastro] = useState(initialValueCadastro)

    const [notaFiscal, setNotaFiscal] = useState(initialValueNotaFiscal)

    const [display, setDisplay] = useState('none')

    const [sucesso, setSucesso] = useState('')

    const [messageAlert, setMessageAlert] = useState('')

    const [produtoExcluido, setProdutoExcluido] = useState('')

    const [visible, setVisible] = useState(false)

    const [confirmarProduto, setConfirmarProduto] = useState('')

    const fabricadoRef = useRef(false)

    const compradoRef = useRef(false)

    const ativadoRef = useRef(false)

    const desativadoRef = useRef(false)

    const db = firebase.firestore()


    useEffect(() => {
        buscarProdutoNoFirebase()
    }, [])

    const buscarProdutoNoFirebase = () => {
        db.collection("produtos")
            .get()
            .then((result) => {
                result.docs.forEach((doc) => {
                    const docData = doc.data()
                    if (id == doc.id) {
                        setCadastro(docData)
                        if (docData.produto === 'comprado') {
                            compradoRef.current = true
                            setDisplay('block')
                            setNotaFiscal(docData.notaFiscal)
                        } else {
                            fabricadoRef.current = true
                        }

                        if (docData.statusVenda === 'ativado') {
                            ativadoRef.current = true
                        } else {
                            desativadoRef.current = true
                        }
                    }
                });
            });
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
        const campoVazio = ''.length
        let formCompleto = true

        validarForm()

        Array.from(document.forms[0]).forEach(campo => {
            if (campo.classList[2] === 'is-invalid' || campo.classList[1] === 'is-invalid') {
                console.log(campo)
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
        } else if (cadastro.estoqueMin == campoVazio) {
            cadastro.estoqueMin = 0
            setCadastro({ ...cadastro, estoqueMin: 0 })
        } else if (cadastro.precoVenda == campoVazio) {
            cadastro.precoVenda = 'R$ 0'
            setCadastro({ ...cadastro, precoVenda: 'R$ 0' })
        }

        db
            .collection("produtos")
            .doc(id)
            .update(cadastro)
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
            .catch(() => {
                setMessageAlert('Erro! Erro ao salvar o cadastro.')
                setSucesso(true)
            });
    }


    const deletarProduto = () => {
        Array.from(document.forms[0]).forEach(campo => {
            campo.classList.remove('is-valid')
            campo.classList.remove('is-invalid')

        })
        db
            .collection("produtos")
            .doc(id)
            .delete()
            .then(() => {
                setProdutoExcluido(id)
                setVisible(false)
                setConfirmarProduto('')
                setSucesso(true)
            })
    }

    const confirmarDeletarProduto = (produto) => {
        setConfirmarProduto(produto)
        setVisible(true)
    }

    return (
        <div className="mb-5">
            <Header />
            <div className="container editar">
                <form className="row g-3">
                    <div className="d-flex flex-row justify-content-between">
                        <p>Editar Produto</p>
                        <Link to={`/produtos/visualizar/${id}`}>
                            <i className="fa-regular fa-eye iconeBtn text-dark" ></i>
                        </Link>
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Código*</label>
                        <input
                            className="form-control"
                            type='text'
                            placeholder="Código"
                            onChange={(codigo) =>
                                setCadastro({ ...cadastro, cod: codigo.target.value })}
                            value={cadastro.cod}
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
                                setCadastro({ ...cadastro, nome: nome.target.value })}
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
                                setCadastro({ ...cadastro, marca: marca.target.value })}
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
                                setCadastro({ ...cadastro, unidade: unidade.target.value })}
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
                                    name="exampleRadios"
                                    value={cadastro.produto}
                                    checked={fabricadoRef.current}
                                    disabled
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
                                    name="exampleRadios"
                                    value={cadastro.produto}
                                    checked={compradoRef.current}
                                    disabled
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
                                    name="flexRadioDefault"
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
                                    name="flexRadioDefault"
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
                                            codDeBarras: codDeBarras.target.value
                                        }
                                    })}
                                    value={notaFiscal.produto.codDeBarras}
                                    disabled
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
                                    disabled
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
                                    disabled
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
                                                codFornecedor: codFornecedor.target.value
                                            }
                                        })}
                                    value={notaFiscal.produto.codFornecedor}
                                    disabled
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
                                                nomeFornecedor: nomeFornecedor.target.value
                                            }
                                        })}
                                    value={notaFiscal.produto.nomeFornecedor}
                                    disabled
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
                                    disabled
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
                                            nomeDestinatario: nomeDestinatario.target.value
                                        }
                                    })}
                                    value={notaFiscal.destinatario.nomeDestinatario}
                                    disabled
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
                                    disabled
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
                                    disabled
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
                                            endereco: endereco.target.value
                                        }
                                    })}
                                    value={notaFiscal.destinatario.endereco}
                                    disabled
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
                                            complemento: complemento.target.value
                                        }
                                    })}
                                    value={notaFiscal.destinatario.complemento}
                                    disabled
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
                                                bairro: bairro.target.value
                                            }
                                        })}
                                    value={notaFiscal.destinatario.bairro}
                                    disabled
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">Estado*</label>
                                <input
                                    id="obrigatorioNotaFiscal"
                                    className="form-control"
                                    type='text'
                                    placeholder="SC"
                                    maxLength={2}
                                    onChange={(estado) =>
                                        setNotaFiscal({
                                            ...notaFiscal,
                                            destinatario: {
                                                ...notaFiscal.destinatario,
                                                estado: estado.target.value
                                            }
                                        })}
                                    value={notaFiscal.destinatario.estado}
                                    disabled
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">Cidade*</label>
                                <input
                                    id="obrigatorioNotaFiscal"
                                    className="form-control"
                                    type='text'
                                    placeholder="Florianópolis"
                                    onChange={(cidade) =>
                                        setNotaFiscal({
                                            ...notaFiscal,
                                            destinatario: {
                                                ...notaFiscal.destinatario,
                                                cidade: cidade.target.value
                                            }
                                        })}
                                    value={notaFiscal.destinatario.cidade}
                                    disabled
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
                                                numero: numero.target.value
                                            }
                                        })}
                                    value={notaFiscal.destinatario.numero}
                                    disabled
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
                                                unidade: unidade.target.value
                                            }
                                        })}
                                    value={notaFiscal.produto.unidade}
                                    disabled
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
                                    disabled
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
                                    disabled
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
                                    disabled
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
                Código: {cadastro.cod} Nome: {cadastro.nome}
            </SweetAlert>
                : null
            }


            <div className="d-flex justify-content-center">
                <button type="button" className="btn btn-danger me-4" onClick={confirmarDeletarProduto}>
                    <i className="fa-solid fa-trash"></i>
                </button>
                <button type="submit" className="btn btn-primary ms-4" onClick={salvar}>
                    <i className="fa-solid fa-check"></i>
                </button>
            </div>

        </div>
    )
}

export default Editar