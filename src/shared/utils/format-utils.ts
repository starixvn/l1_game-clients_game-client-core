export namespace FormatUtils {
    export const formatOdds = (value: number, fractional: boolean) => {
        return fractional ? `${numberWithCommas(+value - 1, 2)}:1` : `1:${value}`;
    };

    const formatCommasReg = /\B(?=(\d{3})+(?!\d))/g;
    export const numberWithCommas = (number: number, toFixed = 1, noZeroSuffix = true) => {
        if (number) {
            let trimZeroNumber: string;
            if (noZeroSuffix) {
                trimZeroNumber = `${+(+number).toFixed(toFixed)}`;
            } else {
                trimZeroNumber = (+number).toFixed(toFixed);
            }
            return trimZeroNumber.replace(formatCommasReg, ",");
        }

        return "0";
    };

    export const truncateFixedDecimals = (number: number, fixed: number) => {
        const withFixedDecimals = `${number}`.match(new RegExp(`^-?\\d+(?:\.\\d{0,${fixed}})?`))[0];
        return parseFloat(withFixedDecimals).toString().replace(formatCommasReg, ",");
    };
}
