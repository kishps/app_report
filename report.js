class ReportTable {

    selector = '.report-table'; //контейнер отчета

    constructor(selector) {
        if (selector) this.selector = selector; // контейнер отчета
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
            if (task.closedDate) {return accumulator + 1;} 
            else {return accumulator + 0;} 
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
            progressVal = `data-progress="${timeDurationFact/timeTariff*100}"`;
            timeLeftOver = `<div class="infobar-label">
                                    <span class="label-name">Осталось</span>
                                    ${this.minToHour(timeTariff - timeDurationFact)}
                                </div>`;
        } else if (timeTariff && timeTariff - timeDurationFact < 0) {
            progressVal = `data-progress="${timeDurationFact/timeTariff*100}"`;
            timeLeftOver = `<div class="infobar-label">
                                    <span class="label-name">Перерасход</span>
                                    ${this.minToHour(timeDurationFact - timeTariff)}
                                </div>`;
        } else if (timeTariff && timeTariff - timeDurationFact == 0) {
            progressVal = `data-progress="100"`;
        }
        console.log('timeTariff',timeTariff);
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

    detailInfo(groupKey) {
        return `<div class="table">
        <table data-id="${arrFact[element].ID}">
            <thead>
                <td>
                    Задача
                </td>
                <td>
                    Сделка
                </td>
                <td>
                    Дата закрытия
                </td>
                <td>
                    Группа товаров
                </td>
                <td>
                    Сумма
                </td>
            </thead>
            <tbody>
            </tbody>
        </table>
        <div>`;
    }
}