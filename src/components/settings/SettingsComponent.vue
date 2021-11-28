<template>
    <div class="wrapper">
        <div class="dialog-name">
            <p>Настройки приложения</p>
        </div>
        <div class="content">
            <div class="left-content">
                <TimeSetting v-if="currentSetting == 1"/>
                <StorageSetting v-if="currentSetting == 2"/>
                <CategorySetting v-if="currentSetting == 3"/>
            </div>
            <div class="right-content">
                <div class="setting-list">
                    <button v-bind:class="{isButtonActive : currentSetting == 1}" @click="changeSetting(1)">Время</button>
                    <button v-bind:class="{isButtonActive : currentSetting == 2}" @click="changeSetting(2)">Хранилище</button>
                    <button v-bind:class="{isButtonActive : currentSetting == 3}" @click="changeSetting(3)">Категории</button>
                </div>
                <div class="setting-actions">
                    <p class="control is-fullwidth is-expanded">
                        <b-button label="Закрыть" type="is-info" @click="$emit('close')"/>
                    </p>
                    <p class="control is-fullwidth is-expanded">
                        <b-button label="Сохранить" type="is-info" @click="saveSettings"/>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {SnackbarProgrammatic} from "buefy";
import TimeSetting from '@/components/settings/TimeSetting.vue'
import StorageSetting from '@/components/settings/StorageSetting.vue'
import CategorySetting from '@/components/settings/CategorySetting.vue'
@Component({
  components: {
      TimeSetting,
      StorageSetting,
      CategorySetting
  },
})
export default class SettingsComponent extends Vue{
    public currentSetting : number = 1;
    private saveSettings(){
        SnackbarProgrammatic.open({
            message: "Кнопка сохранить еще не реализована",
            type: 'is-warning',
            position: 'is-top',
        });
        console.log(this.currentSetting);
    }
    private changeSetting(newSetting :number){
        this.currentSetting = newSetting;
    }
}
</script>
<style scoped>
    .wrapper{
        background: white;
    }
    .dialog-name{
        border-bottom: 1px solid #c9c9c9;
        padding: 5px 10px;
    }
    .dialog-name p{
        font-size: 2em;
    }
    .content{
        display: flex;
        height: 500px;
    }
    .left-content{
        width: 75%;
        padding: 10px;
    }
    .right-content{
        width: 25%;
        position: relative;
        border-left: 1px solid #c9c9c9;
        padding: 10px;
    }
    .setting-list{
        height: 75%;
    }
    .setting-list button{
        display: block;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.1em;
        color: #2c6eb7;
        margin-bottom: 10px;
    }
    .setting-list button:hover{
        text-decoration: underline;
    }
    .setting-actions{
        position: absolute;
        bottom: 10px;
        left: 10px;
        right: 10px;
    }
    .setting-actions button{
        width: 100%;
    }
    .isButtonActive{
        text-decoration: underline;
    }

</style>