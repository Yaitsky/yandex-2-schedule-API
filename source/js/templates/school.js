var Handlebars = require("handlebars");module.exports = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"schools__row\">\n    <div class=\"schools__col schools__col--wide schools__col--title\">\n        "
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\n    </div>\n    <div class=\"schools__col schools__col--small schools__col--count\">\n        "
    + alias3(((helper = (helper = helpers.count || (depth0 != null ? depth0.count : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"count","hash":{},"data":data}) : helper)))
    + "\n    </div>\n    <div class=\"buttons\">\n        <div class=\"buttons__item buttons__item--update\">\n            <i class=\"fa fa-pencil buttons__icon\" aria-hidden=\"true\"></i>\n        </div>\n        <div class=\"buttons__item buttons__item--delete\">\n            <i class=\"fa fa-times buttons__icon\" aria-hidden=\"true\"></i>\n        </div>\n    </div>\n</div>";
},"useData":true});