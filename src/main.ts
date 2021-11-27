import Vue from 'vue'
import buefy from 'buefy'
import 'buefy/dist/buefy.css'
import "bulma/sass/utilities/_all.sass";
import './index.scss'
import {store} from "@/store";
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

// Доступные опции buefy здесь:
// https://buefy.org/documentation/constructor-options
// Если встретится латиница в интерфейсе, то стоит
// сначала попробовать добавить перевод здесь и, если не получается,
// то менять текст у отдельного экземпляра компонента
Vue.use(buefy, {
  defaultDialogCancelText: "Отмена",
  defaultDialogConfirmText: "Принять",
  defaultIconPack: 'fas'
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
