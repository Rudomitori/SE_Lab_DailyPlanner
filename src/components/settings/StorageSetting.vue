<template>
    <div>
        <div class="title">
            <p>Настройки хранилища</p>
        </div>
        <div class="storage-list">
            <div class="storage-item" v-for="item in storageItems" :key="item.Name" @click="selectItem(item)">
                <div class="item-icon">
                    <b-icon
                        pack="fas"
                        :icon="item.Icon"
                        :class="{IsActiveItem : item.IsActive}"
                        size="is-large"></b-icon>
                </div>
                <div class="item-name">
                    <p>{{ item.Name }}</p>
                    
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
@Component
export default class StorageSetting extends Vue{
    private storageItems? : any = [
        {Name : 'Файл', Icon: 'file',IsActive: false},
        {Name : 'Браузер', Icon: 'globe',IsActive: true},
        {Name : 'Облако', Icon: 'cloud',IsActive: false}
    ];
    private selectItem(item: any){
        this.storageItems?.forEach((item : any) => {item.IsActive = false});
        item.IsActive = true;

    }
}
</script>
<style scoped>
    .title{
        font-size: 1.1em;
        margin-bottom: 20px;
    }
    .storage-list{
        display: flex;
        justify-content: space-evenly;
    }
    .storage-item{
        height: 100px;
        display: inline-block;
        cursor: pointer;
    }
    .storage-item .item-icon{
        color: grey;
    }
    .item-icon{
        font-size: 2em;
        text-align: center;
    }
    .item-name{
        text-align: center;
    }
    .storage-item:hover .item-icon{
        color: black;
    }
    .IsActiveItem{
        color: rgb(0,255,0) !important;
    }
</style>