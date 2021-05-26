class ReportTable {

    selector = '.report-table'; //контейнер отчета

    objShowFields = { title: "Задача", durationFact: "Затраченное время", closedDate: 'Дата закрытия', subStatus: 'Cтатус' };

    constructor(selector) {
        if (selector) this.selector = selector; // контейнер отчета
    }


    setShowFields(params) {
        this.objShowFields = params;

    }


    sortArrayObjects(arSortable, sortableProperty, sort = 'asc') {
        return arSortable.sort(function (a, b) {
            a[sortableProperty] = (a[sortableProperty]) ? a[sortableProperty] : 0;
            b[sortableProperty] = (b[sortableProperty]) ? b[sortableProperty] : 0;
            if (a[sortableProperty] > b[sortableProperty]) {
                return (sort == 'asc') ? 1 : -1;
            }
            if (a[sortableProperty] < b[sortableProperty]) {
                return (sort == 'asc') ? -1 : 1;
            }
            // a должно быть равным b
            return 0;
        });
    }

    minToHour(time) {
        if (!time) return '0 м';
        let h = time / 60 ^ 0;
        if (h) {
            let m = time % 60;
            if (m < 10) m = '0' + m;
            time = h + ' ч ' + m + ' м';
        } else {
            time = time + ' м';
        }
        return time;
    }

    setData(params) {
        this.tasks = params.tasks;
        this.groups = params.groups;
        console.log('this', this);
    }

    renderReport() {
        $(this.selector).html(''); //отчищение контейнера
        let arrGroups = this.groups;
        let groupsKeys = Object.keys(arrGroups);

        let that = this;
        groupsKeys.map(function (groupKey) {
            if (groupKey != 'total') {

                let divGroup = that.addDivGroup(groupKey);
                $(that.selector).append(divGroup);
                if ($(`.infobar[data-id="${groupKey}"]`).data('progress'))
                    $(`.chart-plan[data-id="${groupKey}"]`).progressbar({
                        value: $(`.infobar[data-id="${groupKey}"]`).data('progress')
                    });
            }
        });
    }

    addDivGroup(groupKey) {
        let arGroups = this.groups;
        let arTasks = this.tasks;

        let nameGroup = this.nameGroup(groupKey)
        let progressbar = this.progressbar(groupKey);
        let infobar = this.infobar(groupKey);
        let detailInfo = this.detailInfo(groupKey);

        return `<div class="group-item" data-grid="${groupKey}">
                    ${nameGroup}
                    ${progressbar}
                    ${infobar}
                    ${detailInfo}
                </div>`;
    }

    nameGroup(groupKey) {
        return `<div class="group-name">
                    ${this.groups[groupKey].name}
                </div>`
    }

    progressbar(groupKey) {
        return `<div data-id="${groupKey}" class="chart-plan">
                    <div class="progress-label"></div>
                    <div class="tariff-label"></div>
                </div>`
    }

    infobar(groupKey) {
        let totalTasks = this.groups[groupKey].count;
        let totalClosedTasks = this.tasks[groupKey].reduce(function (accumulator, task) {
            if (task.closedDate) { return accumulator + 1; }
            else { return accumulator + 0; }
        }, 0);

        let timeTariff = (this.groups[groupKey].timeTariff) ? this.groups[groupKey].timeTariff : '';
        let timeTarifffinaly = '';
        if (timeTariff) {
            let timeTariff1 = this.minToHour(timeTariff);
            timeTarifffinaly = `<div class="infobar-label">
                            <span class="label-name">Время по тарифу</span>
                            ${timeTariff1}
                        </div>`
        }
        let timeDurationFact = (this.groups[groupKey].durationFact) ? this.groups[groupKey].durationFact : '';
        let timeLeftOver = '';
        let progressVal = '';
        if (timeTariff && timeTariff - timeDurationFact > 0) {
            progressVal = `data-progress="${timeDurationFact / timeTariff * 100}"`;
            timeLeftOver = `<div class="infobar-label">
                                    <span class="label-name">Осталось</span>
                                    ${this.minToHour(timeTariff - timeDurationFact)}
                                </div>`;
        } else if (timeTariff && timeTariff - timeDurationFact < 0) {
            progressVal = `data-progress="${timeDurationFact / timeTariff * 100}"`;
            timeLeftOver = `<div class="infobar-label">
                                    <span class="label-name">Перерасход</span>
                                    ${this.minToHour(timeDurationFact - timeTariff)}
                                </div>`;
        } else if (timeTariff && timeTariff - timeDurationFact == 0) {
            progressVal = `data-progress="100"`;
        }
        console.log('timeTariff', timeTariff);
        return `<div data-id="${groupKey}" class="infobar" ${progressVal}>
                    <div class="infobar-label">
                        <span class="label-name">Всего задач</span>
                        ${totalTasks}
                    </div>
                    <div class="infobar-label">
                        <span class="label-name">Завершено</span>
                        ${totalClosedTasks}
                    </div>
                    ${timeTarifffinaly}
                    <div class="infobar-label">
                        <span class="label-name">Затрачено</span>
                        ${this.minToHour(timeDurationFact)}
                    </div>
                    ${timeLeftOver}
                </div>`;
    }

    getTbody(groupKey) {
        let arrTasksGroup = this.tasks[groupKey];
        console.log('arrTasksGroup', arrTasksGroup);
        let arrTd = '';
        let objShowFields = this.objShowFields;
        arrTasksGroup.map((task) => {
            arrTd += '<tr>';
            Object.keys(objShowFields).map((field) => {
                let td;
                switch (field) {
                    case 'title':
                        td = `<td data-field="${field}"><a target="_blank" href="https://csn.bitrix24.ru/workgroups/group/${task.group.id}/tasks/task/view/${task.id}/">${task[field]}</a></td>`;
                        break;
                    case 'durationFact':
                    case 'durationPlan':
                    case 'timeEstimate':
                        td = `<td data-field="${field}">${this.minToHour(task[field])}</td>`;
                        break;
                    case 'changedDate':
                    case 'closedDate':
                    case 'createdDate':
                    case 'deadline':
                    case 'statusChangedDate':
                    case 'viewedDate':
                        td = `<td data-field="${field}">${(task[field])?new Date(task[field]).toLocaleDateString():''}</td>`;
                        break;
                    case 'status':
                    case 'subStatus':
                        let status = task[field];
                        let statusColor = '';
                        switch (status) {
                            case '-3':
                                statusColor = "#fba50b";
                                td = `<td title="Задача почти просрочена" data-status="${status}" data-field="${field}"><svg width="154" height="21" viewBox="0 0 154 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g class="status">
                                                        <rect class="status56" x="0.5" y="0.5" width="153" height="20" fill="#C4C4C4" stroke="black"/>
                                                        <rect class="status12" x="0.5" y="0.5" width="21" height="20" fill="${statusColor}" stroke="black"/>
                                                        <rect class="status3" x="21.5" y="0.5" width="35" height="20" fill="#C4C4C4" stroke="black"/>
                                                        <rect class="status4" x="56.5" y="0.5" width="35" height="20" fill="#C4C4C4" stroke="black"/>
                                                        </g>
                                                        </svg>
                                                    </td>`;
                                break;
                            case '-2':
                                statusColor = "#efc100";
                                td = `<td title="Не просмотренная задача" data-status="${status}" data-field="${field}"><svg width="154" height="21" viewBox="0 0 154 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g class="status">
                                                        <rect class="status56" x="0.5" y="0.5" width="153" height="20" fill="#C4C4C4" stroke="black"/>
                                                        <rect class="status12" x="0.5" y="0.5" width="21" height="20" fill="${statusColor}" stroke="black"/>
                                                        <rect class="status3" x="21.5" y="0.5" width="35" height="20" fill="#C4C4C4" stroke="black"/>
                                                        <rect class="status4" x="56.5" y="0.5" width="35" height="20" fill="#C4C4C4" stroke="black"/>
                                                        </g>
                                                        </svg>
                                                    </td>`;
                                break;
                            case '-1':
                                statusColor = "#df412d";
                                td = `<td title="Задача просрочена" data-status="${status}" data-field="${field}"><svg width="154" height="21" viewBox="0 0 154 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g class="status">
                                                        <rect class="status56" x="0.5" y="0.5" width="153" height="20" fill="#C4C4C4" stroke="black"/>
                                                        <rect class="status12" x="0.5" y="0.5" width="21" height="20" fill="${statusColor}" stroke="black"/>
                                                        <rect class="status3" x="21.5" y="0.5" width="35" height="20" fill="#C4C4C4" stroke="black"/>
                                                        <rect class="status4" x="56.5" y="0.5" width="35" height="20" fill="#C4C4C4" stroke="black"/>
                                                        </g>
                                                        </svg>
                                                    </td>`;
                                break;
                            case '2':
                                statusColor = "#50ffe6";
                                td = `<td title="Ждет выполнения" data-status="${status}" data-field="${field}"><svg width="154" height="21" viewBox="0 0 154 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g class="status">
                                                        <rect class="status56" x="0.5" y="0.5" width="153" height="20" fill="#C4C4C4" stroke="black"/>
                                                        <rect class="status12" x="0.5" y="0.5" width="21" height="20" fill="${statusColor}" stroke="black"/>
                                                        <rect class="status3" x="21.5" y="0.5" width="35" height="20" fill="#C4C4C4" stroke="black"/>
                                                        <rect class="status4" x="56.5" y="0.5" width="35" height="20" fill="#C4C4C4" stroke="black"/>
                                                        </g>
                                                        </svg>
                                                    </td>`;
                                break;
                            case '3':
                                statusColor = "#0800ff";
                                td = `<td title="Выполняется" data-status="${status}" data-field="${field}"><svg width="154" height="21" viewBox="0 0 154 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g class="status">
                                                        <rect class="status56" x="0.5" y="0.5" width="153" height="20" fill="#C4C4C4" stroke="black"/>
                                                        <rect class="status12" x="0.5" y="0.5" width="21" height="20" fill="${statusColor}" stroke="black"/>
                                                        <rect class="status3" x="21.5" y="0.5" width="35" height="20" fill="${statusColor}" stroke="black"/>
                                                        <rect class="status4" x="56.5" y="0.5" width="35" height="20" fill="#C4C4C4" stroke="black"/>
                                                        </g>
                                                        </svg>
                                                    </td>`;
                                break;
                            case '4':
                                statusColor = "#4ba984";
                                td = `<td title="Ожидает контроля" data-status="${status}" data-field="${field}"><svg width="154" height="21" viewBox="0 0 154 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g class="status">
                                                        <rect class="status56" x="0.5" y="0.5" width="153" height="20" fill="#C4C4C4" stroke="black"/>
                                                        <rect class="status12" x="0.5" y="0.5" width="21" height="20" fill="${statusColor}" stroke="black"/>
                                                        <rect class="status3" x="21.5" y="0.5" width="35" height="20" fill="${statusColor}" stroke="black"/>
                                                        <rect class="status4" x="56.5" y="0.5" width="35" height="20" fill="${statusColor}" stroke="black"/>
                                                        </g>
                                                        </svg>
                                                    </td>`;
                                break;
                            case '5':
                                statusColor = "#00ff10";
                                td = `<td title="Завершена" data-status="${status}" data-field="${field}"><svg width="154" height="21" viewBox="0 0 154 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g class="status">
                                                        <rect class="status56" x="0.5" y="0.5" width="153" height="20" fill="${statusColor}" stroke="black"/>
                                                        <rect class="status12" x="0.5" y="0.5" width="21" height="20" fill="${statusColor}" stroke="black"/>
                                                        <rect class="status3" x="21.5" y="0.5" width="35" height="20" fill="${statusColor}" stroke="black"/>
                                                        <rect class="status4" x="56.5" y="0.5" width="35" height="20" fill="${statusColor}" stroke="black"/>
                                                        </g>
                                                        </svg>
                                                    </td>`;
                                break;
                            case '6':
                                statusColor = "#C4C4C4";
                                td = `<td title="Отложена" data-status="${status}" data-field="${field}"><svg width="154" height="21" viewBox="0 0 154 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g class="status">
                                                        <rect class="status56" x="0.5" y="0.5" width="153" height="20" fill="${statusColor}" stroke="black"/>
                                                        <rect class="status12" x="0.5" y="0.5" width="21" height="20" fill="${statusColor}" stroke="black"/>
                                                        <rect class="status3" x="21.5" y="0.5" width="35" height="20" fill="${statusColor}" stroke="black"/>
                                                        <rect class="status4" x="56.5" y="0.5" width="35" height="20" fill="${statusColor}" stroke="black"/>
                                                        </g>
                                                        </svg>
                                                    </td>`;
                                break;
                            default:
                                statusColor = "#C4C4C4";
                                td = `<td data-status="${status}" data-field="${field}"><svg width="154" height="21" viewBox="0 0 154 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g class="status">
                                                        <rect class="status56" x="0.5" y="0.5" width="153" height="20" fill="${statusColor}" stroke="black"/>
                                                        <rect class="status12" x="0.5" y="0.5" width="21" height="20" fill="${statusColor}" stroke="black"/>
                                                        <rect class="status3" x="21.5" y="0.5" width="35" height="20" fill="${statusColor}" stroke="black"/>
                                                        <rect class="status4" x="56.5" y="0.5" width="35" height="20" fill="${statusColor}" stroke="black"/>
                                                        </g>
                                                        </svg>
                                                    </td>`;
                        }
                        
                        break;
                    default:
                        td = `<td data-field="${field}">${task[field]}</td>`;
                }
                arrTd += td;
            });
            arrTd += '</tr>';
        });
        return arrTd + '';
    }

    getThead() {
        let arrTh = '';
        let objShowFields = this.objShowFields;
        Object.keys(objShowFields).map((field) => {
            arrTh += `
                                                            <th data-field="${field}">${objShowFields[field]}</th>`
        });
        return arrTh;
    }

    detailInfo(groupKey) {
        let tbody = this.getTbody(groupKey);
        let thead = this.getThead();
        return `<div class="table">
                    <table data-id="${groupKey}">
                        <thead>
                            ${thead}
                        </thead>
                        <tbody>
                            ${tbody}
                        </tbody>
                    </table>
                <div>`;
    }


}