import Vue from 'vue'

//#region Buefy

import buefy from 'buefy'
import 'buefy/dist/buefy.css'
import "bulma/sass/utilities/_all.sass";

// Доступные опции buefy здесь:
// https://buefy.org/documentation/constructor-options
// Если встретится латиница в интерфейсе, то стоит
// сначала попробовать добавить перевод здесь и, если не получается,
// то менять текст у отдельного экземпляра компонента
Vue.use(buefy, {
  defaultDialogCancelText: "Отмена",
  defaultDialogConfirmText: "Принять",
  defaultIconComponent: 'fa-icon',
  defaultIconPack: 'fas',
})

//#endregion

//#region FontAwesome

import {library} from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

library.add(fas)
Vue.component('fa-icon', FontAwesomeIcon)

//#endregion

import './index.scss'
import {store} from "@/store";
import App from './App.vue'

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
