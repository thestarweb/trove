import {createI18n} from "vue-i18n";


const i18n = createI18n({
	locale:"zh-Hans",
	messages:{
		"zh-Hans":require("./zh-Hans.json"),
		"zh-Hant":{}
	}
});
export default i18n;
