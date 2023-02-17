import React from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

const defaultMaskOptions = {
    prefix: 'Nº ',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '',
    allowDecimal: true,
    decimalSymbol: '',
    decimalLimit: 0,
    allowNegative: false,
    allowLeadingZeroes: false,
}

const InputMaskNumber = ({ maskOptions, ...inputProps }) => {
    const currencyMask = createNumberMask({
        ...defaultMaskOptions,
        ...maskOptions,
    })

    return <MaskedInput mask={currencyMask} {...inputProps} />
}

InputMaskNumber.defaultProps = {
    inputMode: 'numeric',
    maskOptions: {},
}

InputMaskNumber.propTypes = {
    inputmode: PropTypes.string,
    maskOptions: PropTypes.shape({
        prefix: PropTypes.string,
        suffix: PropTypes.string,
        thousandsSeparatorSymbol: PropTypes.string,
        decimalSymbol: PropTypes.string,
        decimalLimit: PropTypes.string,
        integerLimit: PropTypes.number,
    }),
}

export default InputMaskNumber;
