function maskCNPJ(value) {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
    return value;
}

function maskCPF(value) {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
}

function maskCEP(value) {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d{1,3})$/, "$1-$2");
    return value;
}

function maskDATE(value) {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/, "$1/$2");
    value = value.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    return value;
}


export { maskCEP, maskCNPJ, maskCPF, maskDATE }

