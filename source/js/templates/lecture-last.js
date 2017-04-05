var Handlebars = require("handlebars");module.exports = Handlebars.template({"1":function(depth0,helpers,partials,data,blockParams) {
    return "              <span>"
    + this.escapeExpression(this.lambda(blockParams[0][0], depth0))
    + "</span>\n";
},"3":function(depth0,helpers,partials,data,blockParams) {
    return "              <span class=\"schedule__teacher\">"
    + this.escapeExpression(this.lambda(blockParams[0][0], depth0))
    + "</span>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"schedule__row\">\n    <div class=\"schedule__col schedule__col--wide\" data-label=\"Название\">\n        <a href=\""
    + alias3(((helper = (helper = helpers.video || (depth0 != null ? depth0.video : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"video","hash":{},"data":data,"blockParams":blockParams}) : helper)))
    + "\" class=\"schedule__link\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data,"blockParams":blockParams}) : helper)))
    + "</a>\n    </div>\n    <div class=\"schedule__col schedule__col--medium\" data-label=\"Школа\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.school : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 1, blockParams),"inverse":this.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"schedule__col\" data-label=\"Учитель\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.teacher : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 1, blockParams),"inverse":this.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"schedule__col\" data-label=\"Аудитория\">"
    + alias3(((helper = (helper = helpers.classroom || (depth0 != null ? depth0.classroom : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"classroom","hash":{},"data":data,"blockParams":blockParams}) : helper)))
    + "</div>\n    <div class=\"schedule__col\" data-label=\"Запись\">\n        <a href=\""
    + alias3(((helper = (helper = helpers.video || (depth0 != null ? depth0.video : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"video","hash":{},"data":data,"blockParams":blockParams}) : helper)))
    + "\" class=\"schedule__button\">Смотреть</a>\n    </div>\n</div>";
},"useData":true,"useBlockParams":true});