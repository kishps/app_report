class FilterTasks {

    _buttonAdd = '';
    _containerAdd = '';
    filterLists = {};
    filterFields = {};


    constructor(params = {}) {
        this._buttonAdd = (params.buttonAdd) ? params.buttonAdd : '.js-add-task-filter'; // селектор кнопки
        this._containerAdd = (params.containerAdd) ? params.containerAdd : '.field-task-filter'; // селектор контейнера

        (async () => {
            this.filterFields = await this.getTaskFields();
            this.addFieldsToSelect();
        })().catch(error => console.log('Error:', error));
    }


    async getTaskFields() {
        let bx24 = new BX24Wrapper();
        bx24.progress = percent => console.log(`progress: ${percent}%`);
        let result = await bx24.callListMethod('tasks.task.getFields', {});
        console.log('tasks.task.getFields', result);
        return result[0].fields;
    }

    addFieldsToSelect() {
        let filterFields = this.filterFields;
        //console.log('filterFields', filterFields);
        for (let fieldItem in filterFields) {

            let titleField = (filterFields[fieldItem].title) ? filterFields[fieldItem].title : fieldItem;

            $(this._buttonAdd).append(`<option value="${fieldItem}">${titleField}</option>`);
            

            //console.log('titleField', titleField);
            //console.log('select[data-new="y"]', $('select[data-new="y"]'));
            $(this._containerAdd).append(`<div class='field-item new-item' data-value="${fieldItem}">
                                            <div data-field-code="${fieldItem}" class="fieldVal"></div>
                                        </div>`);

            switch (filterFields[fieldItem].type) {
                case 'enum':
                    $(`div[data-field-code="${fieldItem}"]`).html(`<div>
                                                                        TITLE: ${filterFields[fieldItem].title}<br>
                                                                        CODE: ${fieldItem}
                                                                    </div><select class="field-select-values" data-field-code="${fieldItem}"></select>`);
                    for (let fieldValue in filterFields[fieldItem].values) {
                        $(`select[data-field-code="${fieldItem}"]`).append(`<option value="${fieldValue}">${filterFields[fieldItem].values[fieldValue]}</option>`);
                    }
                    break;
                default:
                    $(`div[data-field-code="${fieldItem}"]`).html(` <div>
                                                                        TITLE: ${filterFields[fieldItem].title}<br>
                                                                        CODE: ${fieldItem}
                                                                    </div>
                                                                    <input class="field-select-values"
                                                                           data-field-type="${filterFields[fieldItem].type}"
                                                                           ${(filterFields[fieldItem].default)?'value="'+filterFields[fieldItem].default+'"':''}
                                                                           data-field-code="${fieldItem}"
                                                                    />`);
                    break;
            }

        }


        $(this._buttonAdd).change( function() {
            let showOpt = $(this).val();
            console.log('showOpt', showOpt);
            $(`.field-item.new-item[data-value="${showOpt}"]`).show();
        });
    }


}