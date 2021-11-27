<template>
    <div class="modal-card" style="width: 500px;margin: 0 auto;">
    <header class="modal-card-head">
        <p class="modal-card-title">{{ Title }}</p>
        <button
            type="button"
            class="delete"
            @click="$emit('close')"/>
    </header>
    <section class="modal-card-body">
        <b-field label="Название категории" horizontal>
            <b-input
                type="text"
                :value="Name"
                placeholder="Название категории"
                @input="OnChangeName"
                required>
            </b-input>
        </b-field>

        <b-field label="Цвет" horizontal>
            <b-input
                type="color"
                :value="Color"
                @input="OnChangeColor"
                required>
            </b-input>
        </b-field>
    </section>
    <footer class="modal-card-foot">
        <b-button
            label="Отмена"
            @click="$emit('close')" />
        <b-button
            :label="BtnText"
            @click="save()"
            type="is-primary" />
    </footer>
</div>

</template>
<script lang="ts">
import {Component, Vue, Prop} from "vue-property-decorator";
@Component
export default class EditCategoryComponent extends Vue{
    @Prop() public Name? : string;
    @Prop() public Color? : string;
    @Prop() public Title? : string;
    @Prop() public BtnText? : string;

    private name?:string; 
    private color?:string; 

    private save(){
        this.name = this.name || this.Name;
        this.color = this.color || this.Name;
        this.$emit('save',{'Name': this.name, 'Color':this.color});
    }
    private OnChangeName(value: any){
        this.name = value;
    }
    private OnChangeColor(value: any){
        this.color = value;
    }
}
</script>
<style scoped>

</style>