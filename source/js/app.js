var module = require('./module');

    module.init();

    var text = "11.01.2010 08:21";
    console.log(text.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1'));
    var date = new Date(text.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1'));
    // alert(date);