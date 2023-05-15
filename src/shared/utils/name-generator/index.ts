import { uniqueNamesGenerator } from "unique-names-generator";
import { getRandomInt } from "../number-utils";
import { animals } from "./dictionaries/animals";
import { colors } from "./dictionaries/colors";
import { cools } from "./dictionaries/cools";
import { fruits } from "./dictionaries/fruits";
import { marvels } from "./dictionaries/marvels";
import { new202010 } from "./dictionaries/new202010";

export default class NameGenerator {
    public static generateName(): string {
        const dictionaries = [colors, animals, marvels, fruits, cools, new202010];

        const randomDictionaryIndex = getRandomInt(dictionaries.length);
        const pickedDictionary = dictionaries[randomDictionaryIndex];

        const shortName = uniqueNamesGenerator({
            dictionaries: [pickedDictionary],
            separator: "",
            length: 1,
        });

        const numberLength = shortName.length < 10 ? 5 : 14 - shortName.length;
        let maxNumber = "";
        for (let i = 0; i < numberLength; i++) {
            maxNumber = `9${maxNumber}`;
        }
        const randomNumber = getRandomInt(+maxNumber);

        return `${shortName}${randomNumber}`;
    }
}
