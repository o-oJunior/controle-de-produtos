import React, { useRef } from "react";

function VisualizarProduto({ produto }) {
    const fabricadoRef = useRef(false)

    const compradoRef = useRef(false)

    const ativadoRef = useRef(false)

    const desativadoRef = useRef(false)

    if(produto.produto === 'comprado'){
        compradoRef.current = true
    } else {
        fabricadoRef.current = true
    }

    if(produto.statusVenda === 'ativado'){
        ativadoRef.current = true
    } else {
        desativadoRef.current = true
    }
    
    return (
        <div className="container">
            <form className="row g-3">
                <div className="col-md-2">
                    <label className="form-label">Código</label>
                    <input
                        className="form-control"
                        placeholder={produto.cod}
                        disabled
                    />
                </div>

                <div className="col-md-5">
                    <label className="form-label">Nome</label>
                    <input
                        className="form-control"
                        placeholder={produto.nome}
                        disabled
                    />
                </div>

                <div className="col-md-2">
                    <label className="form-label">Marca</label>
                    <input
                        className="form-control"
                        placeholder={produto.marca}
                        disabled
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label">Unidade</label>
                    <input
                        className="form-control"
                        placeholder={produto.unidade}
                        disabled
                    />
                </div>

                <div className="col-md-2">
                    <label className="form-label">Quantidade</label>
                    <input
                        className="form-control"
                        placeholder={produto.qntd}
                        disabled
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label">Estoque minimo</label>
                    <input
                        className="form-control"
                        placeholder={produto.estoqueMin}
                        disabled
                    />
                </div>


                <fieldset className="col mt-2">
                    <label className="pt-2">Produto:</label>
                    <div className="col">
                        <div className="form-check">
                            <input
                                id="obrigatorioCadastro"
                                className="form-check-input"
                                type="radio"
                                name="exampleRadios"
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
                    <label className="pt-2">Venda:</label>
                    <div className="col">
                        <div className="form-check">
                            <input
                                id="obrigatorioCadastro"
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                checked={ativadoRef.current}
                                disabled
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
                                checked={desativadoRef.current}
                                disabled
                            />
                            <label className="form-check-label">
                                Desativado
                            </label>
                        </div>
                    </div>
                </fieldset>

                <div>
                    {produto.produto === 'comprado' &&
                        <div className="row g-3" >
                            <div className="col-md-6">
                                <label className="form-label">Código de barras</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.produto.codDeBarras}
                                    disabled
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Data de emissão</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.produto.dtEmissao}
                                    disabled
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Data de entrada</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.produto.dtEntrada}
                                    disabled
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Código fornecedor</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.produto.codFornecedor}
                                    disabled
                                />
                            </div>

                            <div className="col-md-5">
                                <label className="form-label">Nome fornecedor</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.produto.nomeFornecedor}
                                    disabled
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">CNPJ</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.produto.cnpj}
                                    disabled
                                />
                            </div>

                            <div className="col-md-5">
                                <label className="form-label">Nome / Razão social</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.destinatario.nomeDestinatario}
                                    disabled
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">CPF</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.destinatario.cpf}
                                    disabled
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">CEP</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.destinatario.cep}
                                    disabled
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Endereço</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.destinatario.endereco}
                                    disabled
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Complemento</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.destinatario.complemento}
                                    disabled
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Bairro</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.destinatario.bairro}
                                    disabled
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">Cidade</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.destinatario.cidade}
                                    disabled
                                />
                            </div>

                            <div className="col-md-1">
                                <label className="form-label">UF</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.destinatario.estado}
                                    disabled
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">Número</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.destinatario.numero}
                                    disabled
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Unidade</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.produto.unidade}
                                    disabled
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">R$ Unitário</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.produto.precoUnitario}
                                    disabled
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">R$ Frete</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.produto.precoFrete}
                                    disabled
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">R$ Total</label>
                                <input
                                    className="form-control"
                                    placeholder={produto.notaFiscal.produto.precoTotal}
                                    disabled
                                />
                            </div>
                        </div>
                    }
                </div>

                <div className="col-md-2">
                    <label className="form-label">R$ Venda</label>
                    <input
                        className="form-control"
                        placeholder={produto.precoVenda}
                        disabled
                    />
                </div>

            </form>
        </div>
    )
}


export default VisualizarProduto;