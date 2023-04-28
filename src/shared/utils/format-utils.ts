export namespace FormatUtils {
    export const formatOdds = (value: number, fractional: boolean) => {
        return fractional ? `${numberWithCommas(+value - 1, 2)}:1` : `1:${value}`;
    };

    const formatCommasReg = /\B(?=(\d{3})+(?!\d))/g;
    export const numberWithCommas = (number, toFixed = 1, noZeroSuffix = true) => {
        if (number) {
            let trimZeroNumber;
            if (noZeroSuffix) {
                trimZeroNumber = `${+(+number).toFixed(toFixed)}`;
            } else {
                trimZeroNumber = (+number).toFixed(toFixed);
            }
            return trimZeroNumber.replace(formatCommasReg, ",");
        }

        return "0";
    };
}
