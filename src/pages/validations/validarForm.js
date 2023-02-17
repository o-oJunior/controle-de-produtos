function validarForm(produto) {
    const campoObrigatorioCadastro = document.querySelectorAll('#obrigatorioCadastro')
    const campoObrigatorioNotaFiscal = document.querySelectorAll('#obrigatorioNotaFiscal')
    const campoData = document.querySelectorAll('#obrigatorioNotaFiscalData')
    const campoCnpj = document.querySelectorAll('#obrigatorioNotaFiscalCnpj')
    const campoCep = document.querySelectorAll('#obrigatorioNotaFiscalCep')
    const campoCpf = document.querySelectorAll('#obrigatorioNotaFiscalCpf')
    let tipoProduto = 0
    let venda = 0

    const setSucesso = (elemento) => {
        elemento.classList.remove('is-invalid')
        elemento.classList.add('is-valid')
    }

    const setErro = (elemento) => {
        elemento.classList.remove('is-valid')
        elemento.classList.add('is-invalid')
    }


    campoObrigatorioCadastro.forEach(campo => {
        if (campo.classList[0] === 'form-control') {
            if (campo.value.length < 1) {
                setErro(campo)

            } else {
                setSucesso(campo)
            }
        } else if (campo.classList[0] === 'form-select') {
            if (campo.value.length < 1) {
                setErro(campo)

            } else {
                setSucesso(campo)
            }
        } else if (campo.classList[0] === 'form-check-input') {
            if (campo.name === 'produto') {
                if (campo.value === '' && tipoProduto < 1) {
                    setErro(campo)
                } else {
                    tipoProduto = 1
                    setSucesso(campo)
                }
            } else {
                if (campo.value === '' && venda < 1) {
                    setErro(campo)
                } else {
                    venda = 1
                    setSucesso(campo)
                }
            }
        }
    })

    if (produto === 'comprado') {
        campoObrigatorioNotaFiscal.forEach(campo => {
            if (campo.classList[0] === 'form-control') {
                if (campo.value.length < 1) {
                    setErro(campo)
                } else {
                    setSucesso(campo)
                }
            } else if (campo.classList[0] === 'form-select') {
                if (campo.value.length < 1) {
                    setErro(campo)
                } else {
                    setSucesso(campo)
                }
            }
        })

        campoCnpj.forEach(campo => {
            if (campo.value.length <= 17) {
                setErro(campo)
            } else {
                setSucesso(campo)
            }
        })

        campoData.forEach(campo => {
            if (campo.value.length < 9) {
                setErro(campo)
            } else {
                setSucesso(campo)
            }
        })

        campoCep.forEach(campo => {
            if (campo.value.length <= 8) {
                setErro(campo)
            } else {
                setSucesso(campo)
            }
        })

        campoCpf.forEach(campo => {
            if (campo.value.length <= 13) {
                setErro(campo)
            } else {
                setSucesso(campo)
            }
        })

    }

}


export default validarForm