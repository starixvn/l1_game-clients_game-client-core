import * as _ from "lodash";

const languageId = "zh_cn";
const tolgeeUrl =
    `https://tolgee.sabagame.com/v2/projects/5/translations?ak=tgpak_gvpw45brha2xg3btoztxeytunvudc5dbn5twqodtonztc&size=1000&filterNamespace=Common,DragonTigerFight&languages=` +
    languageId;

async function loadTolgee() {
    const statusResponse = await fetch(tolgeeUrl);
    const tolgeeData = await statusResponse.json();

    const groupedByNamespace = _.groupBy(tolgeeData._embedded.keys, (key) => key.keyNamespace);

    const languages = {};

    if (Object.keys(groupedByNamespace).length > 0) {
        Object.keys(groupedByNamespace).forEach((key) => {
            const namespaceTranslation = {};

            groupedByNamespace[key].forEach((element) => {
                namespaceTranslation[element.keyName] = element.translations[languageId].text;
            });

            languages[key] = namespaceTranslation;
        });
        console.log(languages);
    } else {
        console.log("Load failed");
    }
}

loadTolgee();
