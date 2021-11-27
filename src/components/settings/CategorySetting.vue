<template>
    <div>
        <div class="title">
            <p>Категории <b-icon
                pack="fas"
                icon="plus"
                style="cursor:pointer;"
                @click.native="newCategory()"
                size="is-little"></b-icon> </p>
            
        </div>
        <div>
           <b-table :data='testData'>
               <b-table-column field="Number" label="Номер" width="40" sortable numeric v-slot="props">
                   {{ props.row.Number }}
                </b-table-column>
                <b-table-column field="Name" label="Название" sortable v-slot="props">
                   {{ props.row.Name }}
                </b-table-column>
                <b-table-column field="Color" label="Цвет" v-slot="props">
                   <div :style="getCategoryColorStyle(props.row.Color)"></div>
                </b-table-column>
                <b-table-column field="" label="" width="80" v-slot="props">
                   <b-icon
                        pack="fas"
                        icon="edit"
                        style="cursor:pointer;"
                        @click.native="editCategory(props.row)"
                        size="is-little"></b-icon>
                    <b-icon
                        pack="fas"
                        icon="trash-alt"
                        style="margin-left:5px; cursor:pointer;"
                        @click.native="removeCategory(props.row.Number)"
                        size="is-little"></b-icon>
                </b-table-column>
           </b-table>
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {ModalProgrammatic} from "buefy";
import EditCategoryComponent from '@/components/settings/EditCatoryComponent.vue'
@Component
export default class TimeSetting extends Vue{
    private testData: any = [
        {Number: 1, Name: 'Название 1',Color: '#ff0000'},
        {Number: 2, Name: 'Название 2',Color: '#00ff00'},
        {Number: 3, Name: 'Название 3',Color: '#0000ff'},
    ]
    private getCategoryColorStyle(color : string){
        return 'width:30px;height:30px;background:' + color;
    }
    private editCategory(row: any){
        const modal = ModalProgrammatic.open({
            parent: this,
            component: EditCategoryComponent,
            props:{
                'Title': 'Редактирование категории',
                'BtnText': 'Сохранить',
                'Name': row.Name,
                'Color': row.Color
            },
            events:{
                'save': (data : any) => {
                    console.log('save',data);
                    row.Name = data.Name;
                    row.Color = data.Color;
                    modal.close();
                }         
            }
        })
    }
    private newCategory(){
        const modal = ModalProgrammatic.open({
            parent: this,
            component: EditCategoryComponent,
            props:{
                'Title': 'Добавление категории',
                'BtnText': 'Добавить',
                'Name': '',
                'Color': '#000000'
            },
            events:{
                'save': (data : any) => {
                    console.log('save',data);
                    let maxId : number = 0;
                    this.testData.forEach((item : any) => {if(item.Number > maxId) maxId = item.Number});
                    this.testData.push({
                        Number: maxId+1,
                        Name: data.Name,
                        Color: data.Color
                    });
                    modal.close();
                }         
            }
        })
    }
    private removeCategory(number: number){
        this.testData = this.testData.filter((item : any) => item.Number != number);
    }
}
</script>
<style scoped>
    
    .title{
        font-size: 1.1em;
        margin-bottom: 20px;
    }
</style>