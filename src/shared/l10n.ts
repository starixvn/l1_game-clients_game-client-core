
declare global {
    interface Window { l10n: any; }
}

export const l10n = {
    t: (key: string, option?: any) => {
        return window.l10n.t(key, option);
    }
}
