class Entry{
    constructor(id, userId, dateTime, height, weight, sys, dia){
        this.id = id;
        this.userId = userId;
        this.dateTime = dateTime;
        this.height = height;
        this.weight = weight;
        this.sys = sys;
        this.dia = dia;
    }
}

module.exports = Entry;