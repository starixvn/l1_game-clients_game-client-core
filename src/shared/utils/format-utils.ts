export namespace FormatUtils {
    export const formatOdds = (value: number, fractional: boolean) => {
        return fractional ? `${numberWithCommas(+value - 1, 2)}:1` : `1:${value}`;
    };

    const formatCommasReg = /\B(?=(\d{3})+(?!\d))/g;

    export const numberWithCommas = (number: number, toFixed = 1, noZeroSuffix = true): string => {
        if (!number) {
            return "0";
        }

        let trimZeroNumber: string;
        if (noZeroSuffix) {
            trimZeroNumber = (+number).toFixed(toFixed).replace(/\.0+$/, "");
        } else {
            trimZeroNumber = (+number).toFixed(toFixed);
        }

        return trimZeroNumber.replace(formatCommasReg, ",");
    };
}
