<template>
    <div class="hello">
        <h1>{{ msg }}</h1>

        <h2>Количество задач: {{taskCount}}</h2>
        <b-button
            label="Тест Buefy"
            size="is-small"
            @click="testBuefy"/>
        <b-button
            type="is-primary"
            label="Добавить задачу"
            @click="createNewTask"/>
        <b-button
            type="is-primary"
            :disabled="!storeContext.state.hasNotSavedChanges"
            label="Сохранить изменения"
            @click="saveChanges"/>
        <p>
            For a guide and recipes on how to configure / customize this project,<br>
            check out the
            <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
        </p>
        <h3>Installed CLI Plugins</h3>
        <ul>
            <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank"
                   rel="noopener">babel</a></li>
            <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript"
                   target="_blank" rel="noopener">typescript</a></li>
            <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-vuex" target="_blank"
                   rel="noopener">vuex</a></li>
        </ul>
        <h3>Essential Links</h3>
        <ul>
            <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
            <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
            <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
            <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
            <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
        </ul>
        <h3>Ecosystem</h3>
        <ul>
            <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
            <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
            <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank"
                   rel="noopener">vue-devtools</a></li>
            <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
            <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
        </ul>
    </div>
</template>

<script lang="ts">
import {DialogProgrammatic, ToastProgrammatic} from 'buefy';
import {Component, Prop, Vue} from 'vue-property-decorator';
import {rootStoreModule} from "@/store";
import moment from "moment";


@Component
export default class HelloWorld extends Vue {
    @Prop() private msg!: string;

    get storeContext() {
        return rootStoreModule.context(this.$store)
    }

    createNewTask() {
        this.storeContext.actions.createTask({
            name: "Какая-то новая задача",
            begin: moment(),
            end: moment().add(1, 'hour')
        })
    }

    async saveChanges() {
        await this.storeContext.actions.saveChanges({})
        ToastProgrammatic.open(`Изменения сохранены`)
    }

    get taskCount() {
        return this.storeContext.getters.tasks.length
    }

    testBuefy() {
        DialogProgrammatic.confirm({
            message: "Тестовое сообщение",
            onConfirm: () => {
                const ctx = rootStoreModule.context(this.$store);
                ToastProgrammatic.open(`Тестовый ${ctx.getters.defaultTaskType}`);
            },
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
