import { Symbol } from './symbol';
import { Country } from './country';

export class Currency {
    currencyId: Number;
    // active: Boolean;
    code: string='';
    name: String;
    symbol: Symbol;
    country: Country;
}

export const CurrencyList: Currency[] = [
    {
        currencyId: null,
        //  active: null,
        code: null,
        name: null,
        symbol: null,
        country: null
    }
];